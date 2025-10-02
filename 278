import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { City, Category } from '../../types';

interface CityFormProps {
  city: City | null;
  onSave: () => void;
}

const initialCityState: Partial<City> = {
  name: '',
  state: '',
  description: '',
  short_tagline: '',
  thumbnail_url: '',
  popularity_score: 50,
  safety_score: 5,
  best_time_to_visit: '',
  weather_info: '',
};

const CityForm: React.FC<CityFormProps> = ({ city, onSave }) => {
  const [formData, setFormData] = useState<Partial<City>>(initialCityState);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*');
      if (data) setAllCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (city) {
      setFormData(city);
      const fetchCityCategories = async () => {
        const { data } = await supabase.from('city_categories').select('category_id').eq('city_id', city.id);
        const currentCategoryIds = new Set(data?.map(cc => cc.category_id) || []);
        setSelectedCategories(currentCategoryIds);
      };
      fetchCityCategories();
    } else {
      setFormData(initialCityState);
      setSelectedCategories(new Set());
    }
  }, [city]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name.endsWith('_score') ? parseInt(value) : value }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { city_categories, ...cityDataToSave } = formData;

    const { data: savedCity, error: cityError } = city?.id
      ? await supabase.from('cities').update(cityDataToSave).eq('id', city.id).select().single()
      : await supabase.from('cities').insert(cityDataToSave).select().single();

    if (cityError) {
      setError(cityError.message);
      setLoading(false);
      return;
    }

    const cityId = savedCity.id;
    const { error: deleteError } = await supabase.from('city_categories').delete().eq('city_id', cityId);
    if (deleteError) {
      setError(`Failed to update categories: ${deleteError.message}`);
      setLoading(false);
      return;
    }

    if (selectedCategories.size > 0) {
      const categoryLinks = Array.from(selectedCategories).map(catId => ({ city_id: cityId, category_id: catId }));
      const { error: insertError } = await supabase.from('city_categories').insert(categoryLinks);
      if (insertError) {
        setError(`Failed to link categories: ${insertError.message}`);
        setLoading(false);
        return;
      }
    }

    onSave();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col">
      <h3 className="text-lg font-medium">{city ? 'Edit City' : 'Add New City'}</h3>
      <div className="flex-grow overflow-y-auto pr-2 space-y-4">
        {Object.keys(initialCityState).map(key => {
          if (key === 'id') return null;
          const fieldKey = key as keyof typeof formData;
          const isTextarea = ['description', 'weather_info'].includes(key);
          const isNumber = key.endsWith('_score');
          
          return (
            <div key={key}>
              <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize mb-1">{key.replace(/_/g, ' ')}</label>
              {isTextarea ? (
                <textarea id={key} name={key} value={String(formData[fieldKey] || '')} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" rows={3} />
              ) : (
                <input id={key} name={key} type={isNumber ? 'number' : 'text'} value={String(formData[fieldKey] || '')} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" max={isNumber && key.includes('safety') ? 10 : isNumber ? 100 : undefined} min={isNumber ? 0 : undefined} />
              )}
            </div>
          );
        })}
        <div>
          <label className="block text-sm font-medium text-gray-700 capitalize mb-2">Categories</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {allCategories.map(cat => (
              <div key={cat.id} className="flex items-center">
                <input
                  id={`cat-${cat.id}`}
                  type="checkbox"
                  checked={selectedCategories.has(cat.id)}
                  onChange={() => handleCategoryChange(cat.id)}
                  className="h-4 w-4 text-orange-600 border-gray-300 rounded"
                />
                <label htmlFor={`cat-${cat.id}`} className="ml-2 text-sm text-gray-700">{cat.name}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button type="submit" disabled={loading} className="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50 text-sm font-medium">
          {loading ? 'Saving...' : 'Save City'}
        </button>
      </div>
    </form>
  );
};

export default CityForm;
