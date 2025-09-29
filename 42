import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../../lib/supabase';
import { BargainingPrice } from '../../../types';
import { Loader2 } from 'lucide-react';

const PriceGuide: React.FC = () => {
  const [prices, setPrices] = useState<BargainingPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('bargaining_price_guide')
        .select('*')
        .order('location_name');
      
      if (error) {
        setError("Could not fetch price guide. Please try again.");
        console.error(error);
      } else {
        setPrices(data);
      }
      setLoading(false);
    };
    fetchPrices();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="w-8 h-8 animate-spin text-rose-500" /></div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{typeof error === 'string' ? error : JSON.stringify(error)}</div>;
  }

  const groupedPrices = prices.reduce((acc, price) => {
    (acc[price.location_name] = acc[price.location_name] || []).push(price);
    return acc;
  }, {} as Record<string, BargainingPrice[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedPrices).map(([location, items], locIndex) => (
        <motion.div key={location} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: locIndex * 0.1 }}>
          <h3 className="font-semibold text-lg text-gray-800 mb-2">{location}</h3>
          <div className="space-y-3">
            {items.map((item, itemIndex) => (
              <div key={item.id} className="bg-white rounded-lg p-4 border shadow-sm">
                <p className="font-semibold text-gray-900">{item.item_name}</p>
                <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                  <div>
                    <p className="text-gray-500">Fair Price</p>
                    <p className="font-bold text-green-600 text-lg">{item.fair_price_range || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Often Quoted</p>
                    <p className="font-bold text-red-500 text-lg">{item.quoted_price_range || 'N/A'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PriceGuide;
