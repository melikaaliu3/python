from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas, database
from app.tasks import send_new_movie_email

router = APIRouter()

@router.get("/")
def get_movies(db: Session = Depends(database.get_db)):
    return db.query(models.Movie).all()

@router.post("/")
def create_movie(movie: schemas.MovieCreate, db: Session = Depends(database.get_db)):
    new_movie = models.Movie(**movie.dict())
    db.add(new_movie)
    db.commit()
    db.refresh(new_movie)
    send_new_movie_email.delay(new_movie.title, "user@example.com")
    return new_movi