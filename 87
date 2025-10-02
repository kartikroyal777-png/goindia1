import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Shield, Thermometer } from 'lucide-react';
import TehsilCard from './TehsilCard';
import { City, Tehsil } from '../../types';
import { supabase } from '../../lib/supabase';

const CityPage: React.FC = () => {
  const { cityId } = useParams<{ cityId: string }>();
  const navigate = useNavigate();
  const [city, setCity] = useState<City | null>(null);
  const [tehsils, setTehsils] = useState<Tehsil[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!cityId) return;
      setLoading(true);
      setError(null);

      // Fetch city details
      const { data: cityData, error: cityError } = await supabase
        .from('cities')
        .select('*')
        .eq('id', cityId)
        .single();
      
      if (cityError || !cityData) {
        setError(`Could not find the requested city: ${cityError?.message || 'Not found'}`);
        console.error(cityError);
        setLoading(false);
        return;
      }
      setCity(cityData);

      // Fetch tehsils for the city
      const { data: tehsilsData, error: tehsilsError } = await supabase
        .from('tehsils')
        .select('*')
        .eq('city_id', cityId);
      
      if (tehsilsError) {
        setError(`Could not fetch areas for this city: ${tehsilsError.message}`);
        console.error(tehsilsError);
      } else {
        setTehsils(tehsilsData);
      }
      
      setLoading(false);
    };

    fetchData();
  }, [cityId]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-300"></div>
        <div className="p-4">
          <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error || !city) {
    return <div className="p-4 text-center text-red-500">{typeof error === 'string' ? error : JSON.stringify(error) || 'City not found.'}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Header */}
      <div className="relative h-64">
        <img src={city.thumbnail_url} alt={city.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <motion.button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-full"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </motion.button>

        <div className="absolute bottom-4 left-4 text-white">
          <h1 className="text-3xl font-semibold">{city.name}</h1>
          <p className="text-lg">{city.short_tagline}</p>
        </div>
      </div>

      {/* City Info */}
      <div className="p-4">
        <p className="text-gray-600 mb-4">{city.description}</p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <MapPin className="w-5 h-5 text-orange-500 mx-auto mb-1" />
            <p className="text-sm">{city.state}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <Shield className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <p className="text-sm">{city.safety_score}/10 Safety</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <Thermometer className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <p className="text-sm">{city.best_time_to_visit}</p>
          </div>
        </div>
      </div>

      {/* Tehsils List */}
      <div className="p-4">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Explore Areas in {city.name}</h2>
        <div className="grid grid-cols-1 gap-4">
          {tehsils.length > 0 ? tehsils.map((tehsil, index) => (
            <motion.div
              key={tehsil.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TehsilCard tehsil={tehsil} onClick={() => navigate(`/tehsil/${tehsil.id}`)} />
            </motion.div>
          )) : (
            <p className="text-gray-500">No specific areas listed for this city yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CityPage;
