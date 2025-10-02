import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const UpgradeModal: React.FC = () => {
  const { isUpgradeModalOpen, showUpgradeModal } = useAuth();
  const navigate = useNavigate();

  const handleUpgrade = () => {
    showUpgradeModal(false);
    navigate('/pricing');
  };

  return (
    <AnimatePresence>
      {isUpgradeModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => showUpgradeModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => showUpgradeModal(false)} className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5" /></button>
            
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-200">
              <Star className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">Upgrade to Premium</h2>
            <p className="text-gray-600 mb-6">You've reached the limit of your free plan. Upgrade now to unlock unlimited access!</p>
            
            <motion.button
              onClick={handleUpgrade}
              className="w-full bg-orange-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Plans
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpgradeModal;
