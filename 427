import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Tehsil } from '../../types';

interface TehsilFormProps {
  tehsil: Tehsil | null;
  cityId: string;
  onSave: () => void;
}

const initialTehsilState: Partial<Tehsil> = {
  name: '',
  description: '',
  thumbnail_url: '',
  category: '',
  safety_rating: 5,
  location_count: 0,
};

const TehsilForm: React.FC<TehsilFormProps> = ({ tehsil, cityId, onSave }) => {
  const [formData, setFormData] = useState<Partial<Tehsil>>(initialTehsilState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(tehsil ? tehsil : initialTehsilState);
  }, [tehsil]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name.includes('rating') || name.includes('count') ? parseInt(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dataToSave = { ...formData, city_id: cityId };

    const { error: apiError } = tehsil?.id
      ? await supabase.from('tehsils').update(dataToSave).eq('id', tehsil.id)
      : await supabase.from('tehsils').insert(dataToSave);

    if (apiError) {
      setError(apiError.message);
    } else {
      onSave();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col">
      <h3 className="text-lg font-medium">{tehsil ? 'Edit Tehsil' : 'Add New Tehsil'}</h3>
      <div className="flex-grow overflow-y-auto pr-2 space-y-4">
        {Object.keys(initialTehsilState).map(key => {
          if (key === 'id' || key === 'city_id') return null;
          const fieldKey = key as keyof typeof formData;
          const isTextarea = key === 'description';
          const isNumber = key.includes('rating') || key.includes('count');
          
          return (
            <div key={key}>
              <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize mb-1">{key.replace(/_/g, ' ')}</label>
              {isTextarea ? (
                <textarea id={key} name={key} value={String(formData[fieldKey] || '')} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" rows={3} />
              ) : (
                <input id={key} name={key} type={isNumber ? 'number' : 'text'} value={String(formData[fieldKey] || '')} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" max={isNumber && key.includes('rating') ? 10 : undefined} min={isNumber ? 0 : undefined} />
              )}
            </div>
          );
        })}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button type="submit" disabled={loading} className="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50 text-sm font-medium">
          {loading ? 'Saving...' : 'Save Tehsil'}
        </button>
      </div>
    </form>
  );
};

export default TehsilForm;
