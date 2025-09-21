import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Minus, Plus, Landmark, Mountain, User, ArrowRight, Heart, Users, MapPin, Share2, Sun, Cloud, Wind, ArrowLeft } from 'lucide-react';
import { runTripPlannerQuery } from '../../lib/ai';
import { DayPlan, City } from '../../types';
import { supabase } from '../../lib/supabase';

type TravelStyle = 'cultural' | 'romantic' | 'family' | 'adventure';
type Companion = 'solo' | 'couple' | 'family' | 'friends';

interface TripPreferences {
  days: number;
  destination: string;
  style: TravelStyle;
  companions: Companion;
}

const TripPlannerPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<TripPreferences>({
    days: 7,
    destination: '',
    style: 'cultural',
    companions: 'solo',
  });
  const [trendingCities, setTrendingCities] = useState<City[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<DayPlan[] | null>(null);
  const [activeDay, setActiveDay] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingCities = async () => {
      const { data } = await supabase
        .from('cities')
        .select('*')
        .order('popularity_score', { ascending: false })
        .limit(5);
      if (data) setTrendingCities(data);
    };
    fetchTrendingCities();
  }, []);

  const styleOptions: { id: TravelStyle; label: string; icon: React.ElementType }[] = [
    { id: 'cultural', label: 'Cultural & Historical', icon: Landmark },
    { id: 'romantic', label: 'Romantic', icon: Heart },
    { id: 'family', label: 'Family Friendly', icon: Users },
    { id: 'adventure', label: 'Adventure', icon: Mountain },
  ];

  const companionOptions: { id: Companion; label: string; icon: React.ElementType }[] = [
    { id: 'solo', label: 'Solo', icon: User },
    { id: 'couple', label: 'Couple', icon: Heart },
    { id: 'family', label: 'Family', icon: Users },
    { id: 'friends', label: 'Friends', icon: Users },
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else generateItinerary();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const generateItinerary = async () => {
    setIsGenerating(true);
    setError(null);
    const prompt = `
      You are an expert travel planner for "Go India". Plan a ${preferences.days}-day trip to ${preferences.destination}, India, for a ${preferences.companions} with a ${preferences.style} travel style.
      Your response MUST be a valid JSON array of objects. Each object represents a day and must follow this exact structure:
      {
        "day": number,
        "title": "A short, catchy title for the day's plan",
        "activities": [
          { "time": "Morning" | "Afternoon" | "Evening", "title": "Name of activity", "description": "Brief description.", "type": "spot" | "hotel" | "food", "google_maps_link": "https://www.google.com/maps/search/?api=1&query=PLACE,CITY" }
        ]
      }`;

    try {
      const response = await runTripPlannerQuery(prompt);
      const parsedItinerary: DayPlan[] = JSON.parse(response);
      setItinerary(parsedItinerary);
      setStep(5);
    } catch (e) {
      console.error("Failed to generate or parse itinerary:", e);
      setError("Sorry, the AI couldn't generate a trip plan. Please try a different destination.");
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">How many days is your trip?</h2>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl shadow-lg p-8 my-8">
              <div className="flex items-center justify-center space-x-6">
                <motion.button whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }} onClick={() => setPreferences(p => ({ ...p, days: Math.max(1, p.days - 1) }))} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full"><Minus /></motion.button>
                <motion.span key={preferences.days} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-6xl font-bold text-orange-500 w-24 text-center">{preferences.days}</motion.span>
                <motion.button whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }} onClick={() => setPreferences(p => ({ ...p, days: p.days + 1 }))} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full"><Plus /></motion.button>
              </div>
            </motion.div>
          </div>
        );
      case 2:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Where would you like to travel?</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="e.g., Jaipur, Goa, Kerala" value={preferences.destination} onChange={(e) => setPreferences(p => ({ ...p, destination: e.target.value }))} className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500 shadow-sm" />
            </div>
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-600 mb-3 text-left">Trending Destinations</h3>
              <div className="flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4">
                {trendingCities.map((city, index) => (
                  <motion.div key={city.id} onClick={() => setPreferences(p => ({...p, destination: city.name}))} className="flex-shrink-0 w-32 text-center cursor-pointer group" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                    <div className={`relative w-32 h-32 rounded-xl overflow-hidden shadow-md border-4 transition-colors ${preferences.destination === city.name ? 'border-orange-500' : 'border-transparent'}`}>
                      <img src={city.thumbnail_url} alt={city.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-700 group-hover:text-orange-500">{city.name}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">What’s your travel style?</h2>
            <div className="grid grid-cols-2 gap-4">
              {styleOptions.map(({ id, label, icon: Icon }) => (
                <motion.div key={id} onClick={() => setPreferences(p => ({ ...p, style: id }))} className={`p-6 rounded-2xl border-2 cursor-pointer shadow-sm ${preferences.style === id ? 'border-orange-500 bg-orange-50' : 'bg-white border-gray-200'}`} whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
                  <Icon className={`w-8 h-8 mb-2 ${preferences.style === id ? 'text-orange-500' : 'text-gray-500'}`} />
                  <h3 className="font-semibold text-gray-800">{label}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Who are you traveling with?</h2>
            <div className="grid grid-cols-2 gap-4">
              {companionOptions.map(({ id, label, icon: Icon }) => (
                <motion.div key={id} onClick={() => setPreferences(p => ({ ...p, companions: id }))} className={`p-6 rounded-2xl border-2 cursor-pointer shadow-sm ${preferences.companions === id ? 'border-orange-500 bg-orange-50' : 'bg-white border-gray-200'}`} whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
                  <Icon className={`w-8 h-8 mb-2 ${preferences.companions === id ? 'text-orange-500' : 'text-gray-500'}`} />
                  <h3 className="font-semibold text-gray-800">{label}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        );
      default: return null;
    }
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-screen pb-20 bg-gray-50">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="w-20 h-20 border-4 border-orange-200 border-t-orange-500 rounded-full mb-8" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2 animate-pulse">Crafting Your Adventure...</h2>
        <p className="text-gray-600 text-center max-w-sm">Our AI is analyzing the best spots in {preferences.destination} for your {preferences.style} trip.</p>
      </div>
    );
  }

  if (step === 5 && itinerary) {
    const currentDayData = itinerary.find(d => d.day === activeDay);
    const WeatherIcon = [Sun, Cloud, Wind][activeDay % 3];
    return (
      <div className="bg-gray-50 min-h-screen pb-20">
        <div className="p-4 bg-white shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{preferences.days}-Day Trip to {preferences.destination}</h1>
              <p className="text-gray-600 capitalize">{preferences.style} trip for {preferences.companions}</p>
            </div>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-full hover:bg-gray-100"><Share2 className="w-5 h-5 text-gray-600" /></motion.button>
          </div>
        </div>
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            {itinerary.map(day => (
              <motion.button key={day.day} onClick={() => setActiveDay(day.day)} className={`relative px-4 py-2 rounded-full font-medium text-sm flex-shrink-0 transition-all ${activeDay === day.day ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
                Day {day.day}
                {activeDay === day.day && <motion.div layoutId="activeDayTab" className="absolute -bottom-2 w-full h-1 bg-orange-500 rounded-full" />}
              </motion.button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={activeDay} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="px-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">{currentDayData?.title}</h3>
              <div className="flex items-center space-x-2 text-gray-600"><WeatherIcon className="w-5 h-5" /><span className="font-medium text-sm">28°C</span></div>
            </div>
            <div className="space-y-4">
              {currentDayData?.activities.map((activity, index) => (
                <motion.div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                  <p className="text-xs font-semibold text-orange-500 mb-1 uppercase tracking-wider">{activity.time}</p>
                  <h4 className="font-bold text-gray-800 mb-2">{activity.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                  {activity.google_maps_link && <motion.a href={activity.google_maps_link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 flex items-center space-x-1 group" whileHover={{ scale: 1.05 }}><MapPin className="w-4 h-4" /><span className="group-hover:underline">View on Map</span></motion.a>}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-between">
      <div className="p-4 pt-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">AI Trip Planner</h1>
        <p className="text-center text-gray-600 mb-8">Let's plan your perfect Indian adventure.</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <motion.div className="bg-orange-500 h-2 rounded-full" initial={{ width: '0%' }} animate={{ width: `${((step - 1) / 3) * 100}%` }} transition={{ type: 'spring', stiffness: 50 }} />
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }} className="w-full max-w-md">
            {error ? (
              <div className="text-center p-4 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-700">{error}</p>
                <button onClick={() => { setError(null); setStep(4); }} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg">Try Again</button>
              </div>
            ) : renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {!error && (
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center justify-between space-x-4">
            <motion.button onClick={handleBack} className="py-3 px-6 text-gray-700 font-semibold rounded-xl flex items-center space-x-2" disabled={step === 1} style={{ opacity: step === 1 ? 0.5 : 1 }} whileHover={{ scale: step > 1 ? 1.05 : 1 }}>
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </motion.button>
            <motion.button onClick={handleNext} className="flex-1 py-3 bg-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-200 disabled:opacity-50 flex items-center justify-center space-x-2" disabled={(step === 2 && !preferences.destination.trim())} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <span>{step === 4 ? '✨ Generate Trip' : 'Continue'}</span>
              {step < 4 && <ArrowRight className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripPlannerPage;
