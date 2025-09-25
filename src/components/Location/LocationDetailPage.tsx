import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Info, Car, Shield, Globe, DollarSign, Wifi, Utensils, ChevronLeft, ChevronRight, MapPin, 
  AlertTriangle, MessageSquare, Wallet, Speaker, Star, Building, Clock, Sun, Trees, Camera, Users,
  Heart, CheckCircle, XCircle, Calendar, Cloud, Droplets, Wind, Wheelchair, BadgeHelp, Hospital,
  GitBranch, Eye, Image as ImageIcon, Video, Atom, Check, Thermometer, Users2, BrainCircuit, Gem, HandCoins, Microscope, Building2, Sparkles
} from 'lucide-react';
import { Location, Tehsil, City, LocationImage } from '../../types';
import { supabase } from '../../lib/supabase';

type LocationWithDetails = Location & {
  tehsil: Tehsil & {
    city: City;
  };
  images: LocationImage[];
};

const LocationDetailPage: React.FC = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const navigate = useNavigate();
  const [location, setLocation] = useState<LocationWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      if (!locationId) return;
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('locations')
        .select('*, tehsil:tehsils(*, city:cities(*)), images:location_images(*)')
        .eq('id', locationId)
        .single();
      
      if (error || !data) {
        setError('Could not find the requested location.');
        console.error(error);
        setLoading(false);
        return;
      }
      
      setLocation(data as unknown as LocationWithDetails);
      setLoading(false);
    };
    fetchData();
  }, [locationId]);

  const images = location?.images && location.images.length > 0 
    ? location.images.map(i => i.image_url) 
    : location?.image_url ? [location.image_url] : [];

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  if (loading) return <div className="p-4 text-center">Loading location details...</div>;
  if (error || !location) return <div className="p-4 text-center text-red-500">{error || 'Location not found.'}</div>;
  
  const d = location.details || {};

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'visit', label: 'Visit Info', icon: Clock },
    { id: 'safety', label: 'Safety & Culture', icon: Shield },
    { id: 'tips', label: 'Tips & Reviews', icon: Sparkles },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'visit':
        return (
          <div className="space-y-4">
            <DetailCard icon={Clock} title="Timings & Best Time to Visit">
              <InfoItem label="Best Season" value={d.best_time_to_visit?.best_season} icon={Calendar} />
              <InfoItem label="Best Time of Day" value={d.best_time_to_visit?.best_time_of_day} icon={Sun} className="mt-3" />
              <InfoItem label="Weekly Closures" value={d.opening_hours?.weekly_closures?.join(', ') || 'Open all week'} icon={XCircle} className="mt-3" />
            </DetailCard>
            <DetailCard icon={Car} title="Getting Here">
              <InfoItem label="Nearest Airport" value={d.transport?.nearest_airport} />
              <InfoItem label="Nearest Railway" value={d.transport?.nearest_railway_station} className="mt-3" />
              <InfoItem label="Taxi Estimate" value={d.transport?.taxi_cost_estimate} className="mt-3" />
            </DetailCard>
            <DetailCard icon={DollarSign} title="Costs & Money">
                <InfoItem label="Ticket (Local)" value={d.costs_money?.ticket_prices?.local} />
                <InfoItem label="Ticket (Foreigner)" value={d.costs_money?.ticket_prices?.foreigner} className="mt-3" />
                <InfoItem label="Avg Budget/Day" value={d.costs_money?.avg_budget_per_day} className="mt-3" />
            </DetailCard>
          </div>
        );
      case 'safety':
        return (
          <div className="space-y-4">
            <DetailCard icon={Shield} title="Safety & Risks">
              <div className="flex items-center justify-around text-center mb-4">
                  <div><p className="text-2xl font-bold text-green-600">{d.safety_risks?.safety_score || 'N/A'}/10</p><p className="text-xs">Safety Score</p></div>
                  <div><p className="text-lg font-semibold">{d.safety_risks?.womens_safety_rating || 'N/A'}</p><p className="text-xs">Women's Safety</p></div>
              </div>
              <h4 className="font-semibold text-sm mb-1">Scams & Warnings:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {d.safety_risks?.scams_warnings?.map((item, i) => <li key={i}>{item}</li>) || <li>No specific warnings.</li>}
              </ul>
            </DetailCard>
            <DetailCard icon={Globe} title="Cultural Etiquette">
              <InfoItem label="Dress Code" value={d.cultural_etiquette?.dress_code} />
              <InfoItem label="Photography Rules" value={d.cultural_etiquette?.photography_rules} className="mt-3" />
            </DetailCard>
          </div>
        );
      case 'tips':
        return (
          <div className="space-y-4">
            <DetailCard icon={Gem} title="Traveler Tips">
              <InfoItem label="Insider Hack" value={d.traveler_tips?.hacks} />
              <InfoItem label="Hidden Gem" value={d.traveler_tips?.hidden_gems} className="mt-3" />
              <InfoItem label="Photography Spots" value={d.traveler_tips?.photography_spots} className="mt-3" />
            </DetailCard>
            <DetailCard icon={Star} title="Google Reviews">
              <div className="text-center">
                  <p className="text-3xl font-bold text-amber-500">{d.google_reviews?.live_rating || 'N/A'} <Star className="inline-block w-7 h-7 fill-current" /></p>
                  <div className="text-sm italic text-gray-500 mt-2 space-y-1">
                      {d.google_reviews?.top_traveler_quotes?.map((q, i) => <p key={i}>"{q}"</p>) || <p>No quotes yet.</p>}
                  </div>
              </div>
            </DetailCard>
          </div>
        );
      case 'overview':
      default:
        return (
          <div className="space-y-4">
            <DetailCard icon={Info} title="About This Location">
              <p className="text-sm text-gray-600">{d.about?.historical_background || 'N/A'}</p>
            </DetailCard>
            <DetailCard icon={Utensils} title="Food & Stay">
              <InfoItem label="Dishes to Try" value={d.food_stay?.dishes_to_try} />
              <h4 className="font-semibold text-sm mt-3 mb-1">Recommended Restaurants:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {d.food_stay?.recommended_restaurants?.map((item, i) => <li key={i}>{item}</li>) || <li>No recommendations.</li>}
              </ul>
            </DetailCard>
            <DetailCard icon={CheckCircle} title="Amenities">
              <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2"/> Toilets: {d.amenities?.toilets || 'N/A'}</p>
                  <p className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2"/> Seating: {d.amenities?.seating || 'N/A'}</p>
              </div>
            </DetailCard>
          </div>
        );
    }
  };

  const DetailCard: React.FC<{icon: React.ElementType, title: string, children: React.ReactNode}> = ({icon: Icon, title, children}) => (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <h3 className="font-bold text-lg mb-3 flex items-center space-x-2"><Icon className="w-5 h-5 text-orange-500" /><span>{title}</span></h3>
      {children}
    </div>
  );
  
  const InfoItem: React.FC<{label: string, value: string | React.ReactNode, icon?: React.ElementType, className?: string}> = ({label, value, icon: Icon, className}) => (
    <div className={className}>
      <p className="text-xs text-gray-500 font-medium flex items-center">{Icon && <Icon className="w-3 h-3 mr-1.5"/>}{label}</p>
      <p className="text-sm text-gray-800 font-semibold">{value || 'N/A'}</p>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="relative h-72 group">
        <AnimatePresence initial={false}>
          <motion.img key={currentImageIndex} src={images[currentImageIndex]} alt={location.name} className="absolute w-full h-full object-cover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        {images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeft /></button>
            <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight /></button>
          </>
        )}
        <motion.button onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-full z-10" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </motion.button>
        <div className="absolute bottom-4 left-4 text-white z-10">
          <p className="text-md bg-black/40 px-2 py-1 rounded-md inline-block">{location.category}</p>
          <h1 className="text-4xl font-bold mt-1">{location.name}</h1>
          <p className="text-lg text-gray-200">{location.tehsil.name}, {location.tehsil.city?.name}</p>
        </div>
      </div>

      <div className="p-4">
        <p className="md:col-span-2 text-gray-700 bg-white p-4 rounded-xl shadow-sm border">{location.short_intro}</p>
      </div>

      <div className="sticky top-0 bg-gray-50/80 backdrop-blur-sm z-10 border-b">
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide px-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-shrink-0 flex items-center space-x-2 py-3 px-3 text-sm font-medium transition-colors ${
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

      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LocationDetailPage;
