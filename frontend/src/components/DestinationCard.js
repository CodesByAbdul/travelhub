import React from 'react';

const DestinationCard = ({ destination, onSelect }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxsYW5kc2NhcGV8ZW58MHx8fGJsdWV8MTc1MzQyMjI1OXww&ixlib=rb-4.1.0&q=85';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <div 
        className="h-48 bg-cover bg-center relative group"
        style={{ backgroundImage: `url(${destination.image_url})` }}
      >
        <img
          src={destination.image_url}
          alt={destination.name}
          className="hidden"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 truncate">{destination.name}</h3>
          <span className="text-sm text-blue-600 font-semibold whitespace-nowrap ml-2">
            {destination.price_range}
          </span>
        </div>
        <p className="text-gray-600 mb-3">{destination.country}</p>
        <div className="flex items-center mb-3">
          {renderStars(destination.rating)}
          <span className="ml-2 text-sm text-gray-600">({destination.rating})</span>
        </div>
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {destination.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {destination.popular_activities?.slice(0, 2).map((activity, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {activity}
            </span>
          ))}
          {destination.popular_activities?.length > 2 && (
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              +{destination.popular_activities.length - 2} more
            </span>
          )}
        </div>
        <button
          onClick={() => onSelect(destination)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default DestinationCard;