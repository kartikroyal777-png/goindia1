import React from 'react';
import { ArrowLeft, Sparkles, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AboutUsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center space-x-4">
        <motion.button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </motion.button>
        <h1 className="text-xl font-semibold text-gray-900">About Us</h1>
      </div>
      <div className="p-4 space-y-6">
        <motion.div initial={{opacity: 0, y:20}} animate={{opacity: 1, y:0}} className="bg-white rounded-xl shadow-sm border p-6">
          <Sparkles className="w-8 h-8 text-orange-500 mb-3" />
          <h2 className="font-semibold text-xl mb-2">Our Brand Story</h2>
          <p className="text-gray-600 leading-relaxed">
            Traveling across India can feel overwhelming for foreigners — language barriers, safety concerns, transport confusion, scams, and cultural differences often discourage many from truly experiencing the country.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            GoIndia was born from this very problem. Kartik Kumawat and Priyanshu Singh, avid travelers and developers, experienced firsthand how challenging it can be for outsiders to navigate India.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            They imagined a platform that would bridge the gap between foreign travelers and local India, making journeys smooth, safe, and unforgettable. From AI-powered trip planning to insider cultural tips, GoIndia is the modern travel companion designed to make India easy.
          </p>
        </motion.div>
        <motion.div initial={{opacity: 0, y:20}} animate={{opacity: 1, y:0}} transition={{delay: 0.2}} className="bg-white rounded-xl shadow-sm border p-6">
          <Target className="w-8 h-8 text-green-500 mb-3" />
          <h2 className="font-semibold text-xl mb-2">Our Mission</h2>
          <p className="text-gray-600 italic text-lg">
            ✨ “To make India beginner-friendly for every traveler.”
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            We provide authentic travel information, local insights, safety tips, AI-powered trip planning, live weather & AQI updates, and verified recommendations for hotels, food, and guides — all in one place.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUsPage;
