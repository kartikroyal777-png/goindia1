import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Bell, Globe, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Placeholder components for admin sections
const Dashboard = () => <div className="p-6 bg-gray-100 rounded-lg">Dashboard content goes here.</div>;
const NotificationManager = () => <div className="p-6 bg-gray-100 rounded-lg">Notification management form goes here.</div>;
const DictionaryManager = () => <div className="p-6 bg-gray-100 rounded-lg">Translation dictionary management goes here.</div>;
const ContentManager = () => <div className="p-6 bg-gray-100 rounded-lg">Content (Cities, Locations) management goes here.</div>;


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
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'translations', label: 'Dictionary', icon: Globe },
    { id: 'content', label: 'Content', icon: Shield },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'notifications': return <NotificationManager />;
      case 'translations': return <DictionaryManager />;
      case 'content': return <ContentManager />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-gray-400">{user?.email}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id ? 'bg-orange-600 text-white' : 'hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button onClick={handleSignOut} className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-700">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8">
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
