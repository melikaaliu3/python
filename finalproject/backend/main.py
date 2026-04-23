import os
from typing import Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from supabase import acreate_client, AsyncClient

app = FastAPI(title="Movie Management API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase client
supabase: AsyncClient = None


async def get_client() -> AsyncClient:
    global supabase
    if supabase is None:
        supabase = await acreate_client(
            os.environ["SUPABASE_URL"],
            os.environ["SUPABASE_KEY"],
        )
    return supabase


# Pydantic models
class MovieCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    genre: Optional[str] = None
    release_year: Optional[int] = Field(None, ge=1800, le=2100)
    rating: Optional[float] = Field(None, ge=0, le=10)
    duration_minutes: Optional[int] = Field(None, ge=1)
    director: Optional[str] = None
    poster_url: Optional[str] = None
    backdrop_url: Optional[str] = None


class MovieUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    genre: Optional[str] = None
    release_year: Optional[int] = Field(None, ge=1800, le=2100)
    rating: Optional[float] = Field(None, ge=0, le=10)
    duration_minutes: Optional[int] = Field(None, ge=1)
    director: Optional[str] = None
    poster_url: Optional[str] = None
    backdrop_url: Optional[str] = None


class Movie(BaseModel):
    id: str
    title: str
    description: Optional[str]
    genre: Optional[str]
    release_year: Optional[int]
    rating: Optional[float]
    duration_minutes: Optional[int]
    director: Optional[str]
    poster_url: Optional[str]
    backdrop_url: Optional[str]
    created_at: str
    updated_at: str


# API Routes
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Movie Management API"}


@app.get("/movies")
async def get_movies(
    search: Optional[str] = Query(None, description="Search by title"),
    genre: Optional[str] = Query(None, description="Filter by genre"),
    min_rating: Optional[float] = Query(None, ge=0, le=10, description="Minimum rating"),
    sort_by: Optional[str] = Query("created_at", description="Sort field"),
    sort_order: Optional[str] = Query("desc", description="Sort order (asc/desc)"),
    limit: int = Query(50, ge=1, le=100, description="Number of results"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
):
    """Get all movies with optional filters"""
    client = await get_client()
    query = client.table("movies").select("*")

    # Apply search filter
    if search:
        query = query.ilike("title", f"%{search}%")

    # Apply genre filter
    if genre:
        query = query.eq("genre", genre)

    # Apply rating filter
    if min_rating is not None:
        query = query.gte("rating", min_rating)

    # Apply sorting
    desc = sort_order.lower() == "desc"
    query = query.order(sort_by, desc=desc)

    # Apply pagination
    query = query.range(offset, offset + limit - 1)

    result = await query.execute()
    return {"movies": result.data, "count": len(result.data)}


@app.get("/movies/genres")
async def get_genres():
    """Get all unique genres"""
    client = await get_client()
    result = await client.table("movies").select("genre").execute()
    genres = list(set(movie["genre"] for movie in result.data if movie["genre"]))
    genres.sort()
    return {"genres": genres}


@app.get("/movies/stats")
async def get_stats():
    """Get movie statistics"""
    client = await get_client()
    result = await client.table("movies").select("*").execute()
    movies = result.data

    if not movies:
        return {
            "total_movies": 0,
            "average_rating": 0,
            "genres_count": 0,
            "total_duration_hours": 0,
        }

    total_movies = len(movies)
    ratings = [m["rating"] for m in movies if m.get("rating")]
    average_rating = round(sum(ratings) / len(ratings), 1) if ratings else 0
    genres = set(m["genre"] for m in movies if m.get("genre"))
    durations = [m["duration_minutes"] for m in movies if m.get("duration_minutes")]
    total_duration_hours = round(sum(durations) / 60, 1) if durations else 0

    return {
        "total_movies": total_movies,
        "average_rating": average_rating,
        "genres_count": len(genres),
        "total_duration_hours": total_duration_hours,
    }


@app.get("/movies/{movie_id}")
async def get_movie(movie_id: str):
    """Get a single movie by ID"""
    client = await get_client()
    result = await client.table("movies").select("*").eq("id", movie_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Movie not found")

    return result.data[0]


@app.post("/movies", status_code=201)
async def create_movie(movie: MovieCreate):
    """Create a new movie"""
    client = await get_client()
    result = await client.table("movies").insert(movie.model_dump(exclude_none=True)).execute()
    return result.data[0]


@app.patch("/movies/{movie_id}")
async def update_movie(movie_id: str, movie: MovieUpdate):
    """Update an existing movie"""
    client = await get_client()

    # Check if movie exists
    existing = await client.table("movies").select("id").eq("id", movie_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Movie not found")

    # Update movie
    update_data = movie.model_dump(exclude_none=True)
    if update_data:
        result = await client.table("movies").update(update_data).eq("id", movie_id).execute()
        return result.data[0]

    return existing.data[0]


@app.delete("/movies/{movie_id}")
async def delete_movie(movie_id: str):
    """Delete a movie"""
    client = await get_client()

    # Check if movie exists
    existing = await client.table("movies").select("id").eq("id", movie_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Movie not found")

    await client.table("movies").delete().eq("id", movie_id).execute()
    return {"message": "Movie deleted successfully"}
