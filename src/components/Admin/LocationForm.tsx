import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Location, LocationImage } from '../../types';
import { Trash2, PlusCircle } from 'lucide-react';

interface LocationFormProps {
  location: Location | null;
  tehsilId: string;
  onSave: () => void;
}

const initialLocationState: Omit<Location, 'id' | 'tehsil_id' | 'images'> = {
  name: '',
  category: '',
  short_intro: '',
  image_url: '',
  coordinates: { lat: 0, lng: 0 },
  basic_info: { opening_hours: '', best_time_to_visit: '', entry_fee: { local: '', foreigner: '' } },
  access_transport: { nearest_airport: '', public_transport_guide: '', taxi_fare_estimate: '', last_mile_access: '', travel_time_from_center: '' },
  safety_risks: { safety_score: 5, common_scams: [], pickpocket_risk: 'Medium', emergency_contacts: [] },
  local_insights: { cultural_etiquette: [], local_phrases: [], food_safety_note: '', women_specific_tips: [] },
  costs_money: { average_budget: '', nearby_atms: '', digital_payments_accepted: true, haggling_needed: 'Yes' },
  amenities: { toilets: 'Available', wifi_signal: 'None', seating: false, water_refill_points: false },
  food_stay: { nearby_restaurants: [], local_specialty: '' },
};

const LocationForm: React.FC<LocationFormProps> = ({ location, tehsilId, onSave }) => {
  const [formData, setFormData] = useState<Omit<Location, 'id' | 'tehsil_id' | 'images'>>(JSON.parse(JSON.stringify(initialLocationState)));
  const [images, setImages] = useState<LocationImage[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location) {
      const locationCopy = JSON.parse(JSON.stringify(location));
      const { id, tehsil_id, images: locationImages, ...rest } = locationCopy;
      setFormData(rest);
      setImages(locationImages || []);
    } else {
      setFormData(JSON.parse(JSON.stringify(initialLocationState)));
      setImages([]);
    }
  }, [location]);

  const handleValueChange = (path: string, value: any, type?: string) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newState = JSON.parse(JSON.stringify(prev));
      let current = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      let finalValue = value;
      if (type === 'checkbox') finalValue = (value as unknown as React.ChangeEvent<HTMLInputElement>).target.checked;
      if (type === 'number') finalValue = parseFloat(value) || 0;

      current[keys[keys.length - 1]] = finalValue;
      return newState;
    });
  };

  const handleArrayItemChange = (path: string, index: number, value: string) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newState = JSON.parse(JSON.stringify(prev));
      let currentArray = newState;
      keys.forEach(key => { currentArray = currentArray[key]; });
      currentArray[index] = value;
      return newState;
    });
  };
  
  const handleObjectArrayChange = (path: string, index: number, field: string, value: any) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newState = JSON.parse(JSON.stringify(prev));
      let currentArray = newState;
      keys.forEach(key => { currentArray = currentArray[key]; });
      currentArray[index][field] = value;
      return newState;
    });
  };

  const addArrayItem = (path: string, newItem: any) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newState = JSON.parse(JSON.stringify(prev));
      let current = newState;
      for (let i = 0; i < keys.length; i++) {
        current = current[keys[i]];
      }
      current.push(newItem);
      return newState;
    });
  };

  const deleteArrayItem = (path: string, index: number) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newState = JSON.parse(JSON.stringify(prev));
      let current = newState;
      for (let i = 0; i < keys.length; i++) {
        current = current[keys[i]];
      }
      current.splice(index, 1);
      return newState;
    });
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages(prev => [...prev, { id: `new_${Date.now()}`, location_id: location?.id || '', image_url: newImageUrl }]);
      setNewImageUrl('');
    }
  };

  const handleDeleteImage = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    let dataToSave: any = { ...formData, tehsil_id: tehsilId };

    const { data: locationData, error: locationError } = location?.id
      ? await supabase.from('locations').update(dataToSave).eq('id', location.id).select().single()
      : await supabase.from('locations').insert(dataToSave).select().single();

    if (locationError) {
      setError(locationError.message);
      setLoading(false);
      return;
    }

    const locationId = locationData.id;
    await supabase.from('location_images').delete().eq('location_id', locationId);

    if (images.length > 0) {
      const imagesToInsert = images.map(({ image_url, alt_text }) => ({ location_id: locationId, image_url, alt_text }));
      const { error: insertImagesError } = await supabase.from('location_images').insert(imagesToInsert);
      if (insertImagesError) {
        setError(`Failed to add images: ${insertImagesError.message}`);
        setLoading(false);
        return;
      }
    }
    
    onSave();
    setLoading(false);
  };

  const renderField = (label: string, path: string, type: 'text' | 'number' | 'textarea' | 'select' | 'checkbox' = 'text', options?: string[]) => {
    const keys = path.split('.');
    let value = formData as any;
    try {
      keys.forEach(key => { value = value[key]; });
    } catch {
      value = '';
    }

    const commonProps = {
      id: path,
      name: path,
      value: value,
      onChange: (e: React.ChangeEvent<any>) => handleValueChange(path, e.target.value, type),
      className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
    };

    if (type === 'textarea') return <textarea {...commonProps} rows={2} />;
    if (type === 'select' && options) return <select {...commonProps}>{options.map(o => <option key={o} value={o}>{o}</option>)}</select>;
    if (type === 'checkbox') return (
      <div className="flex items-center"><input type="checkbox" id={path} name={path} checked={!!value} onChange={(e) => handleValueChange(path, e, 'checkbox')} className="h-4 w-4 text-orange-600 border-gray-300 rounded" /><label htmlFor={path} className="ml-2 text-sm">{label}</label></div>
    );
    return <input type={type} {...commonProps} step={type === 'number' ? 'any' : undefined} />;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col">
      <h3 className="text-lg font-bold">{location ? 'Edit Location' : 'Add New Location'}</h3>
      <div className="flex-grow overflow-y-auto pr-2 space-y-4">
        {renderField('Name', 'name')}
        {renderField('Category', 'category')}
        {renderField('Main Image URL', 'image_url', 'text')}
        {renderField('Short Intro', 'short_intro', 'textarea')}
        
        <details className="border p-4 rounded-lg space-y-2"><summary className="font-medium cursor-pointer">Image Gallery</summary>
          {images.map((img, index) => (
            <div key={index} className="flex items-center space-x-2">
              <img src={img.image_url} alt="thumbnail" className="w-10 h-10 object-cover rounded"/>
              <input type="text" value={img.image_url} readOnly className="flex-grow p-1 border rounded text-xs bg-gray-100" />
              <button type="button" onClick={() => handleDeleteImage(img.id)} className="p-1 text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          <div className="flex items-center space-x-2 pt-2">
            <input type="text" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} placeholder="Add new image URL" className="flex-grow px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <button type="button" onClick={handleAddImage} className="p-2 bg-blue-500 text-white rounded-full"><PlusCircle className="w-5 h-5" /></button>
          </div>
        </details>

        <details className="border p-4 rounded-lg space-y-2"><summary className="font-medium cursor-pointer">Coordinates</summary>
          {renderField('Latitude', 'coordinates.lat', 'number')}
          {renderField('Longitude', 'coordinates.lng', 'number')}
        </details>

        <details className="border p-4 rounded-lg space-y-2"><summary className="font-medium cursor-pointer">Basic Info</summary>
          {renderField('Opening Hours', 'basic_info.opening_hours')}
          {renderField('Best Time to Visit', 'basic_info.best_time_to_visit')}
          {renderField('Entry Fee (Local)', 'basic_info.entry_fee.local')}
          {renderField('Entry Fee (Foreigner)', 'basic_info.entry_fee.foreigner')}
        </details>

        <details className="border p-4 rounded-lg space-y-2"><summary className="font-medium cursor-pointer">Access & Transport</summary>
          {Object.keys(initialLocationState.access_transport).map(key => <div key={key}><label className="text-xs font-semibold capitalize">{key.replace(/_/g, ' ')}</label>{renderField('', `access_transport.${key}`)}</div>)}
        </details>

        <details className="border p-4 rounded-lg space-y-2"><summary className="font-medium cursor-pointer">Safety & Risks</summary>
          <label className="text-xs font-semibold">Safety Score</label>{renderField('', 'safety_risks.safety_score', 'number')}
          <label className="text-xs font-semibold">Pickpocket Risk</label>{renderField('', 'safety_risks.pickpocket_risk', 'select', ['Low', 'Medium', 'High'])}
          
          <div className="space-y-2">
            <label className="text-xs font-semibold">Common Scams</label>
            {formData.safety_risks.common_scams.map((scam, i) => (
              <div key={i} className="flex items-center space-x-2">
                <input value={scam} onChange={e => handleArrayItemChange('safety_risks.common_scams', i, e.target.value)} className="w-full px-2 py-1 border rounded-md text-sm" />
                <button type="button" onClick={() => deleteArrayItem('safety_risks.common_scams', i)} className="p-1 text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('safety_risks.common_scams', '')} className="text-sm text-blue-600">+ Add Scam</button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold">Emergency Contacts</label>
            {formData.safety_risks.emergency_contacts.map((contact, i) => (
              <div key={i} className="grid grid-cols-11 gap-2">
                <input value={contact.name} onChange={e => handleObjectArrayChange('safety_risks.emergency_contacts', i, 'name', e.target.value)} placeholder="Name" className="col-span-5 px-2 py-1 border rounded-md text-sm" />
                <input value={contact.number} onChange={e => handleObjectArrayChange('safety_risks.emergency_contacts', i, 'number', e.target.value)} placeholder="Number" className="col-span-5 px-2 py-1 border rounded-md text-sm" />
                <button type="button" onClick={() => deleteArrayItem('safety_risks.emergency_contacts', i)} className="p-1 text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('safety_risks.emergency_contacts', {name: '', number: ''})} className="text-sm text-blue-600">+ Add Contact</button>
          </div>
        </details>
        
        <details className="border p-4 rounded-lg space-y-2"><summary className="font-medium cursor-pointer">Amenities</summary>
          {renderField('Toilets', 'amenities.toilets', 'select', ['Clean', 'Available', 'Not Available'])}
          {renderField('WiFi Signal', 'amenities.wifi_signal', 'select', ['Strong', 'Average', 'Weak', 'None'])}
          {renderField('Seating', 'amenities.seating', 'checkbox')}
          {renderField('Water Refills', 'amenities.water_refill_points', 'checkbox')}
        </details>
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
