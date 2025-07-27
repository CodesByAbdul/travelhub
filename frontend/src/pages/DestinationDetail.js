import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { destinationApi } from '../services/api';
import InteractiveMap from '../components/InteractiveMap';
import { useAuth } from '../contexts/AuthContext';

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [destination, setDestination] = useState(location.state?.destination || null);
  const [loading, setLoading] = useState(!destination);
  const [error, setError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (!destination && id) {
      fetchDestination();
    }
  }, [id, destination]);

  const fetchDestination = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await destinationApi.getById(id);
      setDestination(response.data);
    } catch (error) {
      console.error('Error fetching destination:', error);
      setError('Failed to load destination details');
      
      // Fallback destination for demo
      setDestination({
        id: id,
        name: "Sample Destination",
        country: "Sample Country",
        rating: 4.5,
        price_range: "$$$",
        description: "This is a sample destination for demonstration purposes. The actual destination data could not be loaded.",
        image_url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxsYW5kc2NhcGV8ZW58MHx8fGJsdWV8MTc1MzQyMjI1OXww&ixlib=rb-4.1.0&q=85",
        popular_activities: ["Sightseeing", "Photography", "Local cuisine"],
        best_months: ["May", "June", "September", "October"],
        latitude: 40.7128,
        longitude: -74.0060
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: location.pathname } });
      return;
    }

    setBookingLoading(true);
    try {
      // Simulate booking process
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Booking successful! Check your bookings page for details.');
      navigate('/bookings');
    } catch (error) {
      alert('Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading destination details...</p>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏝️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Destination not found</h2>
          <p className="text-gray-600 mb-6">The destination you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">{error}</p>
            <p className="text-sm text-yellow-600 mt-1">Showing demo data</p>
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-96 bg-cover bg-center" style={{ backgroundImage: `url(${destination.image_url})` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{destination.name}</h1>
              <p className="text-xl opacity-90">{destination.country}</p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="absolute top-6 left-6 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          <div className="p-8">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-8">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center mb-3">
                  {renderStars(destination.rating)}
                  <span className="ml-2 text-gray-600 text-lg">({destination.rating})</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{destination.country}</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600 mb-2">{destination.price_range}</div>
                <div className="text-sm text-gray-600">Price range per person</div>
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this destination</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{destination.description}</p>
            </div>
            
            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Popular Activities
                </h3>
                <div className="space-y-3">
                  {destination.popular_activities?.map((activity, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-green-600 mr-3 text-lg">✓</span>
                      <span className="text-gray-700">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Best Time to Visit
                </h3>
                <div className="flex flex-wrap gap-2">
                  {destination.best_months?.map((month, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm font-medium">
                      {month}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                </svg>
                Location
              </h3>
              <InteractiveMap 
                destinations={[destination]} 
                center={[destination.latitude, destination.longitude]}
                zoom={10}
                height="h-80"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bookingLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Book Now
                  </>
                )}
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="flex-1 sm:flex-none bg-gray-200 text-gray-800 px-8 py-4 rounded-lg hover:bg-gray-300 font-semibold text-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Search
              </button>
              
              <button className="flex-1 sm:flex-none bg-yellow-100 text-yellow-800 px-8 py-4 rounded-lg hover:bg-yellow-200 font-semibold text-lg transition-colors duration-200">
                <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;