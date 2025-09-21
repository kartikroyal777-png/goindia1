import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Shield, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockNotifications = [
  { id: 1, type: 'safety', title: 'Weather Alert: Heavy Rain in Mumbai', time: '1h ago', read: false },
  { id: 2, type: 'promo', title: '50% off on stays at Taj Hotels!', time: '4h ago', read: false },
  { id: 3, type: 'update', title: 'Your trip to Jaipur has been updated.', time: '1d ago', read: true },
  { id: 4, type: 'safety', title: 'Travel Advisory: High traffic in Delhi', time: '2d ago', read: true },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'safety': return <Shield className="w-5 h-5 text-red-500" />;
    case 'promo': return <Tag className="w-5 h-5 text-green-500" />;
    default: return <Bell className="w-5 h-5 text-blue-500" />;
  }
};

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center space-x-4">
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
      <div className="p-4 space-y-3">
        {mockNotifications.map((notif, index) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl flex items-start space-x-4 transition-colors ${
              !notif.read ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200'
            } border`}
          >
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              !notif.read ? 'bg-orange-100' : 'bg-gray-100'
            }`}>
              {getIcon(notif.type)}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">{notif.title}</p>
              <p className="text-sm text-gray-500">{notif.time}</p>
            </div>
            {!notif.read && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full mt-1 flex-shrink-0"></div>}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
