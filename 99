import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Car, Banknote, Landmark, Handshake, Wrench } from 'lucide-react';
import ToolCard from '../components/Tools/ToolCard';

const tools = [
  {
    title: 'Translator',
    description: 'Translate text and learn common phrases.',
    icon: Globe,
    path: '/tools/translate',
    color: 'blue',
    comingSoon: false,
  },
  {
    title: 'Fare Calculator',
    description: 'Estimate auto and taxi fares instantly.',
    icon: Car,
    path: '/tools/fare-calculator',
    color: 'amber',
    comingSoon: false,
  },
  {
    title: 'Currency Exchanger',
    description: 'Get live rates and find exchange spots.',
    icon: Banknote,
    path: '/tools/currency-exchanger',
    color: 'green',
    comingSoon: false,
  },
  {
    title: 'Budget Tracker',
    description: 'Plan and track your daily travel expenses.',
    icon: Landmark,
    path: '/tools/budget-tracker',
    color: 'indigo',
    comingSoon: false,
  },
  {
    title: 'Bargaining Coach',
    description: 'Learn to haggle like a local with a fun simulator.',
    icon: Handshake,
    path: '/tools/bargaining-coach',
    color: 'rose',
    comingSoon: false,
  },
];

const ToolsPage: React.FC = () => {
  return (
    <div className="pb-24">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-4 pt-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Wrench className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <h1 className="text-2xl font-medium text-gray-900 mb-2">
            All <span className="text-orange-500">Essential Tools</span>
          </h1>
          <p className="text-gray-600">Your one-stop utility kit for traveling in India.</p>
        </motion.div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ToolCard {...tool} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
