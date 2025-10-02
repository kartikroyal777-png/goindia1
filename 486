import React from 'react';
import { motion } from 'framer-motion';
import { Map, ShieldCheck, Landmark } from 'lucide-react';
import { Tehsil } from '../../types';

interface TehsilCardProps {
  tehsil: Tehsil;
  onClick: () => void;
}

const TehsilCard: React.FC<TehsilCardProps> = ({ tehsil, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 flex"
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <img src={tehsil.thumbnail_url} alt={tehsil.name} className="w-1/3 h-auto object-cover" />
      <div className="p-4 flex-1">
        <h3 className="text-lg text-gray-900">{tehsil.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tehsil.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Landmark className="w-4 h-4 text-orange-500" />
            <span>{tehsil.location_count} Locations</span>
          </div>
          <div className="flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span>{tehsil.safety_rating}/10 Safety</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TehsilCard;
