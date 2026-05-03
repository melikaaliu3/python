// Travel Management System Frontend JavaScript

// API Base URL
const API_BASE = '/api';

// Global variables
let currentUser = 1; // Default user ID for demo
let destinations = [];
let trips = [];
let bookings = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadDestinations();
    loadTrips();
    loadBookings();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// API Helper Functions
async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        showToast('Error: ' + error.message, 'error');
        throw error;
    }
}

// Destinations Functions
async function loadDestinations() {
    try {
        destinations = await apiCall('/destinations/');
        renderDestinations();
        populateDestinationSelect();
    } catch (error) {
        document.getElementById('destinations-grid').innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <i class="fas fa-map-marked-alt"></i>
                    <h3>No destinations available</h3>
                    <p>Unable to load destinations. Please try again later.</p>
                </div>
            </div>
        `;
    }
}

function renderDestinations() {
    const grid = document.getElementById('destinations-grid');
    
    if (destinations.length === 0) {
        grid.innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <i class="fas fa-map-marked-alt"></i>
                    <h3>No destinations yet</h3>
                    <p>Start by adding some amazing destinations to explore!</p>
                </div>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = destinations.map(dest => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card destination-card">
                <img src="${dest.image_url || 'https://picsum.photos/seed/' + dest.name + '/400/300.jpg'}" 
                     class="card-img-top" alt="${dest.name}" 
                     onerror="this.src='https://picsum.photos/seed/travel/400/300.jpg'">
                <div class="card-body">
                    <h5 class="card-title">${dest.name}</h5>
                    <p class="card-text">
                        <i class="fas fa-map-marker-alt text-primary"></i> ${dest.city}, ${dest.country}
                    </p>
                    <p class="card-text">${dest.description || 'Discover this amazing destination.'}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="rating">
                            ${generateStars(dest.rating || 0)}
                        </div>
                        ${dest.price_per_night ? `<span class="price">$${dest.price_per_night}<span class="currency">/night</span></span>` : ''}
                    </div>
                    <button class="btn btn-primary btn-sm mt-3" onclick="bookDestination(${dest.id})">
                        <i class="fas fa-calendar-check"></i> Book Now
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star empty"></i>';
    }
    return stars;
}

function populateDestinationSelect() {
    const select = document.getElementById('bookingDestination');
    if (!select) return;
    
    select.innerHTML = '<option value="">Select a destination</option>' +
        destinations.map(dest => `<option value="${dest.id}">${dest.name}, ${dest.city}</option>`).join('');
}

// Trips Functions
async function loadTrips() {
    try {
        trips = await apiCall(`/users/${currentUser}/trips`);
        renderTrips();
        populateTripSelect();
    } catch (error) {
        document.getElementById('trips-grid').innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <i class="fas fa-suitcase"></i>
                    <h3>No trips yet</h3>
                    <p>Plan your first adventure!</p>
                </div>
            </div>
        `;
    }
}

function renderTrips() {
    const grid = document.getElementById('trips-grid');
    
    if (trips.length === 0) {
        grid.innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <i class="fas fa-suitcase"></i>
                    <h3>No trips planned yet</h3>
                    <p>Start planning your next adventure!</p>
                </div>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = trips.map(trip => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card trip-card">
                <div class="card-body">
                    <h5 class="card-title">${trip.title}</h5>
                    <p class="card-text">${trip.description || 'No description available.'}</p>
                    <div class="trip-timeline">
                        <div class="timeline-item">
                            <strong>Start:</strong> ${formatDate(trip.start_date)}
                        </div>
                        <div class="timeline-item">
                            <strong>End:</strong> ${formatDate(trip.end_date)}
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="badge status-${trip.status}">${trip.status}</span>
                        ${trip.budget ? `<span class="price">$${trip.budget}</span>` : ''}
                    </div>
                    <div class="mt-3">
                        <button class="btn btn-sm btn-outline-primary" onclick="viewTripDetails(${trip.id})">
                            <i class="fas fa-info-circle"></i> Details
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="addBookingToTrip(${trip.id})">
                            <i class="fas fa-plus"></i> Add Booking
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function populateTripSelect() {
    const select = document.getElementById('bookingTrip');
    if (!select) return;
    
    select.innerHTML = '<option value="">Select a trip</option>' +
        trips.map(trip => `<option value="${trip.id}">${trip.title} (${formatDate(trip.start_date)})</option>`).join('');
}

function showTripForm() {
    const modal = new bootstrap.Modal(document.getElementById('tripModal'));
    modal.show();
}

async function createTrip() {
    const form = document.getElementById('tripForm');
    const formData = new FormData(form);
    
    const tripData = {
        title: document.getElementById('tripTitle').value,
        description: document.getElementById('tripDescription').value,
        start_date: document.getElementById('startDate').value,
        end_date: document.getElementById('endDate').value,
        budget: parseFloat(document.getElementById('tripBudget').value) || null,
        status: 'planned'
    };
    
    if (!tripData.title || !tripData.start_date || !tripData.end_date) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    try {
        const userId = parseInt(document.getElementById('userId').value);
        await apiCall(`/trips/`, 'POST', tripData);
        showToast('Trip created successfully!', 'success');
        bootstrap.Modal.getInstance(document.getElementById('tripModal')).hide();
        form.reset();
        loadTrips();
    } catch (error) {
        showToast('Failed to create trip', 'error');
    }
}

// Bookings Functions
async function loadBookings() {
    try {
        bookings = await apiCall(`/users/${currentUser}/bookings`);
        renderBookings();
    } catch (error) {
        document.getElementById('bookings-grid').innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <i class="fas fa-ticket-alt"></i>
                    <h3>No bookings yet</h3>
                    <p>Start booking your travel experiences!</p>
                </div>
            </div>
        `;
    }
}

function renderBookings() {
    const grid = document.getElementById('bookings-grid');
    
    if (bookings.length === 0) {
        grid.innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <i class="fas fa-ticket-alt"></i>
                    <h3>No bookings yet</h3>
                    <p>Start booking your travel experiences!</p>
                </div>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = bookings.map(booking => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card booking-card">
                <div class="card-body">
                    <h5 class="card-title">${booking.destination.name}</h5>
                    <p class="card-text">
                        <strong>Reference:</strong> ${booking.booking_reference}<br>
                        <strong>Trip:</strong> ${booking.trip.title}<br>
                        <strong>Check-in:</strong> ${formatDate(booking.check_in_date)}<br>
                        <strong>Check-out:</strong> ${formatDate(booking.check_out_date)}<br>
                        <strong>Guests:</strong> ${booking.number_of_guests}<br>
                        <strong>Type:</strong> ${booking.booking_type.replace('_', ' ')}
                    </p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="badge status-${booking.status}">${booking.status}</span>
                        <span class="price">$${booking.total_price}</span>
                    </div>
                    <div class="mt-3">
                        <button class="btn btn-sm btn-outline-danger" onclick="cancelBooking(${booking.id})">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function bookDestination(destinationId) {
    const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
    document.getElementById('bookingDestination').value = destinationId;
    modal.show();
}

function addBookingToTrip(tripId) {
    const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
    document.getElementById('bookingTrip').value = tripId;
    modal.show();
}

async function createBooking() {
    const bookingData = {
        trip_id: parseInt(document.getElementById('bookingTrip').value),
        destination_id: parseInt(document.getElementById('bookingDestination').value),
        check_in_date: document.getElementById('checkInDate').value,
        check_out_date: document.getElementById('checkOutDate').value,
        number_of_guests: parseInt(document.getElementById('numberOfGuests').value),
        total_price: parseFloat(document.getElementById('totalPrice').value),
        booking_type: document.getElementById('bookingType').value
    };
    
    if (!bookingData.trip_id || !bookingData.destination_id || !bookingData.check_in_date || !bookingData.check_out_date) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    try {
        const userId = parseInt(document.getElementById('bookingUserId').value);
        await apiCall(`/bookings/`, 'POST', bookingData);
        showToast('Booking created successfully!', 'success');
        bootstrap.Modal.getInstance(document.getElementById('bookingModal')).hide();
        document.getElementById('bookingForm').reset();
        loadBookings();
    } catch (error) {
        showToast('Failed to create booking', 'error');
    }
}

async function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }
    
    try {
        await apiCall(`/bookings/${bookingId}`, 'PUT', { status: 'cancelled' });
        showToast('Booking cancelled successfully', 'success');
        loadBookings();
    } catch (error) {
        showToast('Failed to cancel booking', 'error');
    }
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function showToast(message, type = 'info') {
    const toastContainer = document.querySelector('.toast-container') || createToastContainer();
    
    const toastId = 'toast-' + Date.now();
    const toastHtml = `
        <div id="${toastId}" class="toast toast-${type}" role="alert">
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
    
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

function showDestinations() {
    document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' });
}

function viewTripDetails(tripId) {
    const trip = trips.find(t => t.id === tripId);
    if (trip) {
        alert(`Trip Details:\n\nTitle: ${trip.title}\nDescription: ${trip.description || 'No description'}\nStart: ${formatDate(trip.start_date)}\nEnd: ${formatDate(trip.end_date)}\nBudget: $${trip.budget || 'Not specified'}\nStatus: ${trip.status}`);
    }
}

// Initialize sample data for demo purposes
async function initializeSampleData() {
    try {
        // Check if destinations exist
        const existingDestinations = await apiCall('/destinations/');
        
        if (existingDestinations.length === 0) {
            // Add sample destinations
            const sampleDestinations = [
                {
                    name: "Paris",
                    country: "France",
                    city: "Paris",
                    description: "The city of love and lights, home to the Eiffel Tower and world-class art museums.",
                    rating: 4.8,
                    price_per_night: 150,
                    image_url: "https://picsum.photos/seed/paris/400/300.jpg"
                },
                {
                    name: "Tokyo",
                    country: "Japan",
                    city: "Tokyo",
                    description: "A vibrant metropolis blending ancient traditions with cutting-edge technology.",
                    rating: 4.9,
                    price_per_night: 120,
                    image_url: "https://picsum.photos/seed/tokyo/400/300.jpg"
                },
                {
                    name: "New York",
                    country: "USA",
                    city: "New York",
                    description: "The city that never sleeps, featuring iconic landmarks and diverse culture.",
                    rating: 4.7,
                    price_per_night: 200,
                    image_url: "https://picsum.photos/seed/newyork/400/300.jpg"
                }
            ];
            
            for (const dest of sampleDestinations) {
                await apiCall('/destinations/', 'POST', dest);
            }
            
            // Add sample user
            const sampleUser = {
                username: "traveler",
                email: "traveler@example.com",
                full_name: "John Traveler",
                phone: "+1234567890",
                password: "password123"
            };
            
            await apiCall('/users/', 'POST', sampleUser);
            
            showToast('Sample data initialized successfully!', 'success');
            loadDestinations();
        }
    } catch (error) {
        console.error('Error initializing sample data:', error);
    }
}

// Call initializeSampleData on page load
initializeSampleData();
