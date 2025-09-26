import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Edit, Trash2, Plus, Loader2, AlertTriangle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Trip } from '../types';
import { motion } from 'framer-motion';

const MyTripsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user) {
        setLoading(false);
        setError("You must be logged in to see your trips.");
        return;
      }
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError("Could not fetch your trips.");
        console.error(fetchError);
      } else {
        setTrips(data);
      }
      setLoading(false);
    };
    fetchTrips();
  }, [user]);

  const handleDelete = async (tripId: string) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      const { error: deleteError } = await supabase.from('trips').delete().eq('id', tripId);
      if (deleteError) {
        alert("Failed to delete trip: " + deleteError.message);
      } else {
        setTrips(trips.filter(t => t.id !== tripId));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </motion.button>
          <h1 className="text-xl font-bold text-gray-900">My Trips</h1>
        </div>
        <Link to="/planner">
          <motion.button className="p-2 rounded-full bg-orange-500 text-white" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Plus className="w-5 h-5" />
          </motion.button>
        </Link>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex justify-center pt-20"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
        ) : error ? (
          <div className="text-center pt-20 text-red-500 flex flex-col items-center">
            <AlertTriangle className="w-10 h-10 mb-2" />
            {error}
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center pt-20">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-800">No Trips Saved Yet</h2>
            <p className="text-gray-500 mb-4">Create your first AI-powered trip plan!</p>
            <Link to="/planner" className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg">
              Plan a New Trip
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {trips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{trip.title}</h3>
                    <p className="text-sm text-gray-500">
                      {trip.preferences.days} days • Created on {new Date(trip.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <button onClick={() => navigate(`/planner/${trip.id}`)} className="p-2 text-gray-500 hover:text-blue-600 rounded-full"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(trip.id)} className="p-2 text-gray-500 hover:text-red-600 rounded-full"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTripsPage;
