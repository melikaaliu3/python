from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None

class User(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class DestinationBase(BaseModel):
    name: str
    country: str
    city: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    rating: Optional[float] = 0.0
    price_per_night: Optional[float] = None

class DestinationCreate(DestinationBase):
    pass

class DestinationUpdate(BaseModel):
    name: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    rating: Optional[float] = None
    price_per_night: Optional[float] = None

class Destination(DestinationBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class TripBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_date: datetime
    end_date: datetime
    budget: Optional[float] = None
    status: Optional[str] = "planned"

class TripCreate(TripBase):
    pass

class TripUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    budget: Optional[float] = None
    status: Optional[str] = None

class Trip(TripBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class BookingBase(BaseModel):
    check_in_date: datetime
    check_out_date: datetime
    number_of_guests: int = 1
    total_price: float
    status: Optional[str] = "confirmed"
    booking_type: Optional[str] = "hotel"

class BookingCreate(BookingBase):
    trip_id: int
    destination_id: int

class BookingUpdate(BaseModel):
    check_in_date: Optional[datetime] = None
    check_out_date: Optional[datetime] = None
    number_of_guests: Optional[int] = None
    total_price: Optional[float] = None
    status: Optional[str] = None
    booking_type: Optional[str] = None

class Booking(BookingBase):
    id: int
    booking_reference: str
    trip_id: int
    destination_id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class BookingWithDetails(Booking):
    user: User
    trip: Trip
    destination: Destination
