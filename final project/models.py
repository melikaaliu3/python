from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(String, default="user")

class Director(Base):
    __tablename__ = "directors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    birthdate = Column(Date)
    movies = relationship("Movie", back_populates="director")

class Genre(Base):
    __tablename__ = "genres"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    movies = relationship("Movie", back_populates="genre")

class Movie(Base):
    __tablename__ = "movies"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    release_year = Column(Integer)
    director_id = Column(Integer, ForeignKey("directors.id"))
    genre_id = Column(Integer, ForeignKey("genres.id"))

    director = relationship("Director", back_populates="movies")
    genre = relationship("Genre", back_populates="movies")
