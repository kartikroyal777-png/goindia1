import React from 'react';
import { ArrowLeft, Users, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center space-x-4">
        <Link to="/profile" className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">About Us</h1>
      </div>
      <div className="p-6 space-y-6 text-gray-700 leading-relaxed">
        <p>
          GoIndia is a modern travel companion designed exclusively for international travelers exploring the beauty and diversity of India. From world-famous monuments like the Taj Mahal to hidden gems in small towns, GoIndia makes India easy, safe, and enjoyable for beginners.
        </p>
        <p>
          We provide authentic travel information, local insights, safety tips, AI-powered trip planning, live weather & AQI updates, and verified recommendations for hotels, food, and guides — all in one place.
        </p>
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-orange-800">Our Mission</h3>
              <p className="text-orange-700">“To make India beginner-friendly for every traveler.”</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center space-x-2"><Users /><span>Our Brand Story</span></h2>
          <p>
            Traveling across India can feel overwhelming for foreigners — language barriers, safety concerns, transport confusion, scams, and cultural differences often discourage many from truly experiencing the country.
          </p>
          <p className="mt-4">
            GoIndia was born from this very problem. Kartik Kumawat and Priyanshu Singh, avid travelers and developers, experienced firsthand how challenging it can be for outsiders to navigate India.
          </p>
          <p className="mt-4">
            They imagined a platform that would bridge the gap between foreign travelers and local India, making journeys smooth, safe, and unforgettable. From AI-powered trip planning to insider cultural tips, GoIndia is designed as a friend in your pocket — helping you explore confidently while supporting local communities and businesses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
