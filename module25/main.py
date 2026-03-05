from http.client import HTTPException

from fastapi import FastAPI, httpeXCEPTION


import database
import models
from models import Movie, MovieCreate


app =  FastAPI():





@app.get("/")
def read_root():
    return {"message": "Welcome to the movies Crud API"}

@app.post("/movies/", response_model=Movie)
def create_movie(movie: MovieCreate, movie_id=None):
    """Creates a new movie in the database"""
    movie_id - database.create_movie(movie)
    return models.Movie(id.movie_id, **movie.diet())

@app.get("/movies/", response_model=Movie)
def create_movie(movie:MovieCreate, movie_id=None):
    """ Creates a new movie in the database"""
    movie_id - database.create_movie(movie)
    return models.Movie(id.movie_id, **movie.diet())

@app.get("/movies/{movie_id}", response_mode;=Movie)
def read_movie(movie_id,  int):
    """Accepts  a single movie by its ID"""
    movie = database,read_movie(movie_id)
    if movie is None:
        raise HTTPException(status_code=404)
    return movie