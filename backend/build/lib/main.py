import fastapi
import fastapi.middleware.cors
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
import sqlite3
import os

app = fastapi.FastAPI(title="Travel Management API")

app.add_middleware(
    fastapi.middleware.cors.CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database path
DB_PATH = os.path.join(os.path.dirname(__file__), "travel.db")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            phone TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Create destinations table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS destinations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            country TEXT NOT NULL,
            description TEXT,
            image_url TEXT,
            price_per_day REAL NOT NULL,
            rating REAL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Create trips table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS trips (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            destination_id INTEGER NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            guests INTEGER DEFAULT 1,
            total_price REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (destination_id) REFERENCES destinations (id)
        )
    """)
    
    # Create bookings table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            trip_id INTEGER NOT NULL,
            booking_type TEXT NOT NULL,
            booking_ref TEXT,
            details TEXT,
            price REAL,
            status TEXT DEFAULT 'confirmed',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (trip_id) REFERENCES trips (id)
        )
    """)
    
    # Insert sample destinations if none exist
    cursor.execute("SELECT COUNT(*) FROM destinations")
    if cursor.fetchone()[0] == 0:
        sample_destinations = [
            ("Paris", "France", "The City of Light - famous for the Eiffel Tower, world-class museums, and exquisite cuisine.", "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800", 250.0, 4.8),
            ("Tokyo", "Japan", "A fascinating blend of traditional culture and cutting-edge technology.", "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800", 200.0, 4.9),
            ("New York", "USA", "The city that never sleeps - iconic landmarks, Broadway shows, and diverse neighborhoods.", "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800", 300.0, 4.7),
            ("Bali", "Indonesia", "Tropical paradise with stunning beaches, ancient temples, and lush rice terraces.", "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800", 150.0, 4.6),
            ("Rome", "Italy", "The Eternal City - ancient ruins, Vatican City, and incredible Italian food.", "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800", 220.0, 4.8),
            ("Dubai", "UAE", "A futuristic metropolis with luxury shopping, ultramodern architecture, and desert adventures.", "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800", 350.0, 4.5),
        ]
        cursor.executemany(
            "INSERT INTO destinations (name, country, description, image_url, price_per_day, rating) VALUES (?, ?, ?, ?, ?, ?)",
            sample_destinations
        )
    
    # Insert sample user if none exist
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        cursor.execute(
            "INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)",
            ("John Traveler", "john@example.com", "password123", "+1234567890")
        )
    
    conn.commit()
    conn.close()


# Initialize database on startup
init_db()


# Pydantic Models
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    phone: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None


class DestinationResponse(BaseModel):
    id: int
    name: str
    country: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    price_per_day: float
    rating: float


class TripCreate(BaseModel):
    user_id: int
    destination_id: int
    start_date: str
    end_date: str
    guests: int = 1
    notes: Optional[str] = None


class TripResponse(BaseModel):
    id: int
    user_id: int
    destination_id: int
    destination_name: Optional[str] = None
    destination_country: Optional[str] = None
    destination_image: Optional[str] = None
    start_date: str
    end_date: str
    guests: int
    total_price: float
    status: str
    notes: Optional[str] = None


class BookingCreate(BaseModel):
    trip_id: int
    booking_type: str
    booking_ref: Optional[str] = None
    details: Optional[str] = None
    price: Optional[float] = None


class BookingResponse(BaseModel):
    id: int
    trip_id: int
    booking_type: str
    booking_ref: Optional[str] = None
    details: Optional[str] = None
    price: Optional[float] = None
    status: str


# Health check
@app.get("/health")
async def health():
    return {"status": "ok", "database": "sqlite"}


# User endpoints
@app.get("/users")
async def get_users():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, phone FROM users")
    users = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"users": users}


@app.get("/users/{user_id}")
async def get_user(user_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, phone FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(row)
    raise fastapi.HTTPException(status_code=404, detail="User not found")


@app.post("/users")
async def create_user(user: UserCreate):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)",
            (user.name, user.email, user.password, user.phone)
        )
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()
        return {"id": user_id, "name": user.name, "email": user.email, "phone": user.phone}
    except sqlite3.IntegrityError:
        conn.close()
        raise fastapi.HTTPException(status_code=400, detail="Email already exists")


# Destination endpoints
@app.get("/destinations")
async def get_destinations():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM destinations ORDER BY rating DESC")
    destinations = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"destinations": destinations}


@app.get("/destinations/{destination_id}")
async def get_destination(destination_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM destinations WHERE id = ?", (destination_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(row)
    raise fastapi.HTTPException(status_code=404, detail="Destination not found")


# Trip endpoints
@app.get("/trips")
async def get_trips(user_id: Optional[int] = None):
    conn = get_db()
    cursor = conn.cursor()
    if user_id:
        cursor.execute("""
            SELECT t.*, d.name as destination_name, d.country as destination_country, d.image_url as destination_image
            FROM trips t
            JOIN destinations d ON t.destination_id = d.id
            WHERE t.user_id = ?
            ORDER BY t.start_date DESC
        """, (user_id,))
    else:
        cursor.execute("""
            SELECT t.*, d.name as destination_name, d.country as destination_country, d.image_url as destination_image
            FROM trips t
            JOIN destinations d ON t.destination_id = d.id
            ORDER BY t.start_date DESC
        """)
    trips = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"trips": trips}


@app.get("/trips/{trip_id}")
async def get_trip(trip_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT t.*, d.name as destination_name, d.country as destination_country, d.image_url as destination_image
        FROM trips t
        JOIN destinations d ON t.destination_id = d.id
        WHERE t.id = ?
    """, (trip_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(row)
    raise fastapi.HTTPException(status_code=404, detail="Trip not found")


@app.post("/trips")
async def create_trip(trip: TripCreate):
    conn = get_db()
    cursor = conn.cursor()
    
    # Get destination price
    cursor.execute("SELECT price_per_day FROM destinations WHERE id = ?", (trip.destination_id,))
    dest = cursor.fetchone()
    if not dest:
        conn.close()
        raise fastapi.HTTPException(status_code=404, detail="Destination not found")
    
    # Calculate total price
    start = datetime.strptime(trip.start_date, "%Y-%m-%d")
    end = datetime.strptime(trip.end_date, "%Y-%m-%d")
    days = (end - start).days
    if days <= 0:
        days = 1
    total_price = dest["price_per_day"] * days * trip.guests
    
    cursor.execute("""
        INSERT INTO trips (user_id, destination_id, start_date, end_date, guests, total_price, notes, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed')
    """, (trip.user_id, trip.destination_id, trip.start_date, trip.end_date, trip.guests, total_price, trip.notes))
    
    conn.commit()
    trip_id = cursor.lastrowid
    conn.close()
    
    return {
        "id": trip_id,
        "user_id": trip.user_id,
        "destination_id": trip.destination_id,
        "start_date": trip.start_date,
        "end_date": trip.end_date,
        "guests": trip.guests,
        "total_price": total_price,
        "status": "confirmed",
        "notes": trip.notes
    }


@app.put("/trips/{trip_id}/status")
async def update_trip_status(trip_id: int, status: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE trips SET status = ? WHERE id = ?", (status, trip_id))
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    if affected == 0:
        raise fastapi.HTTPException(status_code=404, detail="Trip not found")
    return {"message": "Status updated", "status": status}


@app.delete("/trips/{trip_id}")
async def delete_trip(trip_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM bookings WHERE trip_id = ?", (trip_id,))
    cursor.execute("DELETE FROM trips WHERE id = ?", (trip_id,))
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    if affected == 0:
        raise fastapi.HTTPException(status_code=404, detail="Trip not found")
    return {"message": "Trip deleted"}


# Booking endpoints
@app.get("/bookings")
async def get_bookings(trip_id: Optional[int] = None):
    conn = get_db()
    cursor = conn.cursor()
    if trip_id:
        cursor.execute("SELECT * FROM bookings WHERE trip_id = ?", (trip_id,))
    else:
        cursor.execute("SELECT * FROM bookings")
    bookings = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"bookings": bookings}


@app.post("/bookings")
async def create_booking(booking: BookingCreate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO bookings (trip_id, booking_type, booking_ref, details, price)
        VALUES (?, ?, ?, ?, ?)
    """, (booking.trip_id, booking.booking_type, booking.booking_ref, booking.details, booking.price))
    conn.commit()
    booking_id = cursor.lastrowid
    conn.close()
    return {
        "id": booking_id,
        "trip_id": booking.trip_id,
        "booking_type": booking.booking_type,
        "booking_ref": booking.booking_ref,
        "details": booking.details,
        "price": booking.price,
        "status": "confirmed"
    }


# Dashboard stats
@app.get("/stats")
async def get_stats():
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM trips")
    total_trips = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM trips WHERE status = 'confirmed'")
    active_trips = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM destinations")
    total_destinations = cursor.fetchone()[0]
    
    cursor.execute("SELECT COALESCE(SUM(total_price), 0) FROM trips")
    total_revenue = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM users")
    total_users = cursor.fetchone()[0]
    
    conn.close()
    
    return {
        "total_trips": total_trips,
        "active_trips": active_trips,
        "total_destinations": total_destinations,
        "total_revenue": total_revenue,
        "total_users": total_users
    }
