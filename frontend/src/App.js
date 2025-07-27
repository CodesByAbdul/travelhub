import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Navigation Component
const Navigation = () => {
  const { user, isAuthenticated, logout } = React.useContext(AuthContext);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">✈</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">TravelEase</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link to="/destinations" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Destinations
            </Link>
            {isAuthenticated && (
              <Link to="/bookings" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                My Bookings
              </Link>
            )}
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  <span>👤</span>
                  <span>{user?.name || 'User'}</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/signin"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Sign In Component
const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Mock authentication - replace with real API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      if (formData.email && formData.password) {
        const userData = {
          id: '1',
          name: formData.email.split('@')[0],
          email: formData.email
        };
        login(userData);
        navigate('/');
      } else {
        setError('Please enter both email and password');
      }
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xl">✈</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Account</span>
              </div>
            </div>
            <div className="mt-3 text-center text-sm text-gray-600">
              Use any email and password to sign in
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sign Up Component
const SignUp = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Mock registration - replace with real API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      if (formData.name && formData.email && formData.password) {
        const userData = {
          id: '1',
          name: formData.name,
          email: formData.email
        };
        login(userData);
        navigate('/');
      } else {
        setError('Please fill in all fields');
      }
    } catch (err) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xl">✈</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to existing account
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Hero Section Component with FIXED Search
const HeroSection = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      try {
        await onSearch(searchQuery);
      } finally {
        setIsSearching(false);
      }
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
          Explore breathtaking destinations with AI-powered recommendations and interactive maps
        </p>
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Where do you want to go?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-6 py-4 text-lg rounded-lg border-0 focus:ring-4 focus:ring-blue-300 focus:outline-none"
              disabled={isSearching}
            />
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="bg-yellow-400 text-gray-900 px-8 py-4 text-lg font-semibold rounded-lg hover:bg-yellow-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? 'Searching...' : 'Search Destinations'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// FIXED Destination Categories Component
const DestinationCategories = ({ onCategorySelect }) => {
  const [loadingCategory, setLoadingCategory] = useState(null);
  
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

  const handleCategoryClick = async (category) => {
    setLoadingCategory(category.type);
    try {
      await onCategorySelect(category.type);
    } finally {
      setLoadingCategory(null);
    }
  };

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
              onClick={() => handleCategoryClick(category)}
              className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="h-64 bg-cover bg-center" style={{ backgroundImage: `url(${category.image})` }}>
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-200">{category.description}</p>
                  {loadingCategory === category.type && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
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

// Interactive Leaflet Map Component
const InteractiveMap = ({ destinations }) => {
  const defaultCenter = [20, 0]; // World center
  const defaultZoom = 2;

  if (!destinations || destinations.length === 0) {
    return (
      <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🗺️</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Interactive Map</h3>
          <p className="text-gray-600">No destinations to show</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 rounded-lg overflow-hidden shadow-lg">
      <MapContainer 
        center={defaultCenter} 
        zoom={defaultZoom} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {destinations.map((destination) => (
          <Marker 
            key={destination.id} 
            position={[destination.latitude, destination.longitude]}
          >
            <Popup>
              <div className="text-center">
                <img 
                  src={destination.image_url} 
                  alt={destination.name}
                  className="w-32 h-20 object-cover rounded mb-2"
                />
                <h3 className="font-bold">{destination.name}</h3>
                <p className="text-sm text-gray-600">{destination.country}</p>
                <p className="text-sm">Rating: {destination.rating} ⭐</p>
                <p className="text-sm text-blue-600 font-semibold">{destination.price_range}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

// ENHANCED AI Recommendations Component
const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState(['adventure', 'culture', 'relaxation']);

  const availablePreferences = [
    'adventure', 'culture', 'relaxation', 'beach', 'mountain', 'city', 
    'food', 'history', 'nature', 'nightlife', 'budget', 'luxury'
  ];

  const togglePreference = (pref) => {
    setPreferences(prev => 
      prev.includes(pref) 
        ? prev.filter(p => p !== pref)
        : [...prev, pref]
    );
  };

  const getRecommendations = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/recommendations`, {
        preferences: preferences
      });
      
      const recs = response.data.ai_recommendations || response.data.fallback_recommendations || [];
      setRecommendations(recs);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setRecommendations([
        {
          destination: "Error loading recommendations",
          reason: "Please try again later",
          confidence: 0
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">AI-Powered Recommendations</h2>
          <p className="text-xl text-gray-600 mb-8">Tell us your preferences and get personalized suggestions</p>
          
          {/* Preferences Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Select your travel preferences:</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {availablePreferences.map(pref => (
                <button
                  key={pref}
                  onClick={() => togglePreference(pref)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    preferences.includes(pref)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={getRecommendations}
            disabled={loading || preferences.length === 0}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Getting AI Recommendations..." : "🤖 Get AI Recommendations"}
          </button>
        </div>
        
        {recommendations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec, index) => (
              <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{rec.destination}</h3>
                <p className="text-gray-700 mb-3">{rec.reason}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600 font-semibold">
                    Confidence: {Math.round(rec.confidence * 100)}%
                  </span>
                  <span className="text-xs text-blue-600 font-medium">Powered by OpenAI</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Main Home Component with FIXED functionality
const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
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
        setSearchQuery(query);
        setCurrentFilter(type || 'search');
      } else {
        const params = type ? `?type=${type}` : '';
        response = await axios.get(`${API}/destinations${params}`);
        setCurrentFilter(type || 'all');
      }
      
      setDestinations(response.data);
      setFilteredDestinations(response.data);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      setDestinations([]);
      setFilteredDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleSearch = async (query) => {
    await fetchDestinations(null, query);
    // Scroll to results
    document.getElementById('destinations-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCategorySelect = async (type) => {
    await fetchDestinations(type);
    // Scroll to results
    document.getElementById('destinations-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDestinationSelect = (destination) => {
    navigate(`/destination/${destination.id}`, { state: { destination } });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCurrentFilter('all');
    fetchDestinations();
  };

  return (
    <div className="min-h-screen">
      <HeroSection onSearch={handleSearch} />
      <DestinationCategories onCategorySelect={handleCategorySelect} />
      
      {/* Popular Destinations Section */}
      <section id="destinations-section" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {currentFilter === 'all' && 'Popular Destinations'}
              {currentFilter === 'search' && `Search Results for "${searchQuery}"`}
              {currentFilter !== 'all' && currentFilter !== 'search' && `${currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)} Destinations`}
            </h2>
            <p className="text-xl text-gray-600">
              {filteredDestinations.length} amazing places found
            </p>
            
            {(currentFilter !== 'all') && (
              <button
                onClick={clearFilters}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Show all destinations
              </button>
            )}
          </div>
          
          <InteractiveMap destinations={filteredDestinations} />
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading destinations...</p>
            </div>
          ) : filteredDestinations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No destinations found</h3>
              <p className="text-gray-600 mb-4">Try a different search or browse our categories</p>
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Show all destinations
              </button>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
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

            {/* Map for individual destination */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Location</h3>
              <div className="h-64 rounded-lg overflow-hidden">
                <MapContainer 
                  center={[destination.latitude, destination.longitude]} 
                  zoom={10} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[destination.latitude, destination.longitude]}>
                    <Popup>
                      <div className="text-center">
                        <h3 className="font-bold">{destination.name}</h3>
                        <p className="text-sm text-gray-600">{destination.country}</p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
            
            <div className="flex gap-4">
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

const ProfilePage = () => (
  <div className="pt-16 min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Profile</h1>
      <p className="text-gray-600">User profile management coming soon!</p>
    </div>
  </div>
);

// Main App Component with Auth
function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/destination/:id" element={<DestinationDetail />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;