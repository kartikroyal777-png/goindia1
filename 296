import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { SavedPlace } from '../types';
import LocationCard from '../components/Tehsil/LocationCard';

const SavedPlacesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedPlaces = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('saved_places')
        .select('*, locations(*, images:location_images(*))')
        .eq('user_id', user.id);
      
      if (data) {
        setSavedPlaces(data as SavedPlace[]);
      }
      setLoading(false);
    };
    fetchSavedPlaces();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center space-x-4">
        <motion.button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </motion.button>
        <h1 className="text-xl font-semibold text-gray-900">Saved Places</h1>
      </div>
      <div className="p-4">
        {loading ? (
          <p>Loading saved places...</p>
        ) : savedPlaces.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">No Saved Places Yet</h2>
            <p className="text-gray-500 mt-2">Tap the heart icon on any location to save it here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
            {savedPlaces.map((place, index) => (
              <motion.div 
                key={place.location_id} 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ delay: index * 0.05 }}
              >
                <LocationCard location={place.locations} onClick={() => navigate(`/location/${place.location_id}`)} />
              </motion.div>
            ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPlacesPage;
