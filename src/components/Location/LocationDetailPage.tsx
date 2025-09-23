import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Info, Car, Shield, Globe, DollarSign, Wifi, Utensils, Handshake, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
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
];

const LocationDetailPage: React.FC = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const navigate = useNavigate();
  const [location, setLocation] = useState<Location | null>(null);
  const [tehsil, setTehsil] = useState<Tehsil | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!locationId) return;
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('locations')
        .select('*, tehsils(*), images:location_images(*)')
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

  const images = location?.images && location.images.length > 0 
    ? location.images.map(i => i.image_url) 
    : location?.image_url ? [location.image_url] : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return <div className="p-4 text-center">Loading location details...</div>;
  }

  if (error || !location || !tehsil) {
    return <div className="p-4 text-center text-red-500">{error || 'Location not found.'}</div>;
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'about':
        return (
          <div>
            <h2 className="text-xl font-bold mb-2">About {location.name}</h2>
            <p className="text-gray-600 mb-4">{location.short_intro}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-semibold text-gray-800">Opening Hours</p>
                    <p className="text-gray-600">{location.basic_info.opening_hours}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-semibold text-gray-800">Best Time to Visit</p>
                    <p className="text-gray-600">{location.basic_info.best_time_to_visit}</p>
                </div>
            </div>
          </div>
        );
      case 'transport':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Getting Here</h2>
            <ul className="space-y-3 text-sm">
                <li className="flex items-start"><MapPin className="w-4 h-4 text-orange-500 mt-1 mr-2 flex-shrink-0"/><span><strong>Nearest Airport:</strong> {location.access_transport.nearest_airport}</span></li>
                <li className="flex items-start"><MapPin className="w-4 h-4 text-orange-500 mt-1 mr-2 flex-shrink-0"/><span><strong>Public Transport:</strong> {location.access_transport.public_transport_guide}</span></li>
                <li className="flex items-start"><MapPin className="w-4 h-4 text-orange-500 mt-1 mr-2 flex-shrink-0"/><span><strong>Taxi Estimate:</strong> {location.access_transport.taxi_fare_estimate}</span></li>
                <li className="flex items-start"><MapPin className="w-4 h-4 text-orange-500 mt-1 mr-2 flex-shrink-0"/><span><strong>Last Mile:</strong> {location.access_transport.last_mile_access}</span></li>
            </ul>
          </div>
        );
      case 'safety':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Safety & Risks</h2>
            <div className="mb-4 bg-green-50 p-3 rounded-lg">
                <p className="font-bold text-green-800">Overall Safety Score: {location.safety_risks.safety_score}/10</p>
            </div>
            <h3 className="font-semibold mb-2">Common Scams to Avoid:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 mb-4">
                {location.safety_risks.common_scams.map((scam, i) => <li key={i}>{scam}</li>)}
            </ul>
            <h3 className="font-semibold mb-2">Emergency Contacts:</h3>
            <ul className="text-sm text-gray-600">
                {location.safety_risks.emergency_contacts.map((contact, i) => <li key={i}><strong>{contact.name}:</strong> {contact.number}</li>)}
            </ul>
          </div>
        );
      case 'insights':
         return (
          <div>
            <h2 className="text-xl font-bold mb-4">Local Insights</h2>
            <h3 className="font-semibold mb-2">Cultural Etiquette:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 mb-4">
              {location.local_insights.cultural_etiquette.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
             <h3 className="font-semibold mb-2">Tips for Women:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 mb-4">
              {location.local_insights.women_specific_tips.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
          </div>
        );
       case 'costs':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Costs & Money</h2>
            <ul className="space-y-3 text-sm">
                <li><strong>Average Budget:</strong> {location.costs_money.average_budget}</li>
                <li><strong>Entry Fee (Local):</strong> {location.basic_info.entry_fee.local}</li>
                <li><strong>Entry Fee (Foreigner):</strong> {location.basic_info.entry_fee.foreigner}</li>
                <li><strong>ATMs:</strong> {location.costs_money.nearby_atms}</li>
                <li><strong>Digital Payments:</strong> {location.costs_money.digital_payments_accepted ? 'Widely Accepted' : 'Limited'}</li>
                <li><strong>Haggling:</strong> {location.costs_money.haggling_needed}</li>
            </ul>
          </div>
        );
      case 'amenities':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2"><Wifi className="w-5 h-5 text-blue-500"/><span>WiFi: {location.amenities.wifi_signal}</span></div>
              <div className="flex items-center space-x-2"><span>Toilets: {location.amenities.toilets}</span></div>
              <div className="flex items-center space-x-2"><span>Seating: {location.amenities.seating ? 'Available' : 'Limited'}</span></div>
              <div className="flex items-center space-x-2"><span>Water Refills: {location.amenities.water_refill_points ? 'Available' : 'Not Available'}</span></div>
            </div>
          </div>
        );
      case 'food':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Food & Stay</h2>
            <h3 className="font-semibold mb-2">Local Specialty to Try:</h3>
            <p className="text-gray-600 mb-4">{location.food_stay.local_specialty}</p>
            <h3 className="font-semibold mb-2">Recommended Nearby Restaurants:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              {location.food_stay.nearby_restaurants.map((r, i) => <li key={i}>{r.name} (Rating: {r.rating}/5)</li>)}
            </ul>
          </div>
        );
      default:
        return <p>Select a tab to see details.</p>;
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Image */}
      <div className="relative h-72 group">
        <AnimatePresence initial={false}>
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt={location.name}
            className="absolute w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeft /></button>
            <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight /></button>
          </>
        )}

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
