import sqlite3
from models import Movie, MovieCreate


def create_connection():
    """Creates a connection to the SQLite database."""
    connection = sqlite3.connect("movies.db")
    connection.row_factory = sqlite3.Row
    return connection


def create_table():
    """Creates the movies table in the database if it doesn't exist."""
    connection = create_connection()
    cursor = connection.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS movies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            director TEXT NOT NULL
        )
    """)
    connection.commit()
    connection.close()


create_table()


def create_movie(movie: MovieCreate) -> int:
    """
    Adds a new movie to the database.

    Args:
        movie (MovieCreate): A pydantic model containing the title and director of the movie to be created.

    Returns:
        int: The ID of the newly created movie in the database.
    """
    connection = create_connection()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO movies (title, director) VALUES (?, ?)", (movie.title, movie.director))
    connection.commit()
    movie_id = cursor.lastrowid
    connection.close()
    return movie_id


def read_movies():
    """
    Retrieves all movies from the database.

    Returns:
        list: A list of Movie models representing all movies in the database.
    """
    connection = create_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM movies")
    rows = cursor.fetchall()
    connection.close()
    movies = [Movie(id=row[0], title=row[1], director=row[2]) for row in rows]
    return movies


def read_movie(movie_id: int):
    """
    Retrieves a single movie from the database by its ID.

    Args:
        movie_id (int): The ID of the movie to retrieve.

    Returns:
        Movie: A Movie model representing the retrieved movie.
        Returns None if the movie is not found.
    """
    connection = create_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM movies WHERE id = ?", (movie_id,))
    row = cursor.fetchone()
    connection.close()
    if row is None:
        return None
    return Movie(id=row["id"], title=row["title"], director=row["director"])


def update_movie(movie_id: int, movie: MovieCreate) -> bool:
    """
    Updates an existing movie in the database.

    Args:
        movie_id (int): The ID of the movie to update.
        movie (MovieCreate): A pydantic model containing the new title and director of the movie.

    Returns:
        bool: True if the movie was updated successfully, False otherwise.
    """
    connection = create_connection()
    cursor = connection.cursor()
    cursor.execute("UPDATE movies SET title = ?, director = ? WHERE id = ?", (movie.title, movie.director, movie_id))
    connection.commit()
    updated = cursor.rowcount
    connection.close()
    return updated > 0

def delete_movie(movie_id: int) -> bool:
    """
    Delets a movie from the database by its id
    Args:
    movie_id(id): The id of the movie to delete
    Returns:
        bool : True if the movie was deleted
    """

    connection = create_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM movies WHERE id=?" , (movie_id,))
    connection.commit()
    deleted = cursor.rowcount
    connection.close()
    return deleted > 0