import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { destinationApi } from '../services/api';
import HeroSection from '../components/HeroSection';
import DestinationCategories from '../components/DestinationCategories';
import DestinationCard from '../components/DestinationCard';
import InteractiveMap from '../components/InteractiveMap';
import AIRecommendations from '../components/AIRecommendations';

const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchDestinations = async (type = null, query = null) => {
    setLoading(true);
    setError('');
    
    try {
      let response;
      if (query) {
        response = await destinationApi.search(query, type);
        setSearchQuery(query);
        setCurrentFilter(type || 'search');
      } else {
        response = await destinationApi.getAll(type);
        setCurrentFilter(type || 'all');
      }
      
      const destinationsData = response.data || [];
      setDestinations(destinationsData);
      setFilteredDestinations(destinationsData);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      setError('Failed to load destinations. Please try again.');
      
      // Fallback data for demo
      const fallbackDestinations = [
        {
          id: 1,
          name: "Santorini",
          country: "Greece",
          rating: 4.8,
          price_range: "$$$",
          description: "Beautiful Greek island with stunning sunsets and white-washed buildings overlooking the Aegean Sea.",
          image_url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
          popular_activities: ["Sunset watching", "Wine tasting", "Beach relaxation"],
          best_months: ["May", "June", "September", "October"],
          latitude: 36.3932,
          longitude: 25.4615
        },
        {
          id: 2,
          name: "Bali",
          country: "Indonesia", 
          rating: 4.7,
          price_range: "$$",
          description: "Tropical paradise with ancient temples, lush rice terraces, and pristine beaches.",
          image_url: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          popular_activities: ["Temple visits", "Surfing", "Yoga retreats"],
          best_months: ["April", "May", "June", "July", "August", "September"],
          latitude: -8.3405,
          longitude: 115.0920
        },
        {
          id: 3,
          name: "Tokyo",
          country: "Japan",
          rating: 4.9,
          price_range: "$$$$",
          description: "Vibrant metropolis blending traditional culture with cutting-edge technology and incredible cuisine.",
          image_url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2094&q=80",
          popular_activities: ["Temple visits", "Food tours", "Shopping"],
          best_months: ["March", "April", "May", "October", "November"],
          latitude: 35.6762,
          longitude: 139.6503
        }
      ];
      
      setDestinations(fallbackDestinations);
      setFilteredDestinations(fallbackDestinations);
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
    setTimeout(() => {
      document.getElementById('destinations-section')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleCategorySelect = async (type) => {
    await fetchDestinations(type);
    // Scroll to results
    setTimeout(() => {
      document.getElementById('destinations-section')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleDestinationSelect = (destination) => {
    navigate(`/destination/${destination.id}`, { state: { destination } });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCurrentFilter('all');
    setError('');
    fetchDestinations();
  };

  const getSectionTitle = () => {
    if (currentFilter === 'all') return 'Popular Destinations';
    if (currentFilter === 'search') return `Search Results for "${searchQuery}"`;
    return `${currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)} Destinations`;
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
              {getSectionTitle()}
            </h2>
            <p className="text-xl text-gray-600">
              {filteredDestinations.length} amazing places found
            </p>
            
            {(currentFilter !== 'all') && (
              <button
                onClick={clearFilters}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                ← Show all destinations
              </button>
            )}
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
              <p className="text-yellow-800">{error}</p>
              <p className="text-sm text-yellow-600 mt-1">Showing demo data</p>
            </div>
          )}
          
          <div className="mb-8">
            <InteractiveMap destinations={filteredDestinations} />
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600 text-lg">Loading destinations...</p>
            </div>
          ) : filteredDestinations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No destinations found</h3>
              <p className="text-gray-600 mb-6">Try a different search or browse our categories</p>
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Show all destinations
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

export default Home;