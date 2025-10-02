import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { City } from '../../types';

interface CityFormModalProps {
  city: City | null;
  onClose: () => void;
  onSave: () => void;
}

const CityFormModal: React.FC<CityFormModalProps> = ({ city, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<City>>({
    name: '',
    state: '',
    description: '',
    short_tagline: '',
    thumbnail_url: '',
    popularity_score: 50,
    safety_score: 5,
    best_time_to_visit: '',
    weather_info: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (city) {
      setFormData(city);
    }
  }, [city]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name.endsWith('_score') ? parseInt(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: apiError } = city?.id
      ? await supabase.from('cities').update(formData).eq('id', city.id)
      : await supabase.from('cities').insert(formData);

    if (apiError) {
      setError(apiError.message);
    } else {
      onSave();
      onClose();
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
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{city ? 'Edit City' : 'Add New City'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          {Object.keys(formData).map(key => {
            if (key === 'id') return null;
            const fieldKey = key as keyof typeof formData;
            const isTextarea = ['description', 'weather_info'].includes(key);
            const isNumber = key.endsWith('_score');
            
            return (
              <div key={key}>
                <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize mb-1">{key.replace(/_/g, ' ')}</label>
                {isTextarea ? (
                  <textarea
                    id={key}
                    name={key}
                    value={formData[fieldKey] as string}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={3}
                  />
                ) : (
                  <input
                    id={key}
                    name={key}
                    type={isNumber ? 'number' : 'text'}
                    value={formData[fieldKey] as string | number}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    max={isNumber && key.includes('safety') ? 10 : isNumber ? 100 : undefined}
                    min={isNumber ? 0 : undefined}
                  />
                )}
              </div>
            );
          })}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50">
              {loading ? 'Saving...' : 'Save City'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CityFormModal;
