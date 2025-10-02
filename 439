import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import CategoryBar from './CategoryBar';
import CityCard from './CityCard';
import { City, Category } from '../../types';
import { supabase } from '../../lib/supabase';
import { Bot, Loader2 } from 'lucide-react';
import AssistantModal from '../Assistant/AssistantModal';

const CITIES_PER_PAGE = 6;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [allCities, setAllCities] = useState<City[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [displayedCities, setDisplayedCities] = useState<City[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      
      const [citiesResult, categoriesResult] = await Promise.allSettled([
        supabase.from('cities').select('*, city_categories(category_id)'),
        supabase.from('categories').select('*').order('name')
      ]);

      let errors: string[] = [];

      if (citiesResult.status === 'fulfilled' && !citiesResult.value.error) {
        setAllCities(citiesResult.value.data || []);
      } else {
        const cityError = citiesResult.status === 'rejected' ? citiesResult.reason : (citiesResult.value as any).error;
        console.error("City fetch error:", cityError);
        errors.push(`Could not fetch cities: ${cityError?.message || 'Unknown error'}`);
      }

      if (categoriesResult.status === 'fulfilled' && !categoriesResult.value.error) {
        setAllCategories(categoriesResult.value.data || []);
      } else {
        const categoryError = categoriesResult.status === 'rejected' ? categoriesResult.reason : (categoriesResult.value as any).error;
        console.error("Category fetch error:", categoryError);
        errors.push(`Could not fetch categories: ${categoryError?.message || 'Unknown error'}`);
      }

      if (errors.length > 0) {
        setError(errors.join(' '));
      }

      setLoading(false);
    };
    fetchInitialData();
  }, []);
  
  const handleCitySelect = (city: City) => {
    navigate(`/city/${city.id}`);
  };

  const applyFiltersAndSort = useCallback(() => {
    let filtered = [...allCities];
    if (selectedCategory) {
      filtered = filtered.filter(city => 
        city.city_categories?.some(cc => cc.category_id === selectedCategory)
      );
    }
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(city =>
        city.name.toLowerCase().includes(lowerCaseQuery) ||
        city.state.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    if (!searchQuery && !selectedCategory) {
      filtered.sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0));
    }

    setFilteredCities(filtered);
    setDisplayedCities(filtered.slice(0, CITIES_PER_PAGE));
    setPage(1);
    setHasMore(filtered.length > CITIES_PER_PAGE);
  }, [searchQuery, selectedCategory, allCities]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  const loadMoreCities = () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    const newCities = filteredCities.slice(0, nextPage * CITIES_PER_PAGE);
    setDisplayedCities(newCities);
    setPage(nextPage);
    setHasMore(newCities.length < filteredCities.length);
    setLoadingMore(false);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 px-4 pt-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <h1 className="text-2xl font-medium text-gray-900 mb-2 text-center">
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
          <h2 className="text-lg font-medium text-gray-900">
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
          <div className="text-center py-12 text-red-500">{typeof error === 'string' ? error : JSON.stringify(error)}</div>
        ) : displayedCities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-lg text-gray-900 mb-2">No destinations found</h3>
            <p className="text-gray-500">Try adjusting your search or changing the category.</p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedCities.map((city, index) => (
                <CityCard
                  key={city.id}
                  city={city}
                  onClick={handleCitySelect}
                  index={index}
                />
              ))}
            </div>
            {hasMore && (
              <div className="mt-8 text-center">
                <motion.button
                  onClick={loadMoreCities}
                  disabled={loadingMore}
                  className="px-6 py-2 bg-orange-500 text-white rounded-full shadow-md disabled:opacity-50 flex items-center justify-center mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loadingMore ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Load More'}
                </motion.button>
              </div>
            )}
          </>
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
    </>
  );
};

export default HomePage;
