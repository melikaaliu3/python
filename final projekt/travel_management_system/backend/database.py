from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float, ForeignKey, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./travel_management.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    phone = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    bookings = relationship("Booking", back_populates="user")
    trips = relationship("Trip", back_populates="user")

class Destination(Base):
    __tablename__ = "destinations"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    country = Column(String, nullable=False)
    city = Column(String, nullable=False)
    description = Column(Text)
    image_url = Column(String)
    rating = Column(Float, default=0.0)
    price_per_night = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    bookings = relationship("Booking", back_populates="destination")

class Trip(Base):
    __tablename__ = "trips"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    budget = Column(Float)
    status = Column(String, default="planned")  # planned, ongoing, completed, cancelled
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="trips")
    bookings = relationship("Booking", back_populates="trip")

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    booking_reference = Column(String, unique=True, index=True, nullable=False)
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=False)
    destination_id = Column(Integer, ForeignKey("destinations.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    check_in_date = Column(DateTime, nullable=False)
    check_out_date = Column(DateTime, nullable=False)
    number_of_guests = Column(Integer, default=1)
    total_price = Column(Float, nullable=False)
    status = Column(String, default="confirmed")  # confirmed, cancelled, completed
    booking_type = Column(String, default="hotel")  # hotel, flight, car_rental, activity
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="bookings")
    trip = relationship("Trip", back_populates="bookings")
    destination = relationship("Destination", back_populates="bookings")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    Base.metadata.create_all(bind=engine)
