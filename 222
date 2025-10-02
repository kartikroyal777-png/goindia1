import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Landmark } from 'lucide-react';
import LocationCard from '../components/Tehsil/LocationCard';
import { Tehsil, Location, City } from '../types';
import { supabase } from '../lib/supabase';

const TehsilPage: React.FC = () => {
  const { tehsilId } = useParams<{ tehsilId: string }>();
  const navigate = useNavigate();
  const [tehsil, setTehsil] = useState<Tehsil | null>(null);
  const [city, setCity] = useState<City | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!tehsilId) return;
      setLoading(true);
      setError(null);

      // Fetch tehsil details
      const { data: tehsilData, error: tehsilError } = await supabase
        .from('tehsils')
        .select('*, cities(*)')
        .eq('id', tehsilId)
        .single();
      
      if (tehsilError || !tehsilData) {
        setError('Could not find the requested area.');
        console.error(tehsilError);
        setLoading(false);
        return;
      }
      
      const { cities, ...tehsilInfo } = tehsilData;
      setTehsil(tehsilInfo as Tehsil);
      setCity(cities as City);

      // Fetch locations for the tehsil
      const { data: locationsData, error: locationsError } = await supabase
        .from('locations')
        .select('*, details, images:location_images(*)')
        .eq('tehsil_id', tehsilId);
      
      if (locationsError) {
        setError('Could not fetch locations for this area.');
        console.error(locationsError);
      } else {
        setLocations(locationsData as Location[]);
      }
      
      setLoading(false);
    };

    fetchData();
  }, [tehsilId]);

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (error || !tehsil || !city) {
    return <div className="p-4 text-center text-red-500">{error || 'Area not found.'}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Header */}
      <div className="relative h-56">
        <img src={tehsil.thumbnail_url} alt={tehsil.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <motion.button
          onClick={() => navigate(`/city/${city.id}`)}
          className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-full"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </motion.button>

        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-md">{city.name}</p>
          <h1 className="text-3xl">{tehsil.name}</h1>
        </div>
      </div>

      {/* Tehsil Info */}
      <div className="p-4">
        <p className="text-gray-600 mb-4">{tehsil.description}</p>
      </div>

      {/* Locations List */}
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Landmark className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl text-gray-900">
            Popular Locations
          </h2>
        </div>
        <div className="space-y-4">
          {locations.length > 0 ? locations.map((location, index) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <LocationCard location={location} onClick={() => navigate(`/location/${location.id}`)} />
            </motion.div>
          )) : (
             <p className="text-gray-500">No popular locations listed for this area yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TehsilPage;
