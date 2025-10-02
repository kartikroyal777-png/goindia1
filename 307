import React from 'react';
import { motion } from 'framer-motion';
import { Star, Shield, Thermometer } from 'lucide-react';
import { City } from '../../types';

interface CityCardProps {
  city: City;
  onClick: (city: City) => void;
  index: number;
}

const CityCard: React.FC<CityCardProps> = ({ city, onClick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(city)}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={city.thumbnail_url}
          alt={city.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Popularity badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
          <Star className="w-3 h-3 text-yellow-500 fill-current" />
          <span className="text-xs text-gray-700">{city.popularity_score}</span>
        </div>
        
        {/* State badge */}
        <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs">
          {city.state}
        </div>
        
        {/* City name overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white text-lg font-medium">{city.name}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{city.short_tagline}</p>
        
        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Safety Score */}
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600">{city.safety_score}/10</span>
            </div>
            
            {/* Best time indicator */}
            <div className="flex items-center space-x-1">
              <Thermometer className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">
                {city.best_time_to_visit.split(' ')[0]}
              </span>
            </div>
          </div>
          
          {/* View button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-orange-500 text-sm hover:text-orange-600 transition-colors"
          >
            Explore →
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CityCard;
