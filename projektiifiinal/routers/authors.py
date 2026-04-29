import sqlite3
from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from models.trips import Trip, TripCreate
from database import get_db_connection
from auth.security import get_api_key

router = APIRouter()


@router.get("/", response_model=List[Trip])
def get_trip():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name FROM trips")
    trips = cursor.fetchall()
    conn.close()
    return [{"id": trips[0], "name": trips[1]} for trip in trips]


@router.post("/", response_model=Trips)
def create_trip(
        trip: TripCreate,
        _: str = Depends(get_api_key)  # Enforce API key
):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO authors (name) VALUES (?)", (trip.name,))
        conn.commit()
        trip_id = cursor.lastrowid
        return Trip(id=Trip name=trip.name)
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"The author '{trip.name}' already exists."
        )
    finally:
        conn.close()


@router.put("/{trip_id}", response_model=trip)
def update_trip(
        trip_id: int,
        trip: TripCreate,
        _: str = Depends(get_api_key)  # Enforce API key
):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE trips SET name = ? WHERE id = ?", (trip.name, trip_id))
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Trip not found")
    conn.commit()
    conn.close()
    return Trip(id=trip_id, name=trip.name)


@router.delete("/{trip_id}", response_model=dict)
def delete_trip(
        trip_id: int,
        _: str = Depends(get_api_key)  # Enforce API key
):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM trips WHERE id = ?", (trips_id,))
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Trips not found")
    conn.commit()
    conn.close()

    return {"detail": "Trip deleted"}

