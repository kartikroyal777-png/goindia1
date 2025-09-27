import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, MapPin, Camera, Wrench, Map, X, Star, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const PricingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');
  const [price, setPrice] = useState(5);
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  const isAdmin = user?.email === 'kartikroyal777@gmail.com';

  const applyCoupon = () => {
    if (coupon === 'INDIA30') {
      setPrice(3.5);
      setDiscount(0.3);
      setCouponMessage('✔️ 30% discount applied!');
    } else if (coupon === 'INDIAA50') {
      setPrice(2.5);
      setDiscount(0.5);
      setCouponMessage('✔️ 50% discount applied!');
    } else if (coupon === 'INDIAA100') {
      setPrice(0);
      setDiscount(1);
      setCouponMessage('✔️ 100% discount applied! Enjoy for free.');
    } else {
      setPrice(5);
      setDiscount(0);
      setCouponMessage('❌ Invalid coupon code.');
    }
  };

  const FeatureItem: React.FC<{ icon: React.ElementType, text: string }> = ({ icon: Icon, text }) => (
    <li className="flex items-center space-x-3">
      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
        <Icon className="w-3 h-3 text-green-600" />
      </div>
      <span className="text-gray-700">{text}</span>
    </li>
  );

  return (
    <div className="min-h-screen bg-orange-50 font-sans p-4 sm:p-6 md:p-10">
      <button onClick={() => navigate('/')} className="absolute top-4 left-4 p-2 rounded-full bg-white/50 hover:bg-white transition-colors z-20">
        <ArrowLeft className="w-5 h-5 text-gray-800" />
      </button>

      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold text-orange-600">Upgrade Your GoIndia Experience</h1>
        <p className="text-gray-600 mt-2">Unlock premium features and explore India without limits.</p>
      </div>

      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-gray-800 text-white p-4 rounded-2xl mb-8 flex items-center justify-center space-x-3 shadow-lg"
        >
          <Crown className="w-6 h-6 text-yellow-400" />
          <p className="font-semibold">Admin Access — All Features Unlocked</p>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Free Plan</h2>
          <p className="text-sm text-gray-500 mb-6">Best for first-time users.</p>
          <ul className="space-y-3 mb-8">
            <FeatureItem icon={MapPin} text="Explore 10 cities" />
            <FeatureItem icon={Camera} text="10 food scans" />
            <FeatureItem icon={Map} text="10 trip planner runs" />
            <FeatureItem icon={Wrench} text="Unlimited tool usage" />
          </ul>
          <p className="text-4xl font-semibold text-center">$0</p>
          <button className="mt-6 w-full py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg">
            Your Current Plan
          </button>
        </motion.div>

        {/* Paid Plan */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-2xl p-6 shadow-xl border-2 border-orange-500 relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-orange-500 rounded-full"></div>
          <div className="absolute top-4 right-4 text-white">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <span className="absolute top-2 left-2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold transform -rotate-6">
            Most Popular
          </span>
          <h2 className="text-xl font-semibold text-gray-800 mb-1 mt-8">One-Time Plan</h2>
          <p className="text-sm text-gray-500 mb-6">The ultimate travel toolkit.</p>
          <ul className="space-y-3 mb-8">
            <FeatureItem icon={MapPin} text="Explore unlimited cities" />
            <FeatureItem icon={Camera} text="300 food scans" />
            <FeatureItem icon={Map} text="Unlimited trip planner runs" />
            <FeatureItem icon={Wrench} text="Unlimited tool usage" />
          </ul>
          <div className="text-center">
            {discount > 0 && !isAdmin && (
              <p className="text-gray-500 line-through">
                $5.00
              </p>
            )}
            <p className="text-4xl font-semibold">${isAdmin ? '0' : price.toFixed(2)}</p>
            <p className="text-sm text-gray-500">One-time payment</p>
          </div>
          {!isAdmin && (
            <div className="mt-6">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter Coupon Code"
                  className="flex-grow border p-2 rounded-lg focus:ring-2 focus:ring-orange-300 focus:outline-none"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                />
                <button
                  onClick={applyCoupon}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700"
                >
                  Apply
                </button>
              </div>
              {couponMessage && (
                <p className={`text-sm mt-2 text-center ${couponMessage.includes('❌') ? 'text-red-600' : 'text-green-600'}`}>
                  {couponMessage}
                </p>
              )}
            </div>
          )}
          <button className="mt-4 w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200">
            {isAdmin ? 'Admin Access Active' : 'Upgrade Now'}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPage;
