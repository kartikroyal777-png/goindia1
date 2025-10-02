import React from 'react';
import { ArrowLeft, Bell, Palette, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AppSettingsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center space-x-4">
        <motion.button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </motion.button>
        <h1 className="text-xl font-bold text-gray-900">App Settings</h1>
      </div>
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <h2 className="font-semibold text-lg mb-4">General</h2>
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-500" />
              <span>Push Notifications</span>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </div>
           <div className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-3">
              <Palette className="w-5 h-5 text-gray-500" />
              <span>Dark Mode</span>
            </div>
            <span className="text-sm text-gray-400">Coming Soon</span>
          </div>
           <div className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-gray-500" />
              <span>Language</span>
            </div>
            <select className="border-none bg-gray-100 rounded-md p-1 text-sm">
                <option>English</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSettingsPage;
