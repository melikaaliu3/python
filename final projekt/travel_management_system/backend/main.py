from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime

from database import get_db, create_tables, engine
from database import User, Destination, Trip, Booking
from schemas import *

app = FastAPI(title="Travel Management System", description="A comprehensive travel booking and management system")

# Mount static files and templates
app.mount("/static", StaticFiles(directory="frontend/static"), name="static")
templates = Jinja2Templates(directory="frontend/templates")

# Create database tables on startup
@app.on_event("startup")
def startup_event():
    create_tables()

# Utility functions
def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def generate_booking_reference():
    return f"TRV-{uuid.uuid4().hex[:8].upper()}"

# Root endpoint
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# User endpoints
@app.post("/api/users/", response_model=User)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # In a real app, you would hash the password here
    hashed_password = user.password + "_hashed"  # Simplified for demo
    
    db_user = User(
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        phone=user.phone,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/api/users/", response_model=List[User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@app.get("/api/users/{user_id}", response_model=User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = get_user_by_id(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.put("/api/users/{user_id}", response_model=User)
def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    db_user = get_user_by_id(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    for field, value in user.dict(exclude_unset=True).items():
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

@app.delete("/api/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = get_user_by_id(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(db_user)
    db.commit()
    return {"message": "User deleted successfully"}

# Destination endpoints
@app.post("/api/destinations/", response_model=Destination)
def create_destination(destination: DestinationCreate, db: Session = Depends(get_db)):
    db_destination = Destination(**destination.dict())
    db.add(db_destination)
    db.commit()
    db.refresh(db_destination)
    return db_destination

@app.get("/api/destinations/", response_model=List[Destination])
def read_destinations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    destinations = db.query(Destination).offset(skip).limit(limit).all()
    return destinations

@app.get("/api/destinations/{destination_id}", response_model=Destination)
def read_destination(destination_id: int, db: Session = Depends(get_db)):
    db_destination = db.query(Destination).filter(Destination.id == destination_id).first()
    if db_destination is None:
        raise HTTPException(status_code=404, detail="Destination not found")
    return db_destination

@app.put("/api/destinations/{destination_id}", response_model=Destination)
def update_destination(destination_id: int, destination: DestinationUpdate, db: Session = Depends(get_db)):
    db_destination = db.query(Destination).filter(Destination.id == destination_id).first()
    if db_destination is None:
        raise HTTPException(status_code=404, detail="Destination not found")
    
    for field, value in destination.dict(exclude_unset=True).items():
        setattr(db_destination, field, value)
    
    db.commit()
    db.refresh(db_destination)
    return db_destination

@app.delete("/api/destinations/{destination_id}")
def delete_destination(destination_id: int, db: Session = Depends(get_db)):
    db_destination = db.query(Destination).filter(Destination.id == destination_id).first()
    if db_destination is None:
        raise HTTPException(status_code=404, detail="Destination not found")
    
    db.delete(db_destination)
    db.commit()
    return {"message": "Destination deleted successfully"}

# Trip endpoints
@app.post("/api/trips/", response_model=Trip)
def create_trip(trip: TripCreate, user_id: int, db: Session = Depends(get_db)):
    db_user = get_user_by_id(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_trip = Trip(**trip.dict(), user_id=user_id)
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip

@app.get("/api/trips/", response_model=List[Trip])
def read_trips(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    trips = db.query(Trip).offset(skip).limit(limit).all()
    return trips

@app.get("/api/trips/{trip_id}", response_model=Trip)
def read_trip(trip_id: int, db: Session = Depends(get_db)):
    db_trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if db_trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")
    return db_trip

@app.get("/api/users/{user_id}/trips", response_model=List[Trip])
def read_user_trips(user_id: int, db: Session = Depends(get_db)):
    db_user = get_user_by_id(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    trips = db.query(Trip).filter(Trip.user_id == user_id).all()
    return trips

@app.put("/api/trips/{trip_id}", response_model=Trip)
def update_trip(trip_id: int, trip: TripUpdate, db: Session = Depends(get_db)):
    db_trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if db_trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    for field, value in trip.dict(exclude_unset=True).items():
        setattr(db_trip, field, value)
    
    db.commit()
    db.refresh(db_trip)
    return db_trip

@app.delete("/api/trips/{trip_id}")
def delete_trip(trip_id: int, db: Session = Depends(get_db)):
    db_trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if db_trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    db.delete(db_trip)
    db.commit()
    return {"message": "Trip deleted successfully"}

# Booking endpoints
@app.post("/api/bookings/", response_model=Booking)
def create_booking(booking: BookingCreate, user_id: int, db: Session = Depends(get_db)):
    db_user = get_user_by_id(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_trip = db.query(Trip).filter(Trip.id == booking.trip_id).first()
    if db_trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    db_destination = db.query(Destination).filter(Destination.id == booking.destination_id).first()
    if db_destination is None:
        raise HTTPException(status_code=404, detail="Destination not found")
    
    db_booking = Booking(
        **booking.dict(),
        user_id=user_id,
        booking_reference=generate_booking_reference()
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

@app.get("/api/bookings/", response_model=List[Booking])
def read_bookings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    bookings = db.query(Booking).offset(skip).limit(limit).all()
    return bookings

@app.get("/api/bookings/{booking_id}", response_model=BookingWithDetails)
def read_booking(booking_id: int, db: Session = Depends(get_db)):
    db_booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if db_booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    return db_booking

@app.get("/api/users/{user_id}/bookings", response_model=List[BookingWithDetails])
def read_user_bookings(user_id: int, db: Session = Depends(get_db)):
    db_user = get_user_by_id(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    bookings = db.query(Booking).filter(Booking.user_id == user_id).all()
    return bookings

@app.put("/api/bookings/{booking_id}", response_model=Booking)
def update_booking(booking_id: int, booking: BookingUpdate, db: Session = Depends(get_db)):
    db_booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if db_booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    for field, value in booking.dict(exclude_unset=True).items():
        setattr(db_booking, field, value)
    
    db.commit()
    db.refresh(db_booking)
    return db_booking

@app.delete("/api/bookings/{booking_id}")
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    db_booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if db_booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    db.delete(db_booking)
    db.commit()
    return {"message": "Booking deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
