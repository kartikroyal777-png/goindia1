import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Handshake, Tag, BookOpen, Check, X, Gamepad2, MessageCircle } from 'lucide-react';
import PriceGuide from '../../components/Tools/Bargaining/PriceGuide';
import CommonPhrases from '../../components/Tools/Bargaining/CommonPhrases';
import DosAndDonts from '../../components/Tools/Bargaining/DosAndDonts';
import Simulator from '../../components/Tools/Bargaining/Simulator';
import CrowdsourcedTips from '../../components/Tools/Bargaining/CrowdsourcedTips';

const tabs = [
  { id: 'simulator', label: 'Simulator', icon: Gamepad2 },
  { id: 'prices', label: 'Price Guide', icon: Tag },
  { id: 'phrases', label: 'Phrases', icon: BookOpen },
  { id: 'dos_donts', label: 'Do\'s & Don\'ts', icon: Check },
  { id: 'tips', label: 'User Tips', icon: MessageCircle },
];

const BargainingCoachPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('simulator');

  const renderContent = () => {
    switch (activeTab) {
      case 'prices': return <PriceGuide />;
      case 'phrases': return <CommonPhrases />;
      case 'dos_donts': return <DosAndDonts />;
      case 'tips': return <CrowdsourcedTips />;
      case 'simulator':
      default:
        return <Simulator />;
    }
  };

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-20 flex items-center space-x-4">
        <Link to="/tools" className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">Bargaining Coach</h1>
      </div>

      <div className="sticky top-[72px] bg-white/80 backdrop-blur-sm z-10 border-b">
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide px-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-shrink-0 flex items-center space-x-2 py-3 px-3 text-sm font-medium transition-colors ${
                activeTab === tab.id ? 'text-rose-500' : 'text-gray-500 hover:text-rose-500'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="bargainTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500"
                />
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BargainingCoachPage;
