import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Navigation Component
const Navigation = () => {
  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">✈</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">TravelBook</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link to="/destinations" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Destinations
            </Link>
            <Link to="/bookings" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              My Bookings
            </Link>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Hero Section Component
const HeroSection = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-700">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHw0fHx2YWNhdGlvbnxlbnwwfHx8Ymx1ZXwxNzUzNDIyMjU5fDA&ixlib=rb-4.1.0&q=85')`
        }}
      ></div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Discover Your Next
          <span className="block text-yellow-300">Adventure</span>
        </h1>
        <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto">
          Explore breathtaking destinations with personalized recommendations and interactive maps
        </p>
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Where do you want to go?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-6 py-4 text-lg rounded-lg border-0 focus:ring-4 focus:ring-blue-300 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-yellow-400 text-gray-900 px-8 py-4 text-lg font-semibold rounded-lg hover:bg-yellow-300 transition-colors duration-200"
            >
              Search Destinations
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Destination Categories Component
const DestinationCategories = ({ onCategorySelect }) => {
  const categories = [
    {
      type: "beach",
      name: "Beach Paradise",
      description: "Relax on pristine beaches",
      image: "https://images.unsplash.com/photo-1550399504-8953e1a6ac87?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHx2YWNhdGlvbnxlbnwwfHx8Ymx1ZXwxNzUzNDIyMjU5fDA&ixlib=rb-4.1.0&q=85",
      icon: "🏖️"
    },
    {
      type: "mountain",
      name: "Mountain Escape",
      description: "Adventure in breathtaking peaks",
      image: "https://images.unsplash.com/photo-1511188873902-bf5b1afe2142?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwyfHx0cmF2ZWwlMjBkZXN0aW5hdGlvbnN8ZW58MHx8fGJsdWV8MTc1MzQyMjI1MXww&ixlib=rb-4.1.0&q=85",
      icon: "🏔️"
    },
    {
      type: "city",
      name: "Urban Explorer",
      description: "Discover vibrant city life",
      image: "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBkZXN0aW5hdGlvbnN8ZW58MHx8fGJsdWV8MTc1MzQyMjI1MXww&ixlib=rb-4.1.0&q=85",
      icon: "🏙️"
    },
    {
      type: "adventure",
      name: "Adventure Seeker",
      description: "Thrilling experiences await",
      image: "https://images.unsplash.com/photo-1682686580922-2e594f8bdaa7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MXwxfHNlYXJjaHwxfHx2YWNhdGlvbnxlbnwwfHx8Ymx1ZXwxNzUzNDIyMjU5fDA&ixlib=rb-4.1.0&q=85",
      icon: "🎯"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Adventure</h2>
          <p className="text-xl text-gray-600">What kind of experience are you looking for?</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.type}
              onClick={() => onCategorySelect(category.type)}
              className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="h-64 bg-cover bg-center" style={{ backgroundImage: `url(${category.image})` }}>
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-200">{category.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Destination Card Component
const DestinationCard = ({ destination, onSelect }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${destination.image_url})` }}></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900">{destination.name}</h3>
          <span className="text-sm text-blue-600 font-semibold">{destination.price_range}</span>
        </div>
        <p className="text-gray-600 mb-3">{destination.country}</p>
        <div className="flex items-center mb-3">
          {renderStars(destination.rating)}
          <span className="ml-2 text-sm text-gray-600">({destination.rating})</span>
        </div>
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{destination.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {destination.popular_activities.slice(0, 2).map((activity, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {activity}
            </span>
          ))}
        </div>
        <button
          onClick={() => onSelect(destination)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

// Map Placeholder Component
const MapPlaceholder = ({ destinations }) => {
  return (
    <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🗺️</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Interactive Map</h3>
        <p className="text-gray-600">Google Maps integration will be available soon!</p>
        <p className="text-sm text-gray-500 mt-2">
          Showing {destinations.length} destinations on map
        </p>
      </div>
    </div>
  );
};

// AI Recommendations Component
const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRecommendations = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/recommendations`, {
        preferences: ["cultural", "adventure", "relaxation"]
      });
      setRecommendations(response.data.mock_recommendations || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">AI-Powered Recommendations</h2>
          <p className="text-xl text-gray-600 mb-8">Let our AI suggest perfect destinations based on your preferences</p>
          <button
            onClick={getRecommendations}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Getting Recommendations..." : "🤖 Get AI Recommendations"}
          </button>
        </div>
        
        {recommendations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec, index) => (
              <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{rec.destination}</h3>
                <p className="text-gray-700 mb-3">{rec.reason}</p>
                <div className="flex items-center">
                  <span className="text-sm text-green-600 font-semibold">
                    Confidence: {(rec.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {recommendations.length === 0 && !loading && (
          <div className="text-center bg-yellow-50 p-8 rounded-xl">
            <div className="text-4xl mb-4">🤖</div>
            <p className="text-gray-600">
              OpenAI integration will provide personalized recommendations once API key is configured!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

// Main Home Component
const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchDestinations = async (type = null, query = null) => {
    setLoading(true);
    try {
      let response;
      if (query) {
        response = await axios.post(`${API}/destinations/search`, {
          query: query,
          destination_type: type
        });
      } else {
        const params = type ? `?type=${type}` : '';
        response = await axios.get(`${API}/destinations${params}`);
      }
      setDestinations(response.data);
      setFilteredDestinations(response.data);
    } catch (error) {
      console.error("Error fetching destinations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleSearch = (query) => {
    fetchDestinations(null, query);
  };

  const handleCategorySelect = (type) => {
    fetchDestinations(type);
  };

  const handleDestinationSelect = (destination) => {
    navigate(`/destination/${destination.id}`, { state: { destination } });
  };

  return (
    <div className="min-h-screen">
      <HeroSection onSearch={handleSearch} />
      <DestinationCategories onCategorySelect={handleCategorySelect} />
      
      {/* Popular Destinations Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
            <p className="text-xl text-gray-600">Discover amazing places around the world</p>
          </div>
          
          <MapPlaceholder destinations={filteredDestinations} />
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading destinations...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {filteredDestinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  onSelect={handleDestinationSelect}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <AIRecommendations />
    </div>
  );
};

// Destination Detail Page
const DestinationDetail = () => {
  const { state } = window.history;
  const destination = state?.destination;
  const navigate = useNavigate();

  if (!destination) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Destination not found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-96 bg-cover bg-center" style={{ backgroundImage: `url(${destination.image_url})` }}></div>
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{destination.name}</h1>
                <p className="text-xl text-gray-600">{destination.country}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{destination.price_range}</div>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-400">★★★★★</span>
                  <span className="ml-2 text-gray-600">({destination.rating})</span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 text-lg mb-6">{destination.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Popular Activities</h3>
                <ul className="space-y-2">
                  {destination.popular_activities.map((activity, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-blue-600 mr-2">✓</span>
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Best Time to Visit</h3>
                <div className="flex flex-wrap gap-2">
                  {destination.best_months.map((month, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {month}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex gap-4">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold">
                Book Now
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Back to Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple pages for other routes
const DestinationsPage = () => (
  <div className="pt-16 min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">All Destinations</h1>
      <p className="text-gray-600">Comprehensive destination listing coming soon!</p>
    </div>
  </div>
);

const BookingsPage = () => (
  <div className="pt-16 min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">My Bookings</h1>
      <p className="text-gray-600">Your booking history will appear here!</p>
    </div>
  </div>
);

// Main App Component
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/destination/:id" element={<DestinationDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;