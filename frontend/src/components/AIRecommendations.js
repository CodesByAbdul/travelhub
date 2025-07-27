import React, { useState } from 'react';
import { destinationApi } from '../services/api';

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState(['adventure', 'culture', 'relaxation']);
  const [error, setError] = useState('');

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
    if (preferences.length === 0) {
      setError('Please select at least one preference');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await destinationApi.getRecommendations(preferences);
      const recs = response.data.ai_recommendations || response.data.fallback_recommendations || [];
      setRecommendations(recs);
      
      if (recs.length === 0) {
        setError('No recommendations found. Try different preferences.');
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setError('Failed to get recommendations. Please try again.');
      
      // Fallback recommendations for demo
      setRecommendations([
        {
          destination: "Bali, Indonesia",
          reason: "Perfect blend of culture, relaxation, and adventure with beautiful beaches and rich traditions",
          confidence: 0.92
        },
        {
          destination: "Tokyo, Japan",
          reason: "Urban adventure with incredible culture, history, and food experiences",
          confidence: 0.88
        },
        {
          destination: "Costa Rica",
          reason: "Adventure paradise with diverse nature, mountains, and eco-tourism opportunities",
          confidence: 0.85
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
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    preferences.includes(pref)
                      ? 'bg-blue-600 text-white shadow-md transform scale-105'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {pref.charAt(0).toUpperCase() + pref.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-md mx-auto">
              {error}
            </div>
          )}
          
          <button
            onClick={getRecommendations}
            disabled={loading || preferences.length === 0}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Getting AI Recommendations...
              </span>
            ) : (
              "🤖 Get AI Recommendations"
            )}
          </button>
        </div>
        
        {recommendations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec, index) => (
              <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{rec.destination}</h3>
                  <div className="flex items-center bg-green-100 px-2 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    <span className="text-xs text-green-700 font-semibold">
                      {Math.round(rec.confidence * 100)}%
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">{rec.reason}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-600 font-medium flex items-center">
                    <span className="mr-1">🤖</span>
                    Powered by AI
                  </span>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Learn More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AIRecommendations;