import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { BargainingPrice } from '../../types';
import { PlusCircle, Edit, Trash2, RefreshCw, X } from 'lucide-react';

const PriceForm: React.FC<{ price: BargainingPrice | null, onSave: () => void, onClose: () => void }> = ({ price, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    location_name: price?.location_name || '',
    item_name: price?.item_name || '',
    fair_price_range: price?.fair_price_range || '',
    quoted_price_range: price?.quoted_price_range || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = price?.id
      ? await supabase.from('bargaining_price_guide').update(formData).eq('id', price.id)
      : await supabase.from('bargaining_price_guide').insert(formData);
    
    if (!error) onSave();
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-medium mb-4">{price ? 'Edit Price' : 'Add Price'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="location_name" value={formData.location_name} onChange={e => setFormData({...formData, location_name: e.target.value})} placeholder="Location (e.g., Delhi)" className="w-full p-2 border rounded" required />
          <input name="item_name" value={formData.item_name} onChange={e => setFormData({...formData, item_name: e.target.value})} placeholder="Item (e.g., T-shirt)" className="w-full p-2 border rounded" required />
          <input name="fair_price_range" value={formData.fair_price_range} onChange={e => setFormData({...formData, fair_price_range: e.target.value})} placeholder="Fair Price (e.g., ₹150-300)" className="w-full p-2 border rounded" />
          <input name="quoted_price_range" value={formData.quoted_price_range} onChange={e => setFormData({...formData, quoted_price_range: e.target.value})} placeholder="Quoted Price (e.g., ₹600-800)" className="w-full p-2 border rounded" />
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-orange-500 text-white rounded disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const PriceGuideManager: React.FC = () => {
  const [prices, setPrices] = useState<BargainingPrice[]>([]);
  const [editingPrice, setEditingPrice] = useState<BargainingPrice | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('bargaining_price_guide').select('*').order('location_name').order('item_name');
    if (error) setError(error.message);
    else setPrices(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPrices() }, [fetchPrices]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      await supabase.from('bargaining_price_guide').delete().eq('id', id);
      fetchPrices();
    }
  };

  const handleSave = () => {
    setIsFormOpen(false);
    fetchPrices();
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-medium text-gray-800">Price Guide Manager</h2>
        <div className="flex space-x-2">
          <button onClick={fetchPrices} disabled={loading} className="p-2 bg-gray-200 rounded-full"><RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} /></button>
          <button onClick={() => { setEditingPrice(null); setIsFormOpen(true); }} className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg">
            <PlusCircle className="w-5 h-5" /><span>Add Price</span>
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-2">
        {prices.map(price => (
          <div key={price.id} className="bg-white p-3 rounded-lg shadow-sm flex items-center justify-between">
            <div>
              <p className="font-medium">{price.item_name} <span className="text-sm text-gray-500">@ {price.location_name}</span></p>
              <p className="text-sm">Fair: <span className="font-semibold text-green-600">{price.fair_price_range}</span> | Quoted: <span className="font-semibold text-red-600">{price.quoted_price_range}</span></p>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => { setEditingPrice(price); setIsFormOpen(true); }} className="p-2 text-gray-500 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(price.id)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isFormOpen && <PriceForm price={editingPrice} onSave={handleSave} onClose={() => setIsFormOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default PriceGuideManager;
