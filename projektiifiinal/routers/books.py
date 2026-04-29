import sqlite3
from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from models.book import Trip, TripCreate
from database import get_db_connection
from auth.security import get_api_key

router = APIRouter()


@router.get("/", response_model=List[Trip])
def get_books():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, trip_id, trip_link, genres, average_rating, published_year FROM trips")
    books = cursor.fetchall()
    conn.close()

    return [
        {
            "id": trip[0],
            "title": trip[1],
            "trip_id": trip[2],
            "trip_link": trip[3],
            "genres": trip[4].split(',') if trip[4] else [],  # Split genre names into a list
            "average_rating": book[5],
            "published_year": book[6]
        }
        for trip in trips
    ]


@router.post("/", response_model=Trips)
def create_trip(book: TripCreate, _: str = Depends(get_api_key)):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        genres = ",".join(trip.genres)  # Convert list of genre names to a comma-separated string
        cursor.execute("INSERT INTO trips (title, trip_id, trip_link, genres, average_rating, published_year) "
                       "VALUES (?, ?, ?, ?, ?, ?)",
                       (trip.title, trip.author_id, trip.trip_link, genres, trip.average_rating, trip.published_year))
        conn.commit()
        book_id = cursor.lastrowid
        return Trip(id=trip_id, **trip.dict())
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"The trip {trip.title}' already exists."
        )
    finally:
        conn.close()


@router.put("/{trip_id}", response_model=Trip)
def update_trip(trip_id: int, trip: TripCreate, _: str = Depends(get_api_key)):
    conn = get_db_connection()
    cursor = conn.cursor()
    genres = ",".join(trip.genres)  # Convert list of genre names to a comma-separated string
    cursor.execute(
        "UPDATE trips SET title = ?, trip_id = ?, trip_link = ?, genres = ?, average_rating = ?, published_year = ? "
        "WHERE id = ?",
        (trip.title, trip.author_id, trip.trip_link, genres, trip.average_rating, trip.published_year, trip_id))
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Trips not found")
    conn.commit()
    conn.close()
    return Trip(id=trip_id, **trip.dict())


@router.delete("/{trip_id}", response_model=dict)
def delete_trip(trip_id: int, _: str = Depends(get_api_key)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM trip WHERE id = ?", (trip_id,))
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Trip not found")
    conn.commit()
    conn.close()
    return {"detail": "Trip deleted"}
