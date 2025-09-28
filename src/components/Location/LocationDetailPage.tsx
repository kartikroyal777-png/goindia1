import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Info, Car, Shield, Globe, DollarSign, Wifi, Utensils, ChevronLeft, ChevronRight, MapPin, 
  Wallet, Speaker, Star, Building, Clock, Sun, Trees, Camera, Users,
  Heart, CheckCircle, XCircle, Calendar, Cloud, Wind, Accessibility, Hospital,
  Eye, ImageIcon, Video, Check, Thermometer, UserCheck, Siren, Syringe, Banknote, HandCoins, Building2, Gem, BrainCircuit, Microscope, Train,
  Activity as ActivityIcon, UserCog, Sprout, Youtube
} from 'lucide-react';
import { Location, Tehsil, City, LocationImage } from '../../types';
import { supabase } from '../../lib/supabase';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

type LocationWithDetails = Location & {
  tehsil: Tehsil & { city: City; };
  images: LocationImage[];
};

const OPEN_WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
const AQI_API_KEY = import.meta.env.VITE_AQI_API_KEY;

const LocationDetailPage: React.FC = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [location, setLocation] = useState<LocationWithDetails | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchLocationData = useCallback(async () => {
    if (!locationId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: dbError } = await supabase.from('locations').select('*, tehsil:tehsils(*, city:cities(*)), images:location_images(*)').eq('id', locationId).single();
      if (dbError || !data) throw dbError || new Error('Location not found');
      setLocation(data as unknown as LocationWithDetails);

      if (data.latitude && data.longitude) {
        try {
          const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${data.latitude}&lon=${data.longitude}&appid=${OPEN_WEATHER_API_KEY}&units=metric`);
          const aqiResponse = await axios.get(`https://api.waqi.info/feed/geo:${data.latitude};${data.longitude}/?token=${AQI_API_KEY}`);
          setWeather({ ...weatherResponse.data, aqi: aqiResponse.data.data.aqi });
        } catch (weatherError) { console.error("Could not fetch weather data:", weatherError); setWeather(null); }
      } else { setWeather(null); }

    } catch (err: any) { setError(err.message || 'Could not find the requested location.'); console.error(err); } 
    finally { setLoading(false); }
  }, [locationId]);

  const checkIsSaved = useCallback(async () => {
    if (!user || !locationId) return;
    const { data, error } = await supabase.from('saved_places').select('location_id').eq('user_id', user.id).eq('location_id', locationId).single();
    if (!error && data) {
      setIsSaved(true);
    } else {
      setIsSaved(false);
    }
  }, [user, locationId]);
  
  useEffect(() => {
    fetchLocationData();
  }, [fetchLocationData]);

  useEffect(() => {
    checkIsSaved();
  }, [checkIsSaved]);

  const handleToggleSave = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (isSaving) return;
    setIsSaving(true);

    if (isSaved) {
      const { error } = await supabase.from('saved_places').delete().match({ user_id: user.id, location_id: locationId });
      if (!error) setIsSaved(false);
    } else {
      const { error } = await supabase.from('saved_places').insert({ user_id: user.id, location_id: locationId });
      if (!error) setIsSaved(true);
    }
    setIsSaving(false);
  };

  const images = location?.images && location.images.length > 0 ? location.images.map(i => i.image_url) : location?.image_url ? [location.image_url] : [];
  const nextImage = () => setCurrentImageIndex(p => (p + 1) % images.length);
  const prevImage = () => setCurrentImageIndex(p => (p - 1 + images.length) % images.length);

  if (loading) return <div className="p-4 text-center">Loading location details...</div>;
  if (error || !location) return <div className="p-4 text-center text-red-500">{error || 'Location not found.'}</div>;
  
  const d = location.details || {};

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'practical', label: 'Practical Info', icon: Info },
    { id: 'culture', label: 'Culture & Tips', icon: Globe },
    { id: 'explore', label: 'Explore More', icon: MapPin },
  ];
  
  const getAqiInfo = (aqi: number) => {
    if (aqi <= 50) return { text: "Good", color: "text-green-500" };
    if (aqi <= 100) return { text: "Moderate", color: "text-yellow-500" };
    if (aqi <= 150) return { text: "Unhealthy (SG)", color: "text-orange-500" };
    if (aqi <= 200) return { text: "Unhealthy", color: "text-red-500" };
    if (aqi <= 300) return { text: "Very Unhealthy", color: "text-purple-500" };
    return { text: "Hazardous", color: "text-maroon-500" };
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'practical': return (
        <div className="space-y-4">
          <DetailCard icon={Car} title="Getting Here">
            <InfoItem icon={Train} label="Nearest Airport" value={d.transport?.nearest_airport} />
            <InfoItem icon={Train} label="Nearest Railway" value={d.transport?.nearest_railway_station} />
            <InfoItem icon={Car} label="Last-Mile Options" value={d.transport?.last_mile_options} />
            <InfoItem icon={Banknote} label="Taxi Estimate" value={d.transport?.taxi_cost_estimate} />
          </DetailCard>
          <DetailCard icon={DollarSign} title="Costs & Money">
              <InfoItem icon={Wallet} label="Foreigner Ticket" value={d.costs_money?.ticket_prices?.foreigner} />
              <InfoItem icon={Wallet} label="Local Ticket" value={d.costs_money?.ticket_prices?.local} />
              <InfoItem icon={HandCoins} label="Avg. Budget/Day" value={d.costs_money?.avg_budget_per_day} />
              <InfoItem icon={CheckCircle} label="Digital Payments" value={d.costs_money?.digital_payment_availability} />
          </DetailCard>
          <DetailCard icon={Accessibility} title="Accessibility & Services">
            <InfoItem icon={Accessibility} label="Wheelchair Access" value={d.accessibility?.wheelchair_access} />
            <InfoItem icon={Speaker} label="English Guides" value={d.accessibility?.english_speaking_guides} />
            <InfoItem icon={UserCheck} label="Foreigner Services" value={d.accessibility?.foreigner_friendly_services} />
          </DetailCard>
          <DetailCard icon={Hospital} title="Nearby Essentials">
            <InfoItem icon={Banknote} label="ATMs" value={d.nearby_essentials?.atms} />
            <InfoItem icon={Syringe} label="Pharmacies" value={d.nearby_essentials?.pharmacies} />
            <InfoItem icon={Hospital} label="Hospitals" value={d.nearby_essentials?.hospitals} />
            <InfoItem icon={Siren} label="Police Stations" value={d.nearby_essentials?.police_stations} />
          </DetailCard>
        </div>
      );
      case 'culture': return (
        <div className="space-y-4">
          <DetailCard icon={Shield} title="Safety & Scams">
            <InfoItem icon={Shield} label="Overall Safety Score" value={`${d.safety_risks?.safety_score || 'N/A'}/10`} />
            <InfoItem icon={Heart} label="Women's Safety" value={d.safety_risks?.womens_safety_rating} />
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-600 mb-1">Common Scams to Avoid:</p>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">{d.safety_risks?.scams_warnings?.map((scam, i) => <li key={i}>{scam}</li>)}</ul>
            </div>
          </DetailCard>
          <DetailCard icon={Globe} title="Cultural Etiquette">
            <InfoItem icon={Users} label="Dress Code" value={d.cultural_etiquette?.dress_code} />
            <InfoItem icon={Camera} label="Photography Rules" value={d.cultural_etiquette?.photography_rules} />
            <InfoItem icon={Building2} label="Temple Etiquette" value={d.cultural_etiquette?.temple_etiquette} />
             <div className="mt-3">
              <p className="text-sm font-medium text-gray-600 mb-1">Do's & Don'ts:</p>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">{d.cultural_etiquette?.dos_donts?.map((tip, i) => <li key={i}>{tip}</li>)}</ul>
            </div>
          </DetailCard>
           <DetailCard icon={Gem} title="Traveler Tips">
            <InfoItem icon={BrainCircuit} label="Hacks" value={d.traveler_tips?.hacks} />
            <InfoItem icon={Microscope} label="Hidden Gems" value={d.traveler_tips?.hidden_gems} />
          </DetailCard>
          <DetailCard icon={UserCog} title="Guides">
            <InfoItem icon={UserCheck} label="Availability" value={d.guides?.availability} />
            <InfoItem icon={Calendar} label="Booking Info" value={d.guides?.booking_info} />
          </DetailCard>
           <DetailCard icon={Sprout} title="Hygiene">
            <InfoItem icon={Sprout} label="Rating" value={`${d.hygiene_index?.rating || 'N/A'}/5`} />
            <InfoItem icon={Info} label="Notes" value={d.hygiene_index?.notes} />
          </DetailCard>
        </div>
      );
      case 'explore': return (
        <div className="space-y-6">
          <SectionWithCarousel title="Best Photo Spots" icon={Camera} items={d.photo_spots || []} renderItem={(item) => <PhotoSpotCard item={item} />} />
          <SectionWithCarousel title="Famous Restaurants" icon={Utensils} items={d.recommended_restaurants || []} renderItem={(item) => <RecommendationCard item={item} />} />
          <SectionWithCarousel title="Recommended Hotels" icon={Building} items={d.recommended_hotels || []} renderItem={(item) => <RecommendationCard item={item} />} />
          <SectionWithCarousel title="Must-Try Local Food" icon={Sprout} items={d.local_foods || []} renderItem={(item) => <LocalFoodCard item={item} />} />
          <SectionWithCarousel title="Influencer Videos" icon={Youtube} items={d.influencer_videos || []} renderItem={(item) => <VideoCard item={item} />} />
        </div>
      );
      case 'overview': default: return (
        <div className="space-y-4">
          <DetailCard icon={Info} title="About This Location"><p className="text-sm text-gray-700 leading-relaxed">{d.about?.historical_background || 'No description available.'}</p></DetailCard>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Star} label="Rating" value={d.google_reviews?.live_rating || 'N/A'} />
              <StatCard icon={DollarSign} label="Fee" value={d.costs_money?.ticket_prices?.foreigner || 'N/A'} />
              <StatCard icon={Shield} label="Safety" value={`${d.safety_risks?.safety_score || 'N/A'}/10`} />
              <StatCard icon={Users} label="Crowd" value={d.crowd_experience?.avg_crowd_density || 'N/A'} />
          </div>
          {weather ? (
            <DetailCard icon={Cloud} title="Live Weather & AQI">
                <div className="flex justify-around items-center text-center">
                  <div><p className="text-2xl font-semibold">{Math.round(weather.main.temp)}°C</p><p className="text-xs capitalize">{weather.weather[0].description}</p></div>
                  <div><Wind className="w-6 h-6 mx-auto text-gray-500" /><p className="text-sm">{weather.wind.speed} m/s</p></div>
                  <div><p className={`text-2xl font-semibold ${getAqiInfo(weather.aqi).color}`}>{weather.aqi}</p><p className="text-xs">AQI ({getAqiInfo(weather.aqi).text})</p></div>
                </div>
            </DetailCard>
          ) : null}
          <DetailCard icon={Clock} title="Timings & Best Time">
            <InfoItem icon={Sun} label="Best Season" value={d.best_time_to_visit?.best_season} />
            <InfoItem icon={Clock} label="Best Time of Day" value={d.best_time_to_visit?.best_time_of_day} />
            <InfoItem icon={XCircle} label="Weekly Closures" value={d.opening_hours?.weekly_closures?.join(', ') || 'Open all week'} />
          </DetailCard>
          <DetailCard icon={ActivityIcon} title="Things To Do"><ul className="list-disc list-inside text-sm text-gray-700 space-y-1">{d.things_to_do?.main_activities?.map((act, i) => <li key={i}>{act}</li>)}</ul></DetailCard>
          <DetailCard icon={Calendar} title="Events & Festivals"><InfoItem icon={Calendar} label="Event Name" value={d.events_festivals?.event_name} /><InfoItem icon={Clock} label="Date" value={d.events_festivals?.event_date} /></DetailCard>
        </div>
      );
    }
  };

  const DetailCard: React.FC<{icon: React.ElementType, title: string, children: React.ReactNode}> = ({icon: Icon, title, children}) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border p-4">{title && <h3 className="font-medium text-gray-800 mb-3 flex items-center space-x-2"><Icon className="w-5 h-5 text-orange-500" /><span>{title}</span></h3>}{children}</motion.div>
  );
  const StatCard: React.FC<{icon: React.ElementType, label: string, value: string | React.ReactNode}> = ({icon: Icon, label, value}) => (<div className="bg-white rounded-xl shadow-sm border p-3 text-center"><Icon className="w-6 h-6 text-orange-500 mx-auto mb-1"/><p className="text-xs text-gray-500">{label}</p><p className="font-medium text-gray-800">{value}</p></div>);
  const InfoItem: React.FC<{icon?: React.ElementType, label: string, value: string | React.ReactNode}> = ({icon: Icon, label, value}) => (value ? <div className="mt-2 flex justify-between items-center text-sm border-b border-gray-100 pb-2"><p className="text-gray-500 flex items-center space-x-2">{Icon && <Icon className="w-4 h-4 text-gray-400" />}<span>{label}</span></p><p className="text-gray-800 font-medium text-right">{value}</p></div> : null);
  const SectionWithCarousel: React.FC<{title: string, icon: React.ElementType, items: any[], renderItem: (item: any) => React.ReactNode}> = ({title, icon: Icon, items, renderItem}) => (items && items.length > 0 ? <DetailCard icon={Icon} title={title}><div className="flex space-x-4 overflow-x-auto scrollbar-hide -m-2 p-2">{items.map((item, i) => <div key={i} className="flex-shrink-0 w-64">{renderItem(item)}</div>)}</div></DetailCard> : null);
  const PhotoSpotCard: React.FC<{item: any}> = ({item}) => (<a href={item.map_link || '#'} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden shadow-md bg-white h-full hover:shadow-xl transition-shadow"><img src={item.image_url} className="w-full h-32 object-cover" /><div className="p-3"><p className="font-medium text-sm">{item.title}</p><p className="text-xs text-gray-600">{item.description}</p></div></a>);
  const RecommendationCard: React.FC<{item: any}> = ({item}) => (<a href={item.map_link || '#'} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden shadow-md bg-white h-full hover:shadow-xl transition-shadow"><img src={item.image_url} className="w-full h-32 object-cover" /><div className="p-3"><p className="font-medium text-sm">{item.name}</p></div></a>);
  const LocalFoodCard: React.FC<{item: any}> = ({item}) => (<a href={item.map_link || '#'} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden shadow-md bg-white h-full hover:shadow-xl transition-shadow"><img src={item.image_url} className="w-full h-32 object-cover" /><div className="p-3"><p className="font-medium text-sm">{item.name}</p><p className="text-xs text-gray-600">{item.shop}</p></div></a>);
  const VideoCard: React.FC<{item: any}> = ({item}) => (<a href={`https://www.youtube.com/watch?v=${item.video_id}`} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden shadow-md bg-white h-full hover:shadow-xl transition-shadow"><div className="relative"><img src={`https://i.ytimg.com/vi/${item.video_id}/hqdefault.jpg`} className="w-full h-32 object-cover" /><div className="absolute inset-0 flex items-center justify-center bg-black/30"><Youtube className="w-10 h-10 text-white" /></div></div><div className="p-3"><p className="font-medium text-sm">{item.title}</p><p className="text-xs text-gray-600">by {item.influencer_name}</p></div></a>);

  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      <div className="relative h-72 group">
        <AnimatePresence initial={false}><motion.img key={currentImageIndex} src={images[currentImageIndex]} alt={location.name} className="absolute w-full h-full object-cover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} /></AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        {images.length > 1 && (<><button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeft /></button><button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight /></button></>)}
        <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
            <motion.button onClick={() => navigate(-1)} className="bg-white/80 backdrop-blur-sm p-2 rounded-full" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} ><ArrowLeft className="w-5 h-5 text-gray-800" /></motion.button>
            <motion.button onClick={handleToggleSave} className="bg-white/80 backdrop-blur-sm p-2 rounded-full" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} >
                <Heart className={`w-5 h-5 transition-all ${isSaved ? 'text-red-500 fill-current' : 'text-gray-800'}`} />
            </motion.button>
        </div>
        <div className="absolute bottom-4 left-4 text-white z-10"><p className="text-md bg-black/40 px-2 py-1 rounded-md inline-block">{location.category}</p><h1 className="text-4xl font-medium mt-1">{location.name}</h1><p className="text-lg text-gray-200">{location.tehsil.name}, {location.tehsil.city?.name}</p></div>
      </div>

      <div className="sticky top-0 bg-gray-100/80 backdrop-blur-sm z-10 border-b"><div className="flex justify-center space-x-1 overflow-x-auto scrollbar-hide px-2">{tabs.map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative flex-shrink-0 flex items-center space-x-2 py-3 px-4 text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-orange-500' : 'text-gray-500 hover:text-orange-500'}`}><tab.icon className="w-4 h-4" /><span>{tab.label}</span>{activeTab === tab.id && (<motion.div layoutId="locationTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />)}</button>))}</div></div>

      <div className="p-4"><AnimatePresence mode="wait"><motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>{renderTabContent()}</motion.div></AnimatePresence></div>
    </div>
  );
};

export default LocationDetailPage;
