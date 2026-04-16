from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class MovieBase(BaseModel):
    title: str
    release_year: int
    director_id: int
    genre_id: int

class MovieCreate(MovieBase):
    pass

class Movie(MovieBase):
    id: int
    class Config:
        orm_mode = True