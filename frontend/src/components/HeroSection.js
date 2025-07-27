import React, { useState } from 'react';

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
      />
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

export default HeroSection;