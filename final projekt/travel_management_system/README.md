# Travel Management System

A comprehensive travel booking and management system built with FastAPI, SQLite, and modern web technologies.

## Features

- **User Management**: Create, update, and manage user profiles
- **Destination Management**: Browse and discover travel destinations with ratings and pricing
- **Trip Planning**: Create and manage travel itineraries
- **Booking System**: Book hotels, flights, car rentals, and activities
- **Responsive Design**: Modern, mobile-friendly interface
- **Real-time Updates**: Dynamic content loading with smooth animations

## Technology Stack

- **Backend**: FastAPI (Python)
- **Database**: SQLite with SQLAlchemy ORM
- **Frontend**: HTML5, CSS3, JavaScript with Bootstrap 5
- **Icons**: Font Awesome
- **Images**: Picsum Photos for placeholder images

## Project Structure

```
travel_management_system/
├── backend/
│   ├── database.py      # Database models and configuration
│   ├── schemas.py       # Pydantic models for API
│   └── main.py          # FastAPI application and endpoints
├── frontend/
│   ├── templates/
│   │   └── index.html   # Main HTML template
│   └── static/
│       ├── css/
│       │   └── style.css # Custom styling
│       ├── js/
│       │   └── app.js    # Frontend JavaScript
│       └── images/       # Image assets
├── database/            # Database files (SQLite)
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## Installation and Setup

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Step 1: Clone or Download the Project

If you have the project files, navigate to the project directory:
```bash
cd "c:\final projekt\travel_management_system"
```

### Step 2: Create Virtual Environment (Recommended)

```bash
python -m venv venv
```

### Step 3: Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

### Step 4: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 5: Start the Application

#### Method 1: Using uvicorn directly (Recommended)

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

#### Method 2: Using Python script

```bash
python backend/main.py
```

### Step 6: Access the Application

Open your web browser and navigate to:
- **Main Application**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Interactive API**: http://localhost:8000/redoc

## Usage Guide

### 1. Getting Started

When you first open the application, it will automatically create sample data including:
- Sample destinations (Paris, Tokyo, New York)
- A sample user account

### 2. Managing Destinations

- Browse destinations on the main page
- View ratings, prices, and descriptions
- Click "Book Now" to create a booking for a destination

### 3. Planning Trips

1. Click "Plan Trip" button or navigate to "My Trips" section
2. Fill in trip details:
   - Trip title and description
   - Start and end dates
   - Budget (optional)
   - User ID (default: 1 for demo)
3. Click "Create Trip" to save

### 4. Making Bookings

1. Click "Book Now" on any destination or "Add Booking" in trips section
2. Select destination and trip
3. Enter booking details:
   - Check-in and check-out dates
   - Number of guests
   - Total price
   - Booking type (hotel, flight, car rental, activity)
4. Click "Book Now" to confirm

### 5. Viewing Bookings

- Navigate to "My Bookings" section
- View all your bookings with details
- Cancel bookings if needed

## API Endpoints

### Users
- `GET /api/users/` - List all users
- `POST /api/users/` - Create new user
- `GET /api/users/{user_id}` - Get user by ID
- `PUT /api/users/{user_id}` - Update user
- `DELETE /api/users/{user_id}` - Delete user

### Destinations
- `GET /api/destinations/` - List all destinations
- `POST /api/destinations/` - Create new destination
- `GET /api/destinations/{destination_id}` - Get destination by ID
- `PUT /api/destinations/{destination_id}` - Update destination
- `DELETE /api/destinations/{destination_id}` - Delete destination

### Trips
- `GET /api/trips/` - List all trips
- `POST /api/trips/` - Create new trip
- `GET /api/trips/{trip_id}` - Get trip by ID
- `PUT /api/trips/{trip_id}` - Update trip
- `DELETE /api/trips/{trip_id}` - Delete trip
- `GET /api/users/{user_id}/trips` - Get user's trips

### Bookings
- `GET /api/bookings/` - List all bookings
- `POST /api/bookings/` - Create new booking
- `GET /api/bookings/{booking_id}` - Get booking by ID
- `PUT /api/bookings/{booking_id}` - Update booking
- `DELETE /api/bookings/{booking_id}` - Delete booking
- `GET /api/users/{user_id}/bookings` - Get user's bookings

## Database Schema

The application uses SQLite with the following main tables:

- **users**: User information and profiles
- **destinations**: Travel destinations with details and pricing
- **trips**: Travel itineraries linked to users
- **bookings**: Booking records linking trips, destinations, and users

## Development

### Running in Development Mode

Use the `--reload` flag with uvicorn for automatic reloading on code changes:

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Adding New Features

1. **Backend**: Add new models in `database.py` and endpoints in `main.py`
2. **Frontend**: Update HTML templates, CSS styles, and JavaScript functions
3. **API**: New endpoints will automatically appear in the API documentation

### Database Management

The SQLite database file (`travel_management.db`) is created automatically in the project root. To reset the database:

1. Delete the `travel_management.db` file
2. Restart the application

## Troubleshooting

### Common Issues

1. **Port Already in Use**: Change the port number
   ```bash
   uvicorn backend.main:app --reload --port 8001
   ```

2. **Module Not Found**: Make sure you're in the correct directory and have activated the virtual environment

3. **Database Connection Error**: Check that the application has write permissions in the project directory

4. **Images Not Loading**: The application uses placeholder images from Picsum Photos. Check your internet connection.

### Getting Help

- Check the browser console for JavaScript errors
- Review the terminal output for backend errors
- Visit the API documentation at `/docs` for endpoint details

## Contributing

1. Fork the project
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. Feel free to modify and use it as needed.

## Future Enhancements

- User authentication with JWT tokens
- Payment integration
- Email notifications
- Advanced search and filtering
- User reviews and ratings
- Trip sharing features
- Mobile app development
- Real-time chat support
