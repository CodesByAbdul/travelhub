import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { destinationApi } from '../services/api';
import DestinationCard from '../components/DestinationCard';
import InteractiveMap from '../components/InteractiveMap';
import { Search, Filter, MapPin, Grid, List, SortAsc } from 'lucide-react';

const DestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { value: 'all', label: 'All Destinations' },
    { value: 'beach', label: 'Beach' },
    { value: 'mountain', label: 'Mountain' },
    { value: 'city', label: 'City' },
    { value: 'adventure', label: 'Adventure' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'rating', label: 'Rating (High to Low)' },
    { value: 'price', label: 'Price (Low to High)' }
  ];

  // Fetch destinations on component mount
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await destinationApi.getAll();
        setDestinations(response.data || []);
        setFilteredDestinations(response.data || []);
      } catch (err) {
        setError('Failed to load destinations. Please try again later.');
        console.error('Error fetching destinations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Filter and sort destinations whenever dependencies change
  useEffect(() => {
    let filtered = [...destinations];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(destination =>
        destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        destination.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        destination.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(destination =>
        destination.category === selectedCategory
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'price':
          return (a.price || 0) - (b.price || 0);
        default:
          return 0;
      }
    });

    setFilteredDestinations(filtered);
  }, [destinations, searchQuery, selectedCategory, sortBy]);

  const handleDestinationClick = (destinationId) => {
    navigate(`/destinations/${destinationId}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('name');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded-lg mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Explore Destinations</h1>
          <p className="text-gray-600 text-lg">Discover amazing places around the world</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="w-full lg:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full lg:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div className="w-full lg:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full lg:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1 rounded ${viewMode === 'map' ? 'bg-white shadow-sm' : ''}`}
              >
                <MapPin className="w-4 h-4" />
              </button>
            </div>

            {/* Clear Filters */}
            {(searchQuery || selectedCategory !== 'all' || sortBy !== 'name') && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredDestinations.length} of {destinations.length} destinations
          </p>
        </div>

        {/* Content */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.length > 0 ? (
              filteredDestinations.map(destination => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  onClick={() => handleDestinationClick(destination.id)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="max-w-md mx-auto">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No destinations found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or filters to find more destinations.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden h-96">
            <InteractiveMap
              destinations={filteredDestinations}
              onDestinationClick={handleDestinationClick}
            />
          </div>
        )}

        {/* Load More Button (if pagination is needed) */}
        {filteredDestinations.length > 0 && destinations.length > filteredDestinations.length && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Load More Destinations
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationsPage;