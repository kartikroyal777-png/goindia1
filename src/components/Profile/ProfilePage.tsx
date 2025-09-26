import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, Heart, MapPin, LogOut, Edit, Crown, Shield, FileText, Info } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import EditProfileModal from './EditProfileModal';

const ProfilePage: React.FC = () => {
  const { user, signOut, profile } = useAuth();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  const isAdmin = profile?.role === 'admin';

  const mainMenuItems = [
    { icon: Heart, label: 'Saved Places', path: '/saved-places' },
    { icon: MapPin, label: 'My Trips', path: '/my-trips' },
    { icon: Settings, label: 'App Settings', path: '/settings/app' },
  ];

  const legalMenuItems = [
    { icon: Info, label: 'About Us', summary: 'Who We Are', path: '/about' },
    { icon: FileText, label: 'Terms of Use', summary: 'Rules of Use', path: '/terms' },
    { icon: Shield, label: 'Privacy Policy', summary: 'How We Protect You', path: '/privacy' },
  ];

  return (
    <>
      <div className="pb-20 bg-gray-50">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 px-4 pt-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative text-center text-white"
          >
            <div className="relative w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-white" />
              <button onClick={() => setIsEditModalOpen(true)} className="absolute bottom-0 right-0 w-8 h-8 bg-white text-orange-500 rounded-full flex items-center justify-center shadow-md">
                <Edit className="w-4 h-4" />
              </button>
            </div>
            <h1 className="text-xl font-bold mb-1">{profile?.full_name || user?.email?.split('@')[0] || 'Traveler'}</h1>
            <p className="text-orange-100 text-sm">{user?.email}</p>
          </motion.div>
        </div>

        <div className="px-4 -mt-8">
          {isAdmin && (
            <Link to="/admin">
              <motion.div
                className="w-full mb-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 flex items-center justify-center space-x-3 text-white hover:shadow-2xl transition-shadow"
                whileHover={{ scale: 1.02 }}
              >
                <Crown className="w-6 h-6 text-yellow-400" />
                <span className="font-bold text-lg">Admin Panel</span>
              </motion.div>
            </Link>
          )}

          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="space-y-1">
              {mainMenuItems.map((item, index) => (
                <Link to={item.path} key={item.label}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="w-full p-3 flex items-center justify-between hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5 text-gray-500" />
                      <span className="font-medium text-gray-800">{item.label}</span>
                    </div>
                    <span className="text-gray-400">›</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 mt-6">
            <h2 className="text-sm font-semibold text-gray-500 mb-2 px-3">Legal & Info</h2>
            <div className="space-y-1">
              {legalMenuItems.map((item, index) => (
                <Link to={item.path} key={item.label}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (mainMenuItems.length + index) * 0.1 }}
                    className="w-full p-3 flex items-center justify-between hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5 text-gray-500" />
                      <div>
                        <span className="font-medium text-gray-800">{item.label}</span>
                        <p className="text-xs text-gray-500">{item.summary}</p>
                      </div>
                    </div>
                    <span className="text-gray-400">›</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          <motion.button
            onClick={handleSignOut}
            className="w-full mt-6 bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-center space-x-2 text-red-600 hover:bg-red-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {isEditModalOpen && <EditProfileModal onClose={() => setIsEditModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default ProfilePage;
