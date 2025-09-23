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
  const [formData, setFormData] = useState<Omit<Location, 'id' | 'tehsil_id' | 'images'>>(initialLocationState);
  const [images, setImages] = useState<LocationImage[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location) {
      // Deep copy to prevent direct state mutation issues with nested objects
      const locationCopy = JSON.parse(JSON.stringify(location));
      const { id, tehsil_id, images: locationImages, ...rest } = locationCopy;
      setFormData(rest);
      setImages(locationImages || []);
    } else {
      setFormData(initialLocationState);
      setImages([]);
    }
  }, [location]);

  const handleSimpleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, parentKey: keyof typeof formData) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    const val = type === 'checkbox' ? checked : (name === 'safety_score' ? parseInt(value) : value);
    
    setFormData(prev => ({
      ...prev,
      [parentKey]: { ...(prev[parentKey] as object), [name]: val },
    }));
  };
  
  const handleDeeplyNestedChange = (e: React.ChangeEvent<HTMLInputElement>, parentKey: keyof typeof formData, childKey: string, isNumber = false) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [parentKey]: {
        ...(prev[parentKey] as object),
        [childKey]: { ...((prev[parentKey] as any)[childKey] || {}), [name]: isNumber ? parseFloat(value) : value },
      },
    }));
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>, parentKey: keyof typeof formData, childKey: string) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      [parentKey]: {
        ...(prev[parentKey] as object),
        [childKey]: value.split('\n').filter(line => line.trim() !== ''),
      },
    }));
  };
  
  const handleJsonArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>, parentKey: keyof typeof formData, childKey: string) => {
    const { value } = e.target;
    // We just update the string value, validation happens on submit or blur if needed
    setFormData(prev => ({
      ...prev,
      [parentKey]: {
        ...(prev[parentKey] as object),
        [childKey]: value,
      },
    }));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      const newImage: LocationImage = {
        id: `new_${Date.now()}`,
        location_id: location?.id || '',
        image_url: newImageUrl,
      };
      setImages(prev => [...prev, newImage]);
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
    
    // Create a mutable copy to parse JSON fields
    let dataToSave: any = JSON.parse(JSON.stringify(formData));
    dataToSave.tehsil_id = tehsilId;

    // Safely parse JSON textareas
    try {
        dataToSave.safety_risks.emergency_contacts = JSON.parse(dataToSave.safety_risks.emergency_contacts);
        dataToSave.local_insights.local_phrases = JSON.parse(dataToSave.local_insights.local_phrases);
        dataToSave.food_stay.nearby_restaurants = JSON.parse(dataToSave.food_stay.nearby_restaurants);
    } catch (jsonError) {
        setError("Invalid JSON format in one of the text areas (e.g., Emergency Contacts, Local Phrases). Please check the structure.");
        setLoading(false);
        return;
    }

    const { data: locationData, error: locationError } = location?.id
      ? await supabase.from('locations').update(dataToSave).eq('id', location.id).select().single()
      : await supabase.from('locations').insert(dataToSave).select().single();

    if (locationError) {
      setError(locationError.message);
      setLoading(false);
      return;
    }

    // Sync images
    const locationId = locationData.id;
    const { error: deleteImagesError } = await supabase.from('location_images').delete().eq('location_id', locationId);
    if (deleteImagesError) {
      setError(`Failed to update images: ${deleteImagesError.message}`);
      setLoading(false);
      return;
    }

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
  
  const renderInput = (name: string, value: any, onChange: any, type = 'text', parent?: string, props: object = {}) => (
    <div>
      <label htmlFor={`${parent}-${name}`} className="block text-sm font-medium text-gray-700 capitalize mb-1">{name.replace(/_/g, ' ')}</label>
      <input id={`${parent}-${name}`} type={type} name={name} value={value} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" {...props} />
    </div>
  );
  const renderTextarea = (name: string, value: any, onChange: any, parent?: string, props: object = {}) => (
    <div>
      <label htmlFor={`${parent}-${name}`} className="block text-sm font-medium text-gray-700 capitalize mb-1">{name.replace(/_/g, ' ')}</label>
      <textarea id={`${parent}-${name}`} name={name} value={value} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" rows={3} {...props} />
    </div>
  );
  const renderSelect = (name: string, value: any, onChange: any, options: string[], parent?: string) => (
    <div>
      <label htmlFor={`${parent}-${name}`} className="block text-sm font-medium text-gray-700 capitalize mb-1">{name.replace(/_/g, ' ')}</label>
      <select id={`${parent}-${name}`} name={name} value={value} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
  const renderCheckbox = (name: string, checked: boolean, onChange: any, parent?: string) => (
     <div className="flex items-center">
      <input id={`${parent}-${name}`} type="checkbox" name={name} checked={checked} onChange={onChange} className="h-4 w-4 text-orange-600 border-gray-300 rounded" />
      <label htmlFor={`${parent}-${name}`} className="ml-2 block text-sm text-gray-900 capitalize">{name.replace(/_/g, ' ')}</label>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col">
      <h3 className="text-lg font-bold">{location ? 'Edit Location' : 'Add New Location'}</h3>
      <div className="flex-grow overflow-y-auto pr-2 space-y-4">
        {renderInput('name', formData.name, handleSimpleChange, 'text', 'top')}
        {renderInput('category', formData.category, handleSimpleChange, 'text', 'top')}
        {renderInput('image_url', formData.image_url, handleSimpleChange, 'text', 'top', {placeholder: "Main thumbnail URL..."})}
        {renderTextarea('short_intro', formData.short_intro, handleSimpleChange, 'top')}

        <details className="border p-4 rounded-lg space-y-2"><summary className="font-medium cursor-pointer">Image Gallery</summary>
          <div className="space-y-2">
            {images.map((img) => (
              <div key={img.id} className="flex items-center space-x-2">
                <img src={img.image_url} alt="thumbnail" className="w-10 h-10 object-cover rounded"/>
                <input type="text" value={img.image_url} readOnly className="flex-grow p-1 border rounded text-xs bg-gray-100" />
                <button type="button" onClick={() => handleDeleteImage(img.id)} className="p-1 text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <input type="text" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} placeholder="Add new image URL" className="flex-grow px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <button type="button" onClick={handleAddImage} className="p-2 bg-blue-500 text-white rounded-full"><PlusCircle className="w-5 h-5" /></button>
          </div>
        </details>

        <details className="border p-4 rounded-lg space-y-2"><summary className="font-medium cursor-pointer">Coordinates</summary>
          {renderInput('lat', formData.coordinates.lat, (e:any) => handleDeeplyNestedChange(e, 'coordinates', 'lat', true), 'number', 'coords', {step: "any"})}
          {renderInput('lng', formData.coordinates.lng, (e:any) => handleDeeplyNestedChange(e, 'coordinates', 'lng', true), 'number', 'coords', {step: "any"})}
        </details>

        <details className="border p-4 rounded-lg space-y-2"><summary className="font-medium cursor-pointer">Basic Info</summary>
          {renderInput('opening_hours', formData.basic_info.opening_hours, (e:any) => handleNestedChange(e, 'basic_info'), 'text', 'basic')}
          {renderInput('best_time_to_visit', formData.basic_info.best_time_to_visit, (e:any) => handleNestedChange(e, 'basic_info'), 'text', 'basic')}
          {renderInput('local', formData.basic_info.entry_fee.local, (e:any) => handleDeeplyNestedChange(e, 'basic_info', 'entry_fee'), 'text', 'basic-fee-local')}
          {renderInput('foreigner', formData.basic_info.entry_fee.foreigner, (e:any) => handleDeeplyNestedChange(e, 'basic_info', 'entry_fee'), 'text', 'basic-fee-foreigner')}
        </details>

        <details className="border p-4 rounded-lg space-y-2"><summary className="font-medium cursor-pointer">Access & Transport</summary>
            {Object.keys(formData.access_transport).map(key => (
              <div key={`transport-${key}`}>
                <label htmlFor={`transport-${key}`} className="block text-sm font-medium text-gray-700 capitalize mb-1">{key.replace(/_/g, ' ')}</label>
                <input
                  id={`transport-${key}`}
                  type="text"
                  name={key}
                  value={(formData.access_transport as any)[key]}
                  onChange={(e: any) => handleNestedChange(e, 'access_transport')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            ))}
        </details>

        <details className="border p-4 rounded-lg space-y-2"><summary className="font-medium cursor-pointer">Safety & Risks</summary>
            {renderInput('safety_score', formData.safety_risks.safety_score, (e:any) => handleNestedChange(e, 'safety_risks'), 'number', 'safety', {min: 0, max: 10})}
            {renderSelect('pickpocket_risk', formData.safety_risks.pickpocket_risk, (e:any) => handleNestedChange(e, 'safety_risks'), ['Low', 'Medium', 'High'], 'safety')}
            {renderTextarea('common_scams', formData.safety_risks.common_scams.join('\n'), (e:any) => handleArrayChange(e, 'safety_risks', 'common_scams'), 'safety', {placeholder: "One scam per line"})}
            {renderTextarea('emergency_contacts', typeof formData.safety_risks.emergency_contacts === 'string' ? formData.safety_risks.emergency_contacts : JSON.stringify(formData.safety_risks.emergency_contacts, null, 2), (e:any) => handleJsonArrayChange(e, 'safety_risks', 'emergency_contacts'), 'safety', {placeholder: '[{"name": "Police", "number": "112"}]'})}
        </details>

        <details className="border p-4 rounded-lg space-y-2"><summary className="font-medium cursor-pointer">Local Insights</summary>
            {renderTextarea('cultural_etiquette', formData.local_insights.cultural_etiquette.join('\n'), (e:any) => handleArrayChange(e, 'local_insights', 'cultural_etiquette'), 'insights', {placeholder: "One tip per line"})}
            {renderTextarea('women_specific_tips', formData.local_insights.women_specific_tips.join('\n'), (e:any) => handleArrayChange(e, 'local_insights', 'women_specific_tips'), 'insights', {placeholder: "One tip per line"})}
            {renderTextarea('food_safety_note', formData.local_insights.food_safety_note, (e:any) => handleNestedChange(e, 'local_insights'), 'insights')}
            {renderTextarea('local_phrases', typeof formData.local_insights.local_phrases === 'string' ? formData.local_insights.local_phrases : JSON.stringify(formData.local_insights.local_phrases, null, 2), (e:any) => handleJsonArrayChange(e, 'local_insights', 'local_phrases'), 'insights', {placeholder: '[{"phrase": "...", "translation": "..."}]'})}
        </details>
        
        <details className="border p-4 rounded-lg space-y-2"><summary className="font-medium cursor-pointer">Costs & Money</summary>
            {renderInput('average_budget', formData.costs_money.average_budget, (e:any) => handleNestedChange(e, 'costs_money'), 'text', 'costs')}
            {renderInput('nearby_atms', formData.costs_money.nearby_atms, (e:any) => handleNestedChange(e, 'costs_money'), 'text', 'costs')}
            {renderSelect('haggling_needed', formData.costs_money.haggling_needed, (e:any) => handleNestedChange(e, 'costs_money'), ['Yes', 'No', 'Sometimes'], 'costs')}
            {renderCheckbox('digital_payments_accepted', formData.costs_money.digital_payments_accepted, (e:any) => handleNestedChange(e, 'costs_money'), 'costs')}
        </details>
        
        <details className="border p-4 rounded-lg space-y-2"><summary className="font-medium cursor-pointer">Amenities</summary>
            {renderSelect('toilets', formData.amenities.toilets, (e:any) => handleNestedChange(e, 'amenities'), ['Clean', 'Available', 'Not Available'], 'amenities')}
            {renderSelect('wifi_signal', formData.amenities.wifi_signal, (e:any) => handleNestedChange(e, 'amenities'), ['Strong', 'Average', 'Weak', 'None'], 'amenities')}
            {renderCheckbox('seating', formData.amenities.seating, (e:any) => handleNestedChange(e, 'amenities'), 'amenities')}
            {renderCheckbox('water_refill_points', formData.amenities.water_refill_points, (e:any) => handleNestedChange(e, 'amenities'), 'amenities')}
        </details>

        <details className="border p-4 rounded-lg space-y-2"><summary className="font-medium cursor-pointer">Food & Stay</summary>
            {renderInput('local_specialty', formData.food_stay.local_specialty, (e:any) => handleNestedChange(e, 'food_stay'), 'text', 'food')}
            {renderTextarea('nearby_restaurants', typeof formData.food_stay.nearby_restaurants === 'string' ? formData.food_stay.nearby_restaurants : JSON.stringify(formData.food_stay.nearby_restaurants, null, 2), (e:any) => handleJsonArrayChange(e, 'food_stay', 'nearby_restaurants'), 'food', {placeholder: '[{"name": "...", "rating": 4.5}]'})}
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
