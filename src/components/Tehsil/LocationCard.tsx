import React from 'react';
import { motion } from 'framer-motion';
import { Tag, Shield, Clock } from 'lucide-react';
import { Location } from '../../types';

interface LocationCardProps {
  location: Location;
  onClick: () => void;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100"
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative h-40">
        <img src={location.image_url} alt={location.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <h3 className="text-white font-bold text-lg">{location.name}</h3>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{location.short_intro}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full">
            <Tag className="w-3 h-3 text-gray-500" />
            <span>{location.category}</span>
          </div>
          <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
            <Shield className="w-3 h-3 text-green-600" />
            <span className="text-green-700">{location.safety_risks.safety_score}/10 Safety</span>
          </div>
          <div className="flex items-center space-x-1 bg-blue-100 px-2 py-1 rounded-full">
            <Clock className="w-3 h-3 text-blue-600" />
            <span className="text-blue-700">{location.basic_info.opening_hours.split('(')[0].trim()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LocationCard;
