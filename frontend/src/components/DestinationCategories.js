import React, { useState } from 'react';

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
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-200">{category.description}</p>
                  {loadingCategory === category.type && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
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

export default DestinationCategories;