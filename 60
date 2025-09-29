import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Trash2, Edit, PlusCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { SavedTrip } from '../types';

const MyTripsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('saved_trips')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (data) setTrips(data);
      setLoading(false);
    };
    fetchTrips();
  }, [user]);
  
  const deleteTrip = async (tripId: string) => {
      if(window.confirm('Are you sure you want to delete this trip?')) {
          await supabase.from('saved_trips').delete().eq('id', tripId);
          setTrips(trips.filter(t => t.id !== tripId));
      }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center space-x-4">
        <motion.button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </motion.button>
        <h1 className="text-xl font-semibold text-gray-900">My Trips</h1>
      </div>
      <div className="p-4">
        {loading ? (
          <p>Loading trips...</p>
        ) : trips.length === 0 ? (
          <div className="text-center py-16">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">No Saved Trips Yet</h2>
            <p className="text-gray-500 mt-2">Use the Trip Planner to create your next adventure!</p>
            <Link to="/planner">
                <motion.button className="mt-6 px-6 py-2 bg-orange-500 text-white font-semibold rounded-full shadow-md flex items-center justify-center mx-auto space-x-2">
                    <PlusCircle className="w-5 h-5" />
                    <span>Plan a New Trip</span>
                </motion.button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
            {trips.map((trip, index) => (
              <motion.div 
                key={trip.id} 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm border p-4"
              >
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold text-lg">{trip.trip_details.preferences.destination}</h3>
                        <p className="text-sm text-gray-500">{trip.trip_details.preferences.days} days, {trip.trip_details.preferences.style} style</p>
                        <p className="text-xs text-gray-400 mt-1">Created on {new Date(trip.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex space-x-1">
                        <button className="p-2 text-gray-400 hover:text-blue-500"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => deleteTrip(trip.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                </div>
                <div className="mt-4 border-t pt-2">
                    <p className="text-sm font-medium mb-1">Itinerary Highlights:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 truncate">
                        {trip.trip_details.itinerary.slice(0, 2).map(day => (
                            <li key={day.day}>{day.title}</li>
                        ))}
                    </ul>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTripsPage;
