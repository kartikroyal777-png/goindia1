import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Loader2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Location } from '../types';
import LocationCard from '../components/Tehsil/LocationCard';
import { motion } from 'framer-motion';

const SavedPlacesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedLocations = async () => {
      if (!user) {
        setError("You need to be logged in to see saved places.");
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data: saved, error: savedError } = await supabase
        .from('saved_locations')
        .select('location_id')
        .eq('user_id', user.id);

      if (savedError) {
        setError("Could not fetch your saved places.");
        console.error(savedError);
        setLoading(false);
        return;
      }

      const locationIds = saved.map(s => s.location_id);
      if (locationIds.length === 0) {
        setSavedLocations([]);
        setLoading(false);
        return;
      }

      const { data: locations, error: locationsError } = await supabase
        .from('locations')
        .select('*, images:location_images(*)')
        .in('id', locationIds);

      if (locationsError) {
        setError("Could not load location details.");
        console.error(locationsError);
      } else {
        setSavedLocations(locations as unknown as Location[]);
      }
      setLoading(false);
    };

    fetchSavedLocations();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center space-x-4">
        <motion.button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </motion.button>
        <h1 className="text-xl font-bold text-gray-900">Saved Places</h1>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex justify-center pt-20"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
        ) : error ? (
          <div className="text-center pt-20 text-red-500 flex flex-col items-center">
            <AlertTriangle className="w-10 h-10 mb-2" />
            {error}
          </div>
        ) : savedLocations.length === 0 ? (
          <div className="text-center pt-20">
            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-800">No Places Saved Yet</h2>
            <p className="text-gray-500">Tap the heart icon on any location to save it here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedLocations.map((location, index) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <LocationCard location={location} onClick={() => navigate(`/location/${location.id}`)} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPlacesPage;
