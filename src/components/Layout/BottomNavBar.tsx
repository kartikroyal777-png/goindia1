import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Scan, Globe, MapPin, User } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNavBar: React.FC = () => {
  const location = useLocation();
  const tabs = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/food-scorer', label: 'Food Score', icon: Scan },
    { path: '/translate', label: 'Translate', icon: Globe },
    { path: '/planner', label: 'Trip Planner', icon: MapPin },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  if (location.pathname.startsWith('/city/') || location.pathname.startsWith('/tehsil/') || location.pathname.startsWith('/location/') || location.pathname === '/auth') {
    return null;
  }

  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50"
    >
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          
          return (
            <NavLink
              to={tab.path}
              key={tab.path}
              className={`relative flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
                isActive 
                  ? 'text-orange-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <motion.div
                className={`p-1 rounded-full ${isActive ? 'bg-orange-50' : ''}`}
                animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-orange-500' : ''}`} />
              </motion.div>
              <span className={`text-xs mt-1 font-medium ${
                isActive ? 'text-orange-500' : 'text-gray-500'
              }`}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-2 w-8 h-1 bg-orange-500 rounded-full"
                />
              )}
            </NavLink>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default BottomNavBar;
