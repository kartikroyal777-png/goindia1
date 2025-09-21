import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import CategoryBar from './CategoryBar';
import CityCard from './CityCard';
import { categories } from '../../data/mockData';
import { City } from '../../types';
import { supabase } from '../../lib/supabase';
import { Bot } from 'lucide-react';
import AssistantModal from '../Assistant/AssistantModal';

const cityCategoryMapping: { [key: string]: string[] } = {
  'b9c4d5e2-5b4e-4c9d-8a8f-3e2b4c5d6e7f': ['Forts', 'Temples'], // Agra
  'a8b3c4d1-6a5d-5b8e-9f7e-4d1c3b2a1a0b': ['Forts', 'Temples', 'Markets'], // Jaipur
  'c7d2e3f0-7b6c-6c9d-8e6d-5e2d4c3b2b1c': ['Temples', 'Food'], // Varanasi
  'd6e1f2g9-8c7b-7d8e-9a5a-6f3e5d4c3c2d': ['Beaches', 'Food'], // Goa
  'e5f0a1b8-9d8c-8e9f-a94b-7a4f6e5d4d3e': ['Lakes', 'Beaches', 'Wildlife'], // Kerala
  'f4a9b0c7-ad9d-9f8a-b83c-8b5a7f6e5e4f': ['Forts', 'Temples', 'Markets', 'Food'], // Delhi
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [allCities, setAllCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('popularity_score', { ascending: false });

      if (error) {
        setError('Could not fetch cities. Please try again later.');
        console.error(error);
      } else {
        setAllCities(data);
        setFilteredCities(data);
      }
      setLoading(false);
    };
    fetchCities();
  }, []);
  
  const handleCitySelect = (city: City) => {
    navigate(`/city/${city.id}`);
  };

  useEffect(() => {
    let filtered = allCities;
    if (selectedCategory) {
      const categoryName = categories.find(c => c.id === selectedCategory)?.name;
      if (categoryName) {
        filtered = filtered.filter(city => {
          const cityCategories = cityCategoryMapping[city.id];
          return cityCategories && cityCategories.includes(categoryName);
        });
      }
    }
    if (searchQuery) {
      filtered = filtered.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.state.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredCities(filtered);
  }, [searchQuery, selectedCategory, allCities]);

  return (
    <div className="pb-24">
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 px-4 pt-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Discover <span className="text-orange-500">Incredible India</span>
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Your trusted guide for exploring India safely and authentically
          </p>
          <SearchBar onSearch={setSearchQuery} />
        </motion.div>
      </div>

      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {searchQuery || selectedCategory ? `Results (${filteredCities.length})` : 'Popular Destinations'}
          </h2>
        </div>

        {loading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : filteredCities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No destinations found</h3>
            <p className="text-gray-500">Try adjusting your search or changing the category.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCities.map((city, index) => (
              <CityCard
                key={city.id}
                city={city}
                onClick={handleCitySelect}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      <motion.button
        onClick={() => setIsAssistantOpen(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full shadow-lg flex items-center justify-center z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Open AI Assistant"
      >
        <Bot className="w-7 h-7" />
      </motion.button>
      
      <AnimatePresence>
        {isAssistantOpen && <AssistantModal onClose={() => setIsAssistantOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
