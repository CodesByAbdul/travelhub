import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const InteractiveMap = ({ destinations, center = [20, 0], zoom = 2, height = 'h-64' }) => {
  if (!destinations || destinations.length === 0) {
    return (
      <div className={`bg-gray-100 ${height} rounded-lg flex items-center justify-center`}>
        <div className="text-center">
          <div className="text-4xl mb-4">🗺️</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Interactive Map</h3>
          <p className="text-gray-600">No destinations to show</p>
        </div>
      </div>
    );
  }

  // Calculate center based on destinations if not provided
  let mapCenter = center;
  if (destinations.length > 0 && center[0] === 20 && center[1] === 0) {
    const avgLat = destinations.reduce((sum, dest) => sum + dest.latitude, 0) / destinations.length;
    const avgLng = destinations.reduce((sum, dest) => sum + dest.longitude, 0) / destinations.length;
    mapCenter = [avgLat, avgLng];
  }

  return (
    <div className={`${height} rounded-lg overflow-hidden shadow-lg`}>
      <MapContainer 
        center={mapCenter} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
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
            <Popup className="custom-popup">
              <div className="text-center min-w-[200px]">
                <img 
                  src={destination.image_url} 
                  alt={destination.name}
                  className="w-full h-20 object-cover rounded mb-2"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxsYW5kc2NhcGV8ZW58MHx8fGJsdWV8MTc1MzQyMjI1OXww&ixlib=rb-4.1.0&q=85';
                  }}
                />
                <h3 className="font-bold text-gray-900">{destination.name}</h3>
                <p className="text-sm text-gray-600">{destination.country}</p>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm ml-1">{destination.rating}</span>
                </div>
                <p className="text-sm text-blue-600 font-semibold mt-1">
                  {destination.price_range}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;