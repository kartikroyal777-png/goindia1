import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Phrase } from '../../types';

interface PhraseFormProps {
  phrase: Phrase | null;
  onClose: () => void;
  onSave: () => void;
}

const PhraseForm: React.FC<PhraseFormProps> = ({ phrase, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    category: '',
    en: '',
    hi: '',
    pronunciation: '',
    is_adult: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (phrase) {
      setFormData({
        category: phrase.category,
        en: phrase.en,
        hi: phrase.hi,
        pronunciation: phrase.pronunciation || '',
        is_adult: phrase.is_adult,
      });
    } else {
      setFormData({ category: 'General', en: '', hi: '', pronunciation: '', is_adult: false });
    }
  }, [phrase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: apiError } = phrase?.id
      ? await supabase.from('phrases').update(formData).eq('id', phrase.id)
      : await supabase.from('phrases').insert(formData);

    if (apiError) {
      setError(apiError.message);
    } else {
      onSave();
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-medium">{phrase ? 'Edit Phrase' : 'Add New Phrase'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <input id="category" name="category" type="text" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
          </div>
          <div>
            <label htmlFor="en" className="block text-sm font-medium text-gray-700">English</label>
            <input id="en" name="en" type="text" value={formData.en} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
          </div>
          <div>
            <label htmlFor="hi" className="block text-sm font-medium text-gray-700">Hindi</label>
            <input id="hi" name="hi" type="text" value={formData.hi} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
          </div>
          <div>
            <label htmlFor="pronunciation" className="block text-sm font-medium text-gray-700">Pronunciation</label>
            <input id="pronunciation" name="pronunciation" type="text" value={formData.pronunciation} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div className="flex items-center space-x-2">
            <input id="is_adult" name="is_adult" type="checkbox" checked={formData.is_adult} onChange={handleChange} className="h-4 w-4 text-orange-600 border-gray-300 rounded" />
            <label htmlFor="is_adult" className="text-sm font-medium text-gray-700">Is Adult Content?</label>
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Phrase'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default PhraseForm;
