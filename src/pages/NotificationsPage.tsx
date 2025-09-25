import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Shield, Tag, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Notification {
  id: number;
  type: 'safety' | 'promo' | 'info';
  title: string;
  message: string;
  created_at: string;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'safety': return <Shield className="w-5 h-5 text-red-500" />;
    case 'promo': return <Tag className="w-5 h-5 text-green-500" />;
    default: return <Bell className="w-5 h-5 text-blue-500" />;
  }
};

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    const { data, error: rpcError } = await supabase.rpc('get_user_notifications');

    if (rpcError) {
      setError('Could not fetch notifications.');
      console.error(rpcError);
    } else {
      setNotifications(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

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
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
        </div>
        <button onClick={fetchNotifications} disabled={loading} className="p-2 rounded-full hover:bg-gray-100">
          <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="p-4 space-y-3">
        {loading ? (
          <p className="text-center text-gray-500">Loading notifications...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : notifications.length === 0 ? (
          <p className="text-center text-gray-500 pt-10">You have no new notifications.</p>
        ) : (
          notifications.map((notif, index) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl flex items-start space-x-4 bg-white border border-gray-200"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{notif.title}</p>
                <p className="text-sm text-gray-600">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(notif.created_at).toLocaleString()}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
