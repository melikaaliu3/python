import sqlite3

from streamlit import connection

from models import Movie, MovieCreate

def create_conection():
    """Create a database connection"""
    connection = sqlite3.connect("movie.db")
    connection.row_factory = sqlite3.Row
    return connection

def create_table():
    """ Creates tables if they dont exist"""
    connection = create_conection()
    cursor = connection_cursor()
    cursor.execute("""
    Create Table IF DONT EXIST movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
     title TEXT NOT NULL,
     director TEXT NOT NULL
     """)
    connection.commit()
    connection.close()

def create_movie(movie: MovieCreate) -> int:
    """
    ADDS a new movie to the database
    :param movie:
    Args:
    movie(MovieCreate)
    Return:
    int: The id of the new created movie
    :return:
    """

    connection = create_conection()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO movies(title ,Director) Values(?,?)", (movie.title , movie.director))
    connection.commit()
    movie_id = cursor.lastrowid
    connection.close()
    movies = [Movie(id=row[0] , title=row[1], director=row[2]) for row in rows]

    def read_movie(movie_id , int):
        connection = create_conection()
        cursor = connection.cursor()
        cursor.execute("select * from movies where id = ?", (movie_id,) )
        row = cursor fetchone()
        connection.close()
        if row is None:
            return None
        movies = [Movie(id=row[0], title=row[1], director=row[2])
