import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import CategoryBar from './CategoryBar';
import CityCard from './CityCard';
import { City, Category } from '../../types';
import { supabase } from '../../lib/supabase';
import { Bot } from 'lucide-react';
import AssistantModal from '../Assistant/AssistantModal';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [allCities, setAllCities] = useState<City[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      const [citiesRes, categoriesRes] = await Promise.all([
        supabase.from('cities').select('id, name, state, description, short_tagline, thumbnail_url, popularity_score, safety_score, best_time_to_visit, city_categories(category_id)'),
        supabase.from('categories').select('*')
      ]);

      if (citiesRes.error) {
        setError('Could not fetch cities. Please try again later.');
        console.error(citiesRes.error);
      } else {
        setAllCities(citiesRes.data as City[]);
        setFilteredCities(citiesRes.data as City[]);
      }

      if (categoriesRes.error) {
        console.error("Could not fetch categories", categoriesRes.error);
      } else {
        setAllCategories(categoriesRes.data);
      }

      setLoading(false);
    };
    fetchData();
  }, []);
  
  const handleCitySelect = (city: City) => {
    navigate(`/city/${city.id}`);
  };

  useEffect(() => {
    let filtered = allCities;
    if (selectedCategory) {
      filtered = filtered.filter(city => 
        city.city_categories?.some(cc => cc.category_id === selectedCategory)
      );
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
        categories={allCategories}
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
