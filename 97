import React from 'react';
import { motion } from 'framer-motion';

const FullScreenLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full mb-4"
      />
      <p className="text-gray-600">Loading your experience...</p>
    </div>
  );
};

export default FullScreenLoader;
