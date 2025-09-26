import React from 'react';
import { ArrowLeft, Bell, Moon, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AppSettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center space-x-4">
        <Link to="/profile" className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">App Settings</h1>
      </div>
      <div className="p-4 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <h2 className="text-sm font-semibold text-gray-500 mb-2 px-3">Appearance</h2>
          <div className="space-y-1">
            <SettingsItem icon={Moon} label="Dark Mode" toggle />
            <SettingsItem icon={Palette} label="Theme Color" value="Orange" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <h2 className="text-sm font-semibold text-gray-500 mb-2 px-3">Notifications</h2>
          <div className="space-y-1">
            <SettingsItem icon={Bell} label="Push Notifications" toggle />
            <SettingsItem icon={Bell} label="Promotional Offers" toggle />
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsItem: React.FC<{ icon: React.ElementType; label: string; value?: string; toggle?: boolean }> = ({ icon: Icon, label, value, toggle }) => (
  <div className="w-full p-3 flex items-center justify-between hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
    <div className="flex items-center space-x-3">
      <Icon className="w-5 h-5 text-gray-500" />
      <span className="font-medium text-gray-800">{label}</span>
    </div>
    {value && <span className="text-gray-500">{value} ›</span>}
    {toggle && <div className="w-12 h-6 bg-gray-200 rounded-full p-1 flex items-center"><div className="w-4 h-4 bg-white rounded-full shadow-md"></div></div>}
  </div>
);

export default AppSettingsPage;
