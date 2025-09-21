import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search city, place or keyword (e.g., forts, lakes)" 
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = [
    'Taj Mahal, Agra',
    'Forts in Rajasthan',
    'Kerala backwaters',
    'Goa beaches',
    'Delhi monuments',
    'Mumbai street food'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="relative">
      <motion.form
        onSubmit={handleSubmit}
        className="relative"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`relative flex items-center bg-white rounded-xl border transition-all duration-300 ${
          isFocused ? 'border-orange-500 shadow-lg shadow-orange-100' : 'border-gray-200 shadow-sm'
        }`}>
          <Search className="absolute left-4 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-500 bg-transparent rounded-xl focus:outline-none text-sm"
          />
        </div>
      </motion.form>

      {/* Auto-suggestions */}
      {isFocused && query.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 z-10 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 max-h-60 overflow-y-auto"
        >
          {suggestions
            .filter(suggestion => 
              suggestion.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 5)
            .map((suggestion, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setQuery(suggestion);
                  onSearch(suggestion);
                  setIsFocused(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-50 last:border-b-0"
                whileHover={{ backgroundColor: '#f9fafb' }}
              >
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">{suggestion}</span>
              </motion.button>
            ))}
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;
