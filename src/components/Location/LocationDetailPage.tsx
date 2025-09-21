import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Info, Car, Shield, Globe, DollarSign, Wifi, Utensils, Handshake } from 'lucide-react';
import { Location, Tehsil } from '../../types';
import { supabase } from '../../lib/supabase';

const tabs = [
  { id: 'about', label: 'About', icon: Info },
  { id: 'transport', label: 'Transport', icon: Car },
  { id: 'safety', label: 'Safety', icon: Shield },
  { id: 'insights', label: 'Insights', icon: Globe },
  { id: 'costs', label: 'Costs', icon: DollarSign },
  { id: 'amenities', label: 'Amenities', icon: Wifi },
  { id: 'food', label: 'Food & Stay', icon: Utensils },
  { id: 'sponsors', label: 'Bookings', icon: Handshake },
];

const LocationDetailPage: React.FC = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const navigate = useNavigate();
  const [location, setLocation] = useState<Location | null>(null);
  const [tehsil, setTehsil] = useState<Tehsil | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  useEffect(() => {
    const fetchData = async () => {
      if (!locationId) return;
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('locations')
        .select('*, tehsils(*)')
        .eq('id', locationId)
        .single();
      
      if (error || !data) {
        setError('Could not find the requested location.');
        console.error(error);
        setLoading(false);
        return;
      }
      
      const { tehsils, ...locationInfo } = data;
      setLocation(locationInfo as Location);
      setTehsil(tehsils as Tehsil);
      setLoading(false);
    };
    fetchData();
  }, [locationId]);

  if (loading) {
    return <div className="p-4 text-center">Loading location details...</div>;
  }

  if (error || !location || !tehsil) {
    return <div className="p-4 text-center text-red-500">{error || 'Location not found.'}</div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <div className="space-y-4">
            <p>{location.short_intro}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>Hours:</strong> {location.basic_info.opening_hours}</p>
              <p><strong>Best Time:</strong> {location.basic_info.best_time_to_visit}</p>
              <p><strong>Local Fee:</strong> {location.basic_info.entry_fee.local}</p>
              <p><strong>Foreigner Fee:</strong> {location.basic_info.entry_fee.foreigner}</p>
            </div>
          </div>
        );
      case 'transport':
        return (
          <div className="space-y-3 text-sm">
            <p><strong>Nearest Airport:</strong> {location.access_transport.nearest_airport}</p>
            <p><strong>Public Transport:</strong> {location.access_transport.public_transport_guide}</p>
            <p><strong>Taxi Estimate:</strong> {location.access_transport.taxi_fare_estimate}</p>
            <p><strong>Last Mile:</strong> {location.access_transport.last_mile_access}</p>
            <p><strong>Travel Time:</strong> {location.access_transport.travel_time_from_center}</p>
          </div>
        );
      case 'safety':
        return (
          <div className="space-y-4">
            <p className="font-bold text-lg">Safety Score: {location.safety_risks.safety_score}/10</p>
            <div>
              <h4 className="font-semibold">Common Scams:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {location.safety_risks.common_scams.map((scam, i) => <li key={i}>{scam}</li>)}
              </ul>
            </div>
            <p><strong>Pickpocket Risk:</strong> {location.safety_risks.pickpocket_risk}</p>
          </div>
        );
      case 'insights':
         return (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Cultural Etiquette:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {location.local_insights.cultural_etiquette.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </div>
             <div>
              <h4 className="font-semibold">Local Phrases:</h4>
              <ul className="text-sm text-gray-600">
                {location.local_insights.local_phrases.map((p, i) => <li key={i}><strong>{p.phrase}</strong> ({p.translation})</li>)}
              </ul>
            </div>
          </div>
        );
      default:
        return <p>Information for {activeTab} coming soon.</p>;
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Image */}
      <div className="relative h-72">
        <img src={location.image_url} alt={location.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <motion.button
          onClick={() => navigate(`/tehsil/${tehsil.id}`)}
          className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-full z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </motion.button>

        <div className="absolute bottom-4 left-4 text-white z-10">
          <p className="text-md bg-black/30 px-2 py-1 rounded-md inline-block">{location.category}</p>
          <h1 className="text-4xl font-bold mt-1">{location.name}</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 bg-white z-20 border-b border-gray-200">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide px-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-shrink-0 flex items-center space-x-2 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id ? 'text-orange-500' : 'text-gray-500 hover:text-orange-500'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="locationTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LocationDetailPage;
