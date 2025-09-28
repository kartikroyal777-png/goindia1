import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Bell, Globe, LayoutDashboard, LogOut, ArrowLeft, Tag, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ContentManager from '../components/Admin/ContentManager';
import NotificationManager from '../components/Admin/NotificationManager';
import DictionaryManager from '../components/Admin/DictionaryManager';
import PriceGuideManager from '../components/Admin/PriceGuideManager';

const Dashboard = () => <div className="p-6 bg-gray-100 rounded-lg">Dashboard content goes here. Analytics and summary stats will be shown here.</div>;

const AdminPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'content', label: 'Content', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'dictionary', label: 'Dictionary', icon: Globe },
    { id: 'price_guide', label: 'Price Guide', icon: Tag },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'content': return <ContentManager />;
      case 'notifications': return <NotificationManager />;
      case 'dictionary': return <DictionaryManager />;
      case 'price_guide': return <PriceGuideManager />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-medium">Admin Panel</h1>
          <p className="text-sm text-gray-400 truncate">{user?.email}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors text-left ${
                activeTab === tab.id ? 'bg-orange-600 text-white' : 'hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button onClick={() => navigate('/')} className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-700 text-left mb-2">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to App</span>
          </button>
          <button onClick={handleSignOut} className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-700 text-left">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {renderContent()}
        </motion.div>
      </main>
    </div>
  );
};

export default AdminPage;
