from pydantic import BaseModel
from typing import List, Optional


# Base model for Book with relevant fields
class TravelBase(BaseModel):
    title: str
    agency_id: int
    city_link: str
    genres: List[str]  # List of genre names
    average_rating: Optional[float] = None
    published_year: Optional[int] = None


# Model for creating a new trip
class TripCreate(TripBase):
    pass


# Model for the response of a trip, which includes both id and all fields
class TripResponse(TripBase):
    id: int


# Model for a trip with id, inheriting from TripBase
class Trip(TripBase):
    id: int
