import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const tips = [
  { city: 'Delhi', text: 'Paid ₹300 for a dupatta at Janpath, actual was ₹120.', upvotes: 20 },
  { city: 'Jaipur', text: 'Tuk-tuk tried ₹400 for 2 km, fair was ₹100.', upvotes: 15 },
  { city: 'Mumbai', text: 'Got a handicraft for ₹500 in Mumbai after starting at ₹200.', upvotes: 10 },
];

const CrowdsourcedTips: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-4 border shadow-sm">
        <h3 className="font-bold mb-2">Share Your Tip!</h3>
        <textarea placeholder="e.g., In Jaipur, I got a small statue for ₹250 after being quoted ₹800." className="w-full p-2 border rounded-lg text-sm" rows={3}></textarea>
        <button className="mt-2 w-full p-2 bg-orange-500 text-white font-semibold rounded-lg text-sm">Submit Tip</button>
      </div>
      {tips.map((tip, index) => (
        <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-lg p-4 border shadow-sm flex items-start space-x-4">
          <button className="flex flex-col items-center p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
            <ArrowUp className="w-4 h-4 text-gray-600" />
            <span className="text-xs font-bold">{tip.upvotes}</span>
          </button>
          <div>
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{tip.city}</span>
            <p className="text-gray-800 mt-1">{tip.text}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CrowdsourcedTips;
