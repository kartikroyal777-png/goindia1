import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Location, LocationImage } from '../../types';
import { Trash2, PlusCircle } from 'lucide-react';

interface LocationFormProps {
  location: Location | null;
  tehsilId: string;
  onSave: () => void;
}

const getDefaultDetails = (): Location['details'] => ({
  about: { historical_background: '', cultural_significance: '', why_famous: '' },
  opening_hours: { daily_timings: {}, weekly_closures: [], seasonal_changes: '' },
  best_time_to_visit: { best_season: '', best_time_of_day: '', festival_timing: '' },
  transport: { nearest_airport: '', nearest_railway_station: '', last_mile_options: '', taxi_cost_estimate: '' },
  safety_risks: { safety_score: 5, scams_warnings: [], womens_safety_rating: '', emergency_contacts: [] },
  cultural_etiquette: { dress_code: '', dos_donts: [], temple_etiquette: '', photography_rules: '' },
  costs_money: { ticket_prices: { local: '', foreigner: '' }, avg_budget_per_day: '', haggling_info: '', digital_payment_availability: '' },
  amenities: { toilets: '', wifi: '', seating: '', water_refills: '', cloakrooms: '' },
  food_stay: { local_shops_street_food: '', dishes_to_try: '', recommended_restaurants: [], nearby_hotels: [] },
  events_festivals: { event_name: '', event_date: '', type: '' },
  weather_air_quality: { current_temp: '', humidity: '', aqi: '', seasonal_trends: '' },
  accessibility: { wheelchair_access: '', english_speaking_guides: '', foreigner_friendly_services: '' },
  nearby_essentials: { atms: '', pharmacies: '', hospitals: '', police_stations: '' },
  crowd_experience: { avg_crowd_density: '', best_crowd_free_hours: '', type_of_visitors: '' },
  traveler_tips: { hacks: '', hidden_gems: '', scam_avoidance: '', photography_spots: '' },
  google_reviews: { live_rating: '', top_traveler_quotes: [] },
  virtual_tour: { url: '' },
  hygiene_index: { rating: 3, notes: '' },
  visa_foreigner_rules: { visa_info: '', permits: '' },
});

const LocationForm: React.FC<LocationFormProps> = ({ location, tehsilId, onSave }) => {
  const [formData, setFormData] = useState<Partial<Omit<Location, 'id' | 'tehsil_id' | 'images'>>>({
    name: '',
    category: '',
    short_intro: '',
    image_url: '',
    details: getDefaultDetails(),
  });
  const [images, setImages] = useState<Partial<LocationImage>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location) {
        const defaultDetails = getDefaultDetails();
        const locationDetails = location.details || {};
        
        const mergedDetails = Object.keys(defaultDetails).reduce((acc, key) => {
            const defaultSection = defaultDetails[key as keyof typeof defaultDetails];
            const locationSection = locationDetails[key as keyof typeof locationDetails];
            acc[key as keyof typeof acc] = typeof defaultSection === 'object' && !Array.isArray(defaultSection) && defaultSection !== null
                ? { ...defaultSection, ...(locationSection || {}) }
                : locationSection ?? defaultSection;
            return acc;
        }, {} as Location['details']);

        setFormData({
            name: location.name,
            category: location.category,
            short_intro: location.short_intro,
            image_url: location.image_url,
            details: mergedDetails
        });
        setImages(location.images || []);
    } else {
        setFormData({
            name: '',
            category: '',
            short_intro: '',
            image_url: '',
            details: getDefaultDetails(),
        });
        setImages([]);
    }
  }, [location]);

  const handleDetailChange = (path: string, value: any) => {
    setFormData(prev => {
        const keys = path.split('.');
        const newState = JSON.parse(JSON.stringify(prev));
        let current = newState.details;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        return newState;
    });
  };

  const handleSimpleChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index].image_url = value;
    setImages(newImages);
  };

  const addImage = () => {
    setImages([...images, { image_url: '' }]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const dataToSave = { ...formData, tehsil_id: tehsilId };

    const { data: savedLocation, error: locationError } = location?.id
      ? await supabase.from('locations').update(dataToSave).eq('id', location.id).select().single()
      : await supabase.from('locations').insert(dataToSave).select().single();

    if (locationError) {
      setError(locationError.message);
      setLoading(false);
      return;
    }

    // Sync images
    if (savedLocation) {
        // Delete all existing images
        const { error: deleteError } = await supabase.from('location_images').delete().eq('location_id', savedLocation.id);
        if (deleteError) {
            setError(`Failed to update images: ${deleteError.message}`);
            setLoading(false);
            return;
        }

        // Insert new images if any
        const imagesToInsert = images
            .filter(img => img.image_url && img.image_url.trim() !== '')
            .map(img => ({ location_id: savedLocation.id, image_url: img.image_url, alt_text: formData.name }));
        
        if (imagesToInsert.length > 0) {
            const { error: insertError } = await supabase.from('location_images').insert(imagesToInsert);
            if (insertError) {
                setError(`Failed to insert new images: ${insertError.message}`);
                setLoading(false);
                return;
            }
        }
    }

    onSave();
    setLoading(false);
  };

  const renderField = (label: string, path: string, type: 'text' | 'number' | 'textarea' = 'text') => {
    const keys = path.split('.');
    let value: any = formData.details;
    try {
      keys.forEach(key => { value = value?.[key]; });
    } catch (e) {
      value = '';
    }

    return (
      <div className="space-y-1">
        <label className="text-xs font-semibold capitalize text-gray-600">{label.replace(/_/g, ' ')}</label>
        {type === 'textarea' ?
          <textarea value={value || ''} onChange={e => handleDetailChange(path, e.target.value)} className="w-full p-2 border rounded" rows={3} /> :
          <input type={type} value={value || ''} onChange={e => handleDetailChange(path, type === 'number' ? parseFloat(e.target.value) : e.target.value)} className="w-full p-2 border rounded" />
        }
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col">
      <h3 className="text-lg font-bold">{location ? 'Edit Location' : 'Add New Location'}</h3>
      <div className="flex-grow overflow-y-auto pr-2 space-y-4">
        <input value={formData.name} onChange={e => handleSimpleChange('name', e.target.value)} placeholder="Location Name" className="w-full p-2 border rounded font-bold" />
        <input value={formData.category} onChange={e => handleSimpleChange('category', e.target.value)} placeholder="Category (e.g., UNESCO World Heritage)" className="w-full p-2 border rounded" />
        <textarea value={formData.short_intro} onChange={e => handleSimpleChange('short_intro', e.target.value)} placeholder="Short Intro" className="w-full p-2 border rounded" rows={2} />
        <input value={formData.image_url} onChange={e => handleSimpleChange('image_url', e.target.value)} placeholder="Main Image URL (Thumbnail)" className="w-full p-2 border rounded" />

        <details className="border p-4 rounded-lg space-y-2" open>
            <summary className="font-medium cursor-pointer">Image Gallery</summary>
            {images.map((img, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <input value={img.image_url || ''} onChange={e => handleImageChange(index, e.target.value)} placeholder="Image URL" className="w-full p-2 border rounded" />
                    <button type="button" onClick={() => removeImage(index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><Trash2 className="w-4 h-4" /></button>
                </div>
            ))}
            <button type="button" onClick={addImage} className="flex items-center space-x-2 text-sm text-blue-600 font-medium">
                <PlusCircle className="w-4 h-4" />
                <span>Add Image</span>
            </button>
        </details>

        {Object.keys(formData.details || {}).map(sectionKey => (
          <details key={sectionKey} className="border p-4 rounded-lg space-y-2" open={sectionKey === 'about'}>
            <summary className="font-medium cursor-pointer capitalize">{sectionKey.replace(/_/g, ' ')}</summary>
            {Object.keys(formData.details?.[sectionKey as keyof typeof formData.details] || {}).map(fieldKey => (
              <div key={fieldKey}>
                {renderField(fieldKey, `${sectionKey}.${fieldKey}`)}
              </div>
            ))}
          </details>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button type="submit" disabled={loading} className="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50 text-sm font-medium">
          {loading ? 'Saving...' : 'Save Location'}
        </button>
      </div>
    </form>
  );
};

export default LocationForm;
