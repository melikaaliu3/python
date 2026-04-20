#!/usr/bin/env python3
"""
Movies Management System - Terminal Interface
A Python CLI for managing movies directly from the terminal.
"""

import os
import sys
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

# ANSI Colors for terminal output
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'


def get_db_connection():
    """Create database connection using environment variables."""
    db_url = os.environ.get("POSTGRES_URL")
    if not db_url:
        print(f"{Colors.RED}Error: POSTGRES_URL environment variable not set{Colors.ENDC}")
        sys.exit(1)
    return psycopg2.connect(db_url, cursor_factory=RealDictCursor)


def print_header():
    """Print application header."""
    print(f"\n{Colors.HEADER}{'='*60}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.CYAN}       MOVIES MANAGEMENT SYSTEM - Terminal Interface{Colors.ENDC}")
    print(f"{Colors.HEADER}{'='*60}{Colors.ENDC}\n")


def print_menu():
    """Print main menu options."""
    print(f"\n{Colors.YELLOW}MAIN MENU{Colors.ENDC}")
    print("-" * 30)
    print("1. List all movies")
    print("2. Search movies")
    print("3. Add new movie")
    print("4. Update movie")
    print("5. Delete movie")
    print("6. View movie details")
    print("7. View statistics")
    print("8. Filter by genre")
    print("9. Exit")
    print("-" * 30)


def list_movies(conn, genre=None, search=None):
    """List all movies with optional filtering."""
    with conn.cursor() as cur:
        query = "SELECT id, title, release_year, genre, rating, director FROM movies WHERE 1=1"
        params = []
        
        if genre:
            query += " AND LOWER(genre) = LOWER(%s)"
            params.append(genre)
        
        if search:
            query += " AND (LOWER(title) LIKE LOWER(%s) OR LOWER(director) LIKE LOWER(%s))"
            params.extend([f"%{search}%", f"%{search}%"])
        
        query += " ORDER BY title"
        cur.execute(query, params)
        movies = cur.fetchall()
        
        if not movies:
            print(f"\n{Colors.YELLOW}No movies found.{Colors.ENDC}")
            return []
        
        print(f"\n{Colors.GREEN}Found {len(movies)} movie(s):{Colors.ENDC}\n")
        print(f"{'#':<4} {'Title':<35} {'Year':<6} {'Genre':<12} {'Rating':<6} {'Director':<20}")
        print("-" * 90)
        
        for i, movie in enumerate(movies, 1):
            rating = f"{movie['rating']:.1f}" if movie['rating'] else "N/A"
            year = movie['release_year'] or "N/A"
            genre = movie['genre'] or "N/A"
            director = (movie['director'] or "N/A")[:20]
            title = movie['title'][:35]
            print(f"{i:<4} {title:<35} {year:<6} {genre:<12} {rating:<6} {director:<20}")
        
        return movies


def search_movies(conn):
    """Search movies by title or director."""
    search_term = input(f"\n{Colors.CYAN}Enter search term: {Colors.ENDC}").strip()
    if not search_term:
        print(f"{Colors.RED}Search term cannot be empty.{Colors.ENDC}")
        return
    list_movies(conn, search=search_term)


def add_movie(conn):
    """Add a new movie to the database."""
    print(f"\n{Colors.CYAN}ADD NEW MOVIE{Colors.ENDC}")
    print("-" * 30)
    
    title = input("Title (required): ").strip()
    if not title:
        print(f"{Colors.RED}Title is required.{Colors.ENDC}")
        return
    
    description = input("Description: ").strip() or None
    
    release_year_str = input("Release Year: ").strip()
    release_year = int(release_year_str) if release_year_str.isdigit() else None
    
    genre = input("Genre: ").strip() or None
    director = input("Director: ").strip() or None
    
    rating_str = input("Rating (0-10): ").strip()
    try:
        rating = float(rating_str) if rating_str else None
        if rating and (rating < 0 or rating > 10):
            print(f"{Colors.YELLOW}Rating must be between 0 and 10. Setting to None.{Colors.ENDC}")
            rating = None
    except ValueError:
        rating = None
    
    duration_str = input("Duration (minutes): ").strip()
    duration = int(duration_str) if duration_str.isdigit() else None
    
    poster_url = input("Poster URL: ").strip() or None
    
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO movies (title, description, release_year, genre, director, rating, duration_minutes, poster_url)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id, title
                """,
                (title, description, release_year, genre, director, rating, duration, poster_url)
            )
            new_movie = cur.fetchone()
            conn.commit()
            print(f"\n{Colors.GREEN}Movie '{new_movie['title']}' added successfully!{Colors.ENDC}")
    except Exception as e:
        conn.rollback()
        print(f"{Colors.RED}Error adding movie: {e}{Colors.ENDC}")


def update_movie(conn):
    """Update an existing movie."""
    movies = list_movies(conn)
    if not movies:
        return
    
    try:
        choice = int(input(f"\n{Colors.CYAN}Enter movie number to update: {Colors.ENDC}"))
        if choice < 1 or choice > len(movies):
            print(f"{Colors.RED}Invalid selection.{Colors.ENDC}")
            return
        
        movie = movies[choice - 1]
        movie_id = movie['id']
        
        print(f"\n{Colors.YELLOW}Leave blank to keep current value{Colors.ENDC}")
        
        title = input(f"Title [{movie['title']}]: ").strip()
        release_year_str = input(f"Release Year [{movie['release_year']}]: ").strip()
        genre = input(f"Genre [{movie['genre']}]: ").strip()
        director = input(f"Director [{movie['director']}]: ").strip()
        rating_str = input(f"Rating [{movie['rating']}]: ").strip()
        
        updates = []
        params = []
        
        if title:
            updates.append("title = %s")
            params.append(title)
        if release_year_str:
            updates.append("release_year = %s")
            params.append(int(release_year_str))
        if genre:
            updates.append("genre = %s")
            params.append(genre)
        if director:
            updates.append("director = %s")
            params.append(director)
        if rating_str:
            updates.append("rating = %s")
            params.append(float(rating_str))
        
        if not updates:
            print(f"{Colors.YELLOW}No changes made.{Colors.ENDC}")
            return
        
        updates.append("updated_at = NOW()")
        params.append(movie_id)
        
        with conn.cursor() as cur:
            query = f"UPDATE movies SET {', '.join(updates)} WHERE id = %s"
            cur.execute(query, params)
            conn.commit()
            print(f"\n{Colors.GREEN}Movie updated successfully!{Colors.ENDC}")
    
    except ValueError:
        print(f"{Colors.RED}Invalid input.{Colors.ENDC}")
    except Exception as e:
        conn.rollback()
        print(f"{Colors.RED}Error updating movie: {e}{Colors.ENDC}")


def delete_movie(conn):
    """Delete a movie from the database."""
    movies = list_movies(conn)
    if not movies:
        return
    
    try:
        choice = int(input(f"\n{Colors.CYAN}Enter movie number to delete: {Colors.ENDC}"))
        if choice < 1 or choice > len(movies):
            print(f"{Colors.RED}Invalid selection.{Colors.ENDC}")
            return
        
        movie = movies[choice - 1]
        confirm = input(f"{Colors.RED}Are you sure you want to delete '{movie['title']}'? (y/n): {Colors.ENDC}").lower()
        
        if confirm == 'y':
            with conn.cursor() as cur:
                cur.execute("DELETE FROM movies WHERE id = %s", (movie['id'],))
                conn.commit()
                print(f"\n{Colors.GREEN}Movie deleted successfully!{Colors.ENDC}")
        else:
            print(f"{Colors.YELLOW}Deletion cancelled.{Colors.ENDC}")
    
    except ValueError:
        print(f"{Colors.RED}Invalid input.{Colors.ENDC}")
    except Exception as e:
        conn.rollback()
        print(f"{Colors.RED}Error deleting movie: {e}{Colors.ENDC}")


def view_movie_details(conn):
    """View detailed information about a movie."""
    movies = list_movies(conn)
    if not movies:
        return
    
    try:
        choice = int(input(f"\n{Colors.CYAN}Enter movie number to view details: {Colors.ENDC}"))
        if choice < 1 or choice > len(movies):
            print(f"{Colors.RED}Invalid selection.{Colors.ENDC}")
            return
        
        movie_id = movies[choice - 1]['id']
        
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM movies WHERE id = %s", (movie_id,))
            movie = cur.fetchone()
            
            print(f"\n{Colors.CYAN}{'='*50}{Colors.ENDC}")
            print(f"{Colors.BOLD}{movie['title']}{Colors.ENDC}")
            print(f"{Colors.CYAN}{'='*50}{Colors.ENDC}")
            print(f"{Colors.YELLOW}Release Year:{Colors.ENDC} {movie['release_year'] or 'N/A'}")
            print(f"{Colors.YELLOW}Genre:{Colors.ENDC} {movie['genre'] or 'N/A'}")
            print(f"{Colors.YELLOW}Director:{Colors.ENDC} {movie['director'] or 'N/A'}")
            print(f"{Colors.YELLOW}Rating:{Colors.ENDC} {movie['rating'] or 'N/A'}/10")
            print(f"{Colors.YELLOW}Duration:{Colors.ENDC} {movie['duration_minutes'] or 'N/A'} minutes")
            print(f"\n{Colors.YELLOW}Description:{Colors.ENDC}")
            print(movie['description'] or 'No description available.')
            print(f"\n{Colors.YELLOW}Added:{Colors.ENDC} {movie['created_at'].strftime('%Y-%m-%d %H:%M')}")
            print(f"{Colors.YELLOW}Updated:{Colors.ENDC} {movie['updated_at'].strftime('%Y-%m-%d %H:%M')}")
            
    except ValueError:
        print(f"{Colors.RED}Invalid input.{Colors.ENDC}")


def view_statistics(conn):
    """Display movie statistics."""
    with conn.cursor() as cur:
        cur.execute("""
            SELECT 
                COUNT(*) as total_movies,
                AVG(rating) as avg_rating,
                MIN(release_year) as oldest_year,
                MAX(release_year) as newest_year,
                COUNT(DISTINCT genre) as total_genres,
                COUNT(DISTINCT director) as total_directors
            FROM movies
        """)
        stats = cur.fetchone()
        
        print(f"\n{Colors.CYAN}MOVIE STATISTICS{Colors.ENDC}")
        print("=" * 40)
        print(f"Total Movies: {stats['total_movies']}")
        print(f"Average Rating: {stats['avg_rating']:.2f}/10" if stats['avg_rating'] else "Average Rating: N/A")
        print(f"Oldest Movie: {stats['oldest_year'] or 'N/A'}")
        print(f"Newest Movie: {stats['newest_year'] or 'N/A'}")
        print(f"Unique Genres: {stats['total_genres']}")
        print(f"Unique Directors: {stats['total_directors']}")
        
        # Genre breakdown
        cur.execute("""
            SELECT genre, COUNT(*) as count 
            FROM movies 
            WHERE genre IS NOT NULL 
            GROUP BY genre 
            ORDER BY count DESC
        """)
        genres = cur.fetchall()
        
        if genres:
            print(f"\n{Colors.YELLOW}Movies by Genre:{Colors.ENDC}")
            for g in genres:
                print(f"  {g['genre']}: {g['count']}")


def filter_by_genre(conn):
    """Filter movies by genre."""
    with conn.cursor() as cur:
        cur.execute("SELECT DISTINCT genre FROM movies WHERE genre IS NOT NULL ORDER BY genre")
        genres = cur.fetchall()
        
        if not genres:
            print(f"{Colors.YELLOW}No genres found.{Colors.ENDC}")
            return
        
        print(f"\n{Colors.CYAN}Available Genres:{Colors.ENDC}")
        for i, g in enumerate(genres, 1):
            print(f"  {i}. {g['genre']}")
        
        try:
            choice = int(input(f"\n{Colors.CYAN}Select genre number: {Colors.ENDC}"))
            if choice < 1 or choice > len(genres):
                print(f"{Colors.RED}Invalid selection.{Colors.ENDC}")
                return
            
            selected_genre = genres[choice - 1]['genre']
            list_movies(conn, genre=selected_genre)
        
        except ValueError:
            print(f"{Colors.RED}Invalid input.{Colors.ENDC}")


def main():
    """Main application loop."""
    print_header()
    
    try:
        conn = get_db_connection()
        print(f"{Colors.GREEN}Connected to database successfully!{Colors.ENDC}")
    except Exception as e:
        print(f"{Colors.RED}Failed to connect to database: {e}{Colors.ENDC}")
        sys.exit(1)
    
    while True:
        print_menu()
        choice = input(f"{Colors.CYAN}Enter your choice (1-9): {Colors.ENDC}").strip()
        
        if choice == '1':
            list_movies(conn)
        elif choice == '2':
            search_movies(conn)
        elif choice == '3':
            add_movie(conn)
        elif choice == '4':
            update_movie(conn)
        elif choice == '5':
            delete_movie(conn)
        elif choice == '6':
            view_movie_details(conn)
        elif choice == '7':
            view_statistics(conn)
        elif choice == '8':
            filter_by_genre(conn)
        elif choice == '9':
            print(f"\n{Colors.GREEN}Thank you for using Movies Management System!{Colors.ENDC}")
            print(f"{Colors.CYAN}Goodbye!{Colors.ENDC}\n")
            conn.close()
            break
        else:
            print(f"{Colors.RED}Invalid option. Please try again.{Colors.ENDC}")


if __name__ == "__main__":
    main()
