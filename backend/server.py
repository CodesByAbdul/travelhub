from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, date
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Enums
class DestinationType(str, Enum):
    BEACH = "beach"
    MOUNTAIN = "mountain"
    CITY = "city"
    ADVENTURE = "adventure"
    CULTURAL = "cultural"
    NATURE = "nature"

class BookingStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"

# Models
class Destination(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    country: str
    description: str
    type: DestinationType
    price_range: str  # e.g., "$$", "$$$"
    rating: float = Field(ge=0, le=5)
    image_url: str
    latitude: float
    longitude: float
    popular_activities: List[str] = []
    best_months: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

class DestinationCreate(BaseModel):
    name: str
    country: str
    description: str
    type: DestinationType
    price_range: str
    rating: float = Field(ge=0, le=5)
    image_url: str
    latitude: float
    longitude: float
    popular_activities: List[str] = []
    best_months: List[str] = []

class Hotel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    destination_id: str
    description: str
    price_per_night: float
    rating: float = Field(ge=0, le=5)
    amenities: List[str] = []
    image_url: str
    latitude: float
    longitude: float
    available_from: date
    available_to: date
    created_at: datetime = Field(default_factory=datetime.utcnow)

class HotelCreate(BaseModel):
    name: str
    destination_id: str
    description: str
    price_per_night: float
    rating: float = Field(ge=0, le=5)
    amenities: List[str] = []
    image_url: str
    latitude: float
    longitude: float
    available_from: date
    available_to: date

class Booking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_name: str
    user_email: str
    destination_id: str
    hotel_id: Optional[str] = None
    check_in: date
    check_out: date
    guests: int
    total_price: float
    status: BookingStatus = BookingStatus.PENDING
    special_requests: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BookingCreate(BaseModel):
    user_name: str
    user_email: str
    destination_id: str
    hotel_id: Optional[str] = None
    check_in: date
    check_out: date
    guests: int
    total_price: float
    special_requests: Optional[str] = None

class SearchQuery(BaseModel):
    query: str
    destination_type: Optional[DestinationType] = None
    min_rating: Optional[float] = None
    max_price: Optional[str] = None

# Routes
@api_router.get("/")
async def root():
    return {"message": "Welcome to Travel Booking Platform API!"}

# Destination routes
@api_router.post("/destinations", response_model=Destination)
async def create_destination(destination: DestinationCreate):
    destination_dict = destination.dict()
    destination_obj = Destination(**destination_dict)
    await db.destinations.insert_one(destination_obj.dict())
    return destination_obj

@api_router.get("/destinations", response_model=List[Destination])
async def get_destinations(
    type: Optional[DestinationType] = None,
    limit: int = Query(20, ge=1, le=100)
):
    query = {}
    if type:
        query["type"] = type
    
    destinations = await db.destinations.find(query).limit(limit).to_list(limit)
    return [Destination(**dest) for dest in destinations]

@api_router.get("/destinations/{destination_id}", response_model=Destination)
async def get_destination(destination_id: str):
    destination = await db.destinations.find_one({"id": destination_id})
    if not destination:
        raise HTTPException(status_code=404, detail="Destination not found")
    return Destination(**destination)

@api_router.post("/destinations/search", response_model=List[Destination])
async def search_destinations(search: SearchQuery):
    query = {}
    
    # Text search
    if search.query:
        query["$or"] = [
            {"name": {"$regex": search.query, "$options": "i"}},
            {"country": {"$regex": search.query, "$options": "i"}},
            {"description": {"$regex": search.query, "$options": "i"}}
        ]
    
    # Filter by type
    if search.destination_type:
        query["type"] = search.destination_type
    
    # Filter by rating
    if search.min_rating:
        query["rating"] = {"$gte": search.min_rating}
    
    destinations = await db.destinations.find(query).limit(20).to_list(20)
    return [Destination(**dest) for dest in destinations]

# Hotel routes
@api_router.post("/hotels", response_model=Hotel)
async def create_hotel(hotel: HotelCreate):
    hotel_dict = hotel.dict()
    hotel_obj = Hotel(**hotel_dict)
    
    # Convert date objects to strings for MongoDB storage
    hotel_data = hotel_obj.dict()
    if isinstance(hotel_data.get('available_from'), date):
        hotel_data['available_from'] = hotel_data['available_from'].isoformat()
    if isinstance(hotel_data.get('available_to'), date):
        hotel_data['available_to'] = hotel_data['available_to'].isoformat()
    
    await db.hotels.insert_one(hotel_data)
    return hotel_obj

@api_router.get("/hotels", response_model=List[Hotel])
async def get_hotels(destination_id: Optional[str] = None):
    query = {}
    if destination_id:
        query["destination_id"] = destination_id
    
    hotels = await db.hotels.find(query).limit(20).to_list(20)
    return [Hotel(**hotel) for hotel in hotels]

# Booking routes
@api_router.post("/bookings", response_model=Booking)
async def create_booking(booking: BookingCreate):
    # Verify destination exists
    destination = await db.destinations.find_one({"id": booking.destination_id})
    if not destination:
        raise HTTPException(status_code=404, detail="Destination not found")
    
    # Verify hotel exists if provided
    if booking.hotel_id:
        hotel = await db.hotels.find_one({"id": booking.hotel_id})
        if not hotel:
            raise HTTPException(status_code=404, detail="Hotel not found")
    
    booking_dict = booking.dict()
    booking_obj = Booking(**booking_dict)
    
    # Convert date objects to strings for MongoDB storage
    booking_data = booking_obj.dict()
    if isinstance(booking_data.get('check_in'), date):
        booking_data['check_in'] = booking_data['check_in'].isoformat()
    if isinstance(booking_data.get('check_out'), date):
        booking_data['check_out'] = booking_data['check_out'].isoformat()
    
    await db.bookings.insert_one(booking_data)
    return booking_obj

@api_router.get("/bookings", response_model=List[Booking])
async def get_bookings(user_email: Optional[str] = None):
    query = {}
    if user_email:
        query["user_email"] = user_email
    
    bookings = await db.bookings.find(query).limit(20).to_list(20)
    return [Booking(**booking) for booking in bookings]

@api_router.get("/bookings/{booking_id}", response_model=Booking)
async def get_booking(booking_id: str):
    booking = await db.bookings.find_one({"id": booking_id})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return Booking(**booking)

# AI Recommendations endpoint (placeholder)
@api_router.post("/recommendations")
async def get_recommendations(preferences: dict):
    # Placeholder for AI-powered recommendations
    # Will be implemented once OpenAI API key is provided
    return {
        "message": "AI recommendations will be available once OpenAI API is configured",
        "preferences": preferences,
        "mock_recommendations": [
            {
                "destination": "Paris, France",
                "reason": "Perfect for cultural enthusiasts",
                "confidence": 0.95
            },
            {
                "destination": "Bali, Indonesia", 
                "reason": "Great for beach lovers and relaxation",
                "confidence": 0.87
            }
        ]
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# Initialize with sample data
@app.on_event("startup")
async def initialize_sample_data():
    # Check if we already have destinations
    count = await db.destinations.count_documents({})
    if count == 0:
        sample_destinations = [
            {
                "id": str(uuid.uuid4()),
                "name": "Paris",
                "country": "France",
                "description": "The City of Light, famous for its art, fashion, gastronomy and culture",
                "type": "city",
                "price_range": "$$$",
                "rating": 4.8,
                "image_url": "https://images.unsplash.com/photo-1579656450812-5b1da79e2474?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwzfHx0cmF2ZWwlMjBkZXN0aW5hdGlvbnN8ZW58MHx8fGJsdWV8MTc1MzQyMjI1MXww&ixlib=rb-4.1.0&q=85",
                "latitude": 48.8566,
                "longitude": 2.3522,
                "popular_activities": ["Visit Eiffel Tower", "Louvre Museum", "Seine River Cruise"],
                "best_months": ["May", "June", "September", "October"],
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Bali",
                "country": "Indonesia",
                "description": "Tropical paradise with beautiful beaches, temples, and rice terraces",
                "type": "beach",
                "price_range": "$$",
                "rating": 4.7,
                "image_url": "https://images.unsplash.com/photo-1550399504-8953e1a6ac87?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHx2YWNhdGlvbnxlbnwwfHx8Ymx1ZXwxNzUzNDIyMjU5fDA&ixlib=rb-4.1.0&q=85",
                "latitude": -8.3405,
                "longitude": 115.0920,
                "popular_activities": ["Temple hopping", "Beach relaxation", "Rice terrace tours"],
                "best_months": ["April", "May", "June", "July", "August", "September"],
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Swiss Alps",
                "country": "Switzerland",
                "description": "Breathtaking mountain scenery, perfect for skiing and hiking",
                "type": "mountain",
                "price_range": "$$$$",
                "rating": 4.9,
                "image_url": "https://images.unsplash.com/photo-1511188873902-bf5b1afe2142?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwyfHx0cmF2ZWwlMjBkZXN0aW5hdGlvbnN8ZW58MHx8fGJsdWV8MTc1MzQyMjI1MXww&ixlib=rb-4.1.0&q=85",
                "latitude": 46.5197,
                "longitude": 7.4815,
                "popular_activities": ["Skiing", "Hiking", "Mountain railways"],
                "best_months": ["December", "January", "February", "July", "August"],
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "New York City",
                "country": "USA",
                "description": "The city that never sleeps, iconic skyline and endless attractions",
                "type": "city",
                "price_range": "$$$",
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBkZXN0aW5hdGlvbnN8ZW58MHx8fGJsdWV8MTc1MzQyMjI1MXww&ixlib=rb-4.1.0&q=85",
                "latitude": 40.7128,
                "longitude": -74.0060,
                "popular_activities": ["Statue of Liberty", "Central Park", "Broadway Shows"],
                "best_months": ["April", "May", "September", "October"],
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Dubai Desert",
                "country": "UAE",
                "description": "Luxury desert experience with modern architecture and traditional culture",
                "type": "adventure",
                "price_range": "$$$",
                "rating": 4.5,
                "image_url": "https://images.unsplash.com/photo-1682686580922-2e594f8bdaa7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MXwxfHNlYXJjaHwxfHx2YWNhdGlvbnxlbnwwfHx8Ymx1ZXwxNzUzNDIyMjU5fDA&ixlib=rb-4.1.0&q=85",
                "latitude": 25.2048,
                "longitude": 55.2708,
                "popular_activities": ["Desert safari", "Camel riding", "Luxury shopping"],
                "best_months": ["November", "December", "January", "February", "March"],
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Maldives",
                "country": "Maldives",
                "description": "Tropical island paradise with crystal clear waters and overwater bungalows",
                "type": "beach",
                "price_range": "$$$$",
                "rating": 4.9,
                "image_url": "https://images.unsplash.com/photo-1501426026826-31c667bdf23d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwzfHx2YWNhdGlvbnxlbnwwfHx8Ymx1ZXwxNzUzNDIyMjU5fDA&ixlib=rb-4.1.0&q=85",
                "latitude": 3.2028,
                "longitude": 73.2207,
                "popular_activities": ["Diving", "Snorkeling", "Spa treatments"],
                "best_months": ["November", "December", "January", "February", "March", "April"],
                "created_at": datetime.utcnow()
            }
        ]
        
        await db.destinations.insert_many(sample_destinations)
        logger.info("Sample destinations created successfully")