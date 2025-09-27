import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Minus, Plus, Landmark, Mountain, User, ArrowRight, Heart, Users, MapPin, Share2, Sun, Cloud, Wind, ArrowLeft, Trash2, Edit, Save, FileDown, Calendar, Users2, Compass, Check } from 'lucide-react';
import { runGeminiQuery } from '../../lib/gemini';
import { DayPlan, City, Activity, TripPreferences, SavedTrip } from '../../types';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

type TravelStyle = 'cultural' | 'romantic' | 'family' | 'adventure';
type Companion = 'solo' | 'couple' | 'family' | 'friends';

const TripPlannerPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const { user, canUseFeature, showUpgradeModal, incrementFeatureUsage } = useAuth();
  const navigate = useNavigate();
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
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const fetchTrendingCities = async () => {
      const { data } = await supabase.from('cities').select('*').order('popularity_score', { ascending: false }).limit(5);
      if (data) setTrendingCities(data);
    };
    fetchTrendingCities();
  }, []);

  const styleOptions = [
    { id: 'cultural' as TravelStyle, label: 'Cultural & Historical', icon: Landmark },
    { id: 'romantic' as TravelStyle, label: 'Romantic', icon: Heart },
    { id: 'family' as TravelStyle, label: 'Family Friendly', icon: Users },
    { id: 'adventure' as TravelStyle, label: 'Adventure', icon: Mountain },
  ];

  const companionOptions = [
    { id: 'solo' as Companion, label: 'Solo', icon: User },
    { id: 'couple' as Companion, label: 'Couple', icon: Heart },
    { id: 'family' as Companion, label: 'Family', icon: Users2 },
    { id: 'friends' as Companion, label: 'Friends', icon: Users },
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else generateItinerary();
  };

  const handleBack = () => {
    if (step > 1 && step < 5) setStep(step - 1);
    else if (step === 5) {
      setItinerary(null);
      setStep(4);
    }
  };

  const generateItinerary = async () => {
    if (!canUseFeature('trip_planner')) {
      showUpgradeModal(true);
      return;
    }

    setIsGenerating(true);
    setError(null);
    const prompt = `
      You are an expert travel planner for "Go India". Plan a ${preferences.days}-day trip to ${preferences.destination}, India, for a ${preferences.companions} with a ${preferences.style} travel style.
      Your response MUST be a valid JSON array of objects. Each object represents a day and must follow this exact structure:
      {
        "day": number,
        "title": "A short, catchy title for the day's plan",
        "activities": [
          { "id": "unique_string_id", "time": "Morning" | "Afternoon" | "Evening", "title": "Name of activity", "description": "Brief description.", "type": "spot" | "hotel" | "food", "google_maps_link": "https://www.google.com/maps/search/?api=1&query=PLACE,CITY" }
        ]
      }`;

    try {
      const response = await runGeminiQuery(prompt);
      const parsedItinerary: DayPlan[] = JSON.parse(response).map((day: DayPlan) => ({
        ...day,
        activities: day.activities.map(activity => ({...activity, id: Math.random().toString(36).substring(2, 9)}))
      }));
      setItinerary(parsedItinerary);
      setStep(5);
      await incrementFeatureUsage('trip_planner');
    } catch (e: any) {
      console.error("Failed to generate or parse itinerary:", e);
      setError(e.message || "Sorry, the AI couldn't generate a trip plan. Please try a different destination or check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!itinerary) return;
    setIsSaving(true);
    setSaveMessage('');

    const tripData: SavedTrip['trip_details'] = { preferences, itinerary };
    const { error } = await supabase.from('saved_trips').insert({ user_id: user.id, trip_details: tripData });
    
    if (error) {
      setSaveMessage('Error saving trip.');
    } else {
      setSaveMessage('Trip saved successfully!');
    }
    setIsSaving(false);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleDeleteActivity = (dayIndex: number, activityId: string) => {
    setItinerary(prev => {
      if (!prev) return null;
      const newItinerary = [...prev];
      newItinerary[dayIndex].activities = newItinerary[dayIndex].activities.filter(act => act.id !== activityId);
      return newItinerary;
    });
  };

  const handleUpdateActivity = (updatedActivity: Activity) => {
    setItinerary(prev => {
      if (!prev) return null;
      return prev.map(day => ({
        ...day,
        activities: day.activities.map(act => act.id === updatedActivity.id ? updatedActivity : act)
      }));
    });
    setEditingActivity(null);
  };
  
  const handleAddActivity = (dayIndex: number) => {
    const newActivity: Activity = {
      id: Math.random().toString(36).substring(2, 9),
      time: 'Morning',
      title: 'New Activity',
      description: 'Click edit to add details.',
      type: 'spot'
    };
    setItinerary(prev => {
      if (!prev) return null;
      const newItinerary = [...prev];
      newItinerary[dayIndex].activities.push(newActivity);
      return newItinerary;
    });
    setEditingActivity(newActivity);
  };

  const handleShare = async () => {
    if (navigator.share && itinerary) {
      const text = `Check out my ${preferences.days}-day trip to ${preferences.destination}!\n\n` +
        itinerary.map(day => 
          `Day ${day.day}: ${day.title}\n` +
          day.activities.map(act => `- ${act.time}: ${act.title}`).join('\n')
        ).join('\n\n');
      try {
        await navigator.share({
          title: `My Trip to ${preferences.destination}`,
          text: text,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Share feature is not supported on your browser.');
    }
  };

  const handleSaveToFile = () => {
    if (itinerary) {
      const text = `My ${preferences.days}-day trip to ${preferences.destination}\n\n` +
        itinerary.map(day => 
          `--- Day ${day.day}: ${day.title} ---\n` +
          day.activities.map(act => 
            `\n[${act.time}] ${act.title}\n${act.description}\n`
          ).join('')
        ).join('\n');
      
      const blob = new Blob([text], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `trip-to-${preferences.destination}.txt`;
      link.click();
      URL.revokeObjectURL(link.href);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1: // Days
        return (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">How many days are you planning?</h2>
            <div className="flex items-center justify-center space-x-4">
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPreferences(p => ({ ...p, days: Math.max(1, p.days - 1) }))} className="p-3 bg-white rounded-full shadow-md"><Minus /></motion.button>
              <span className="text-5xl font-semibold w-24 text-center">{preferences.days}</span>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPreferences(p => ({ ...p, days: p.days + 1 }))} className="p-3 bg-white rounded-full shadow-md"><Plus /></motion.button>
            </div>
          </>
        );
      case 2: // Destination
        return (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Where do you want to go?</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={preferences.destination} onChange={e => setPreferences(p => ({ ...p, destination: e.target.value }))} placeholder="e.g., Jaipur, Kerala, Goa" className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500" />
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Trending Destinations:</h3>
              <div className="flex flex-wrap gap-2">
                {trendingCities.map(city => <button key={city.id} onClick={() => setPreferences(p => ({ ...p, destination: city.name }))} className="px-3 py-1.5 bg-white border rounded-full text-sm hover:bg-orange-50">{city.name}</button>)}
              </div>
            </div>
          </>
        );
      case 3: // Style
        return (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">What's your travel style?</h2>
            <div className="grid grid-cols-2 gap-4">
              {styleOptions.map(({ id, label, icon: Icon }) => (
                <motion.button key={id} onClick={() => setPreferences(p => ({ ...p, style: id }))} className={`p-4 border-2 rounded-xl text-center transition-colors ${preferences.style === id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-orange-300'}`}>
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${preferences.style === id ? 'text-orange-500' : 'text-gray-500'}`} />
                  <span className="font-medium">{label}</span>
                </motion.button>
              ))}
            </div>
          </>
        );
      case 4: // Companions
        return (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Who are you traveling with?</h2>
            <div className="grid grid-cols-2 gap-4">
              {companionOptions.map(({ id, label, icon: Icon }) => (
                <motion.button key={id} onClick={() => setPreferences(p => ({ ...p, companions: id }))} className={`p-4 border-2 rounded-xl text-center transition-colors ${preferences.companions === id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-orange-300'}`}>
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${preferences.companions === id ? 'text-orange-500' : 'text-gray-500'}`} />
                  <span className="font-medium">{label}</span>
                </motion.button>
              ))}
            </div>
          </>
        );
      default: return null;
    }
  };

  if (isGenerating) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-gray-300 border-t-orange-500 rounded-full mb-6"
        />
        <h3 className="text-xl font-semibold">Crafting your adventure...</h3>
        <p className="text-gray-600">This might take a moment.</p>
      </div>
    );
  }

  if (step === 5 && itinerary) {
    const currentDayIndex = itinerary.findIndex(d => d.day === activeDay);
    const currentDayData = itinerary[currentDayIndex];
    const WeatherIcon = [Sun, Cloud, Wind][activeDay % 3];
    return (
      <div className="bg-gray-50 min-h-screen pb-20">
        <div className="p-4 bg-white shadow-sm flex justify-between items-center sticky top-0 z-20">
          <motion.button onClick={handleBack} className="p-2 rounded-full hover:bg-gray-100 flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h1 className="text-xl font-semibold text-gray-900 text-center">{preferences.destination} Trip</h1>
          <div className="flex items-center space-x-1">
            <motion.button onClick={handleSaveTrip} disabled={isSaving} className="p-2 rounded-full hover:bg-gray-100"><Save className={`w-5 h-5 ${isSaving ? 'text-gray-400' : 'text-gray-600'}`} /></motion.button>
            <motion.button onClick={handleSaveToFile} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-full hover:bg-gray-100"><FileDown className="w-5 h-5 text-gray-600" /></motion.button>
            <motion.button onClick={handleShare} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-full hover:bg-gray-100"><Share2 className="w-5 h-5 text-gray-600" /></motion.button>
          </div>
        </div>
        {saveMessage && <div className="text-center py-2 bg-green-100 text-green-800 text-sm">{saveMessage}</div>}
        <div className="sticky top-[72px] bg-white/80 backdrop-blur-sm z-10 p-4">
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            {itinerary.map(day => (
              <motion.button key={day.day} onClick={() => setActiveDay(day.day)} className={`relative px-4 py-2 rounded-full font-medium text-sm flex-shrink-0 transition-all ${activeDay === day.day ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
                Day {day.day}
              </motion.button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={activeDay} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="p-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">{currentDayData?.title}</h3>
              <div className="flex items-center space-x-2 text-gray-600"><WeatherIcon className="w-5 h-5" /><span className="font-medium text-sm">28°C</span></div>
            </div>
            <div className="space-y-4">
              {currentDayData?.activities.map((activity) => (
                <motion.div key={activity.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 group" layout>
                  {editingActivity?.id === activity.id ? (
                    <ActivityForm activity={editingActivity} onSave={handleUpdateActivity} onCancel={() => setEditingActivity(null)} />
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-semibold text-orange-500 mb-1 uppercase tracking-wider">{activity.time}</p>
                          <h4 className="font-semibold text-gray-800 mb-2">{activity.title}</h4>
                        </div>
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setEditingActivity(activity)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-full"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteActivity(currentDayIndex, activity.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-full"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                      {activity.google_maps_link && <motion.a href={activity.google_maps_link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 flex items-center space-x-1" whileHover={{ scale: 1.05 }}><MapPin className="w-4 h-4" /><span className="hover:underline">View on Map</span></motion.a>}
                    </>
                  )}
                </motion.div>
              ))}
              <motion.button onClick={() => handleAddActivity(currentDayIndex)} className="w-full border-2 border-dashed border-gray-300 text-gray-500 rounded-xl p-4 text-center hover:bg-gray-100 hover:border-orange-400 hover:text-orange-500 transition-colors">
                + Add Activity
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="p-4 pt-8">
        <div className="flex items-center justify-between">
          <div className="w-10">
            {step > 1 && <motion.button onClick={handleBack} className="p-2 rounded-full hover:bg-gray-200"><ArrowLeft/></motion.button>}
          </div>
          <div className="flex items-center space-x-2">
            {[1,2,3,4].map(s => <div key={s} className={`w-2 h-2 rounded-full ${step >= s ? 'bg-orange-500' : 'bg-gray-300'}`}></div>)}
          </div>
          <div className="w-10"></div>
        </div>
      </div>
      <div className="flex-grow flex items-center justify-center p-4 pb-32">
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
      {!error && step < 5 && (
        <div className="fixed bottom-[72px] left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200 z-20">
          <div className="max-w-md mx-auto">
            <motion.button onClick={handleNext} className="w-full py-3 bg-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-200 disabled:opacity-50 flex items-center justify-center space-x-2" disabled={(step === 2 && !preferences.destination.trim())} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <span>{step === 4 ? '✨ Generate Trip' : 'Continue'}</span>
              {step < 4 && <ArrowRight className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

const ActivityForm: React.FC<{activity: Activity, onSave: (activity: Activity) => void, onCancel: () => void}> = ({ activity, onSave, onCancel }) => {
  const [formData, setFormData] = useState(activity);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };
  return (
    <div className="space-y-3">
      <input name="title" value={formData.title} onChange={handleChange} className="w-full font-semibold text-gray-800 border-b-2 focus:outline-none focus:border-orange-500" />
      <select name="time" value={formData.time} onChange={handleChange} className="w-full text-xs font-semibold text-orange-500 uppercase tracking-wider border-b-2 focus:outline-none focus:border-orange-500">
        <option>Morning</option>
        <option>Afternoon</option>
        <option>Evening</option>
      </select>
      <textarea name="description" value={formData.description} onChange={handleChange} className="w-full text-sm text-gray-600 border-b-2 focus:outline-none focus:border-orange-500" rows={2} />
      <input name="google_maps_link" value={formData.google_maps_link || ''} onChange={handleChange} placeholder="Google Maps Link" className="w-full text-sm text-blue-600 border-b-2 focus:outline-none focus:border-orange-500" />
      <div className="flex justify-end space-x-2 pt-2">
        <button onClick={onCancel} className="px-3 py-1 text-sm text-gray-600 rounded-md">Cancel</button>
        <button onClick={() => onSave(formData)} className="px-3 py-1 text-sm bg-orange-500 text-white rounded-md">Save</button>
      </div>
    </div>
  );
}

export default TripPlannerPage;
