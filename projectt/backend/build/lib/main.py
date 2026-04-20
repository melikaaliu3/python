import os
import fastapi
import fastapi.middleware.cors
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager

app = fastapi.FastAPI(title="Movies Management API", version="1.0.0")

app.add_middleware(
    fastapi.middleware.cors.CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Database connection
def get_db_url():
    return os.environ.get("POSTGRES_URL", "")


@contextmanager
def get_db_connection():
    conn = psycopg2.connect(get_db_url(), cursor_factory=RealDictCursor)
    try:
        yield conn
    finally:
        conn.close()


# Pydantic Models
class MovieCreate(BaseModel):
    title: str
    description: Optional[str] = None
    release_year: Optional[int] = None
    genre: Optional[str] = None
    director: Optional[str] = None
    rating: Optional[float] = None
    poster_url: Optional[str] = None
    duration_minutes: Optional[int] = None


class MovieUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    release_year: Optional[int] = None
    genre: Optional[str] = None
    director: Optional[str] = None
    rating: Optional[float] = None
    poster_url: Optional[str] = None
    duration_minutes: Optional[int] = None


class Movie(BaseModel):
    id: str
    title: str
    description: Optional[str]
    release_year: Optional[int]
    genre: Optional[str]
    director: Optional[str]
    rating: Optional[float]
    poster_url: Optional[str]
    duration_minutes: Optional[int]
    created_at: datetime
    updated_at: datetime


# Health check endpoint
@app.get("/health")
async def health():
    return {"status": "ok", "service": "Movies Management API"}


# Get all movies with optional filtering
@app.get("/movies")
async def get_movies(
    genre: Optional[str] = None,
    year: Optional[int] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = "created_at",
    order: Optional[str] = "desc"
):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            query = "SELECT * FROM movies WHERE 1=1"
            params = []
            
            if genre:
                query += " AND LOWER(genre) = LOWER(%s)"
                params.append(genre)
            
            if year:
                query += " AND release_year = %s"
                params.append(year)
            
            if search:
                query += " AND (LOWER(title) LIKE LOWER(%s) OR LOWER(director) LIKE LOWER(%s))"
                params.extend([f"%{search}%", f"%{search}%"])
            
            # Validate sort_by to prevent SQL injection
            allowed_sorts = ["title", "release_year", "rating", "created_at", "genre", "director"]
            if sort_by not in allowed_sorts:
                sort_by = "created_at"
            
            order_dir = "DESC" if order.lower() == "desc" else "ASC"
            query += f" ORDER BY {sort_by} {order_dir}"
            
            cur.execute(query, params)
            movies = cur.fetchall()
            
            return {"movies": movies, "total": len(movies)}


# Get a single movie by ID
@app.get("/movies/{movie_id}")
async def get_movie(movie_id: str):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM movies WHERE id = %s", (movie_id,))
            movie = cur.fetchone()
            
            if not movie:
                raise fastapi.HTTPException(status_code=404, detail="Movie not found")
            
            return movie


# Create a new movie
@app.post("/movies", status_code=201)
async def create_movie(movie: MovieCreate):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO movies (title, description, release_year, genre, director, rating, poster_url, duration_minutes)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *
                """,
                (
                    movie.title,
                    movie.description,
                    movie.release_year,
                    movie.genre,
                    movie.director,
                    movie.rating,
                    movie.poster_url,
                    movie.duration_minutes
                )
            )
            new_movie = cur.fetchone()
            conn.commit()
            return new_movie


# Update a movie
@app.put("/movies/{movie_id}")
async def update_movie(movie_id: str, movie: MovieUpdate):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Build dynamic update query
            updates = []
            params = []
            
            if movie.title is not None:
                updates.append("title = %s")
                params.append(movie.title)
            if movie.description is not None:
                updates.append("description = %s")
                params.append(movie.description)
            if movie.release_year is not None:
                updates.append("release_year = %s")
                params.append(movie.release_year)
            if movie.genre is not None:
                updates.append("genre = %s")
                params.append(movie.genre)
            if movie.director is not None:
                updates.append("director = %s")
                params.append(movie.director)
            if movie.rating is not None:
                updates.append("rating = %s")
                params.append(movie.rating)
            if movie.poster_url is not None:
                updates.append("poster_url = %s")
                params.append(movie.poster_url)
            if movie.duration_minutes is not None:
                updates.append("duration_minutes = %s")
                params.append(movie.duration_minutes)
            
            if not updates:
                raise fastapi.HTTPException(status_code=400, detail="No fields to update")
            
            updates.append("updated_at = NOW()")
            params.append(movie_id)
            
            query = f"UPDATE movies SET {', '.join(updates)} WHERE id = %s RETURNING *"
            cur.execute(query, params)
            updated_movie = cur.fetchone()
            
            if not updated_movie:
                raise fastapi.HTTPException(status_code=404, detail="Movie not found")
            
            conn.commit()
            return updated_movie


# Delete a movie
@app.delete("/movies/{movie_id}")
async def delete_movie(movie_id: str):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM movies WHERE id = %s RETURNING id", (movie_id,))
            deleted = cur.fetchone()
            
            if not deleted:
                raise fastapi.HTTPException(status_code=404, detail="Movie not found")
            
            conn.commit()
            return {"message": "Movie deleted successfully", "id": movie_id}


# Get all unique genres
@app.get("/genres")
async def get_genres():
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT DISTINCT genre FROM movies WHERE genre IS NOT NULL ORDER BY genre")
            genres = [row["genre"] for row in cur.fetchall()]
            return {"genres": genres}


# Get movie statistics
@app.get("/stats")
async def get_stats():
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT 
                    COUNT(*) as total_movies,
                    AVG(rating) as average_rating,
                    MIN(release_year) as oldest_movie_year,
                    MAX(release_year) as newest_movie_year,
                    COUNT(DISTINCT genre) as total_genres,
                    COUNT(DISTINCT director) as total_directors
                FROM movies
            """)
            stats = cur.fetchone()
            return stats
