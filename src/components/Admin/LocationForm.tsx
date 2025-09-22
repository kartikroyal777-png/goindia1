import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Location } from '../../types';

interface LocationFormProps {
  location: Location | null;
  tehsilId: string;
  onSave: () => void;
}

const initialLocationState: Location = {
  id: '',
  tehsil_id: '',
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
  const [formData, setFormData] = useState<Location>(initialLocationState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(location ? location : { ...initialLocationState, tehsil_id: tehsilId });
  }, [location, tehsilId]);

  const handleSimpleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, parentKey: keyof Location) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    const val = type === 'checkbox' ? checked : (name === 'safety_score' ? parseInt(value) : value);
    
    setFormData(prev => ({
      ...prev,
      [parentKey]: { ...(prev[parentKey] as object), [name]: val },
    }));
  };
  
  const handleDeeplyNestedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, parentKey: keyof Location, childKey: string, isNumber = false) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [parentKey]: {
        ...(prev[parentKey] as object),
        [childKey]: { ...((prev[parentKey] as any)[childKey] || {}), [name]: isNumber ? parseFloat(value) : value },
      },
    }));
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>, parentKey: keyof Location, childKey: string) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      [parentKey]: {
        ...(prev[parentKey] as object),
        [childKey]: value.split('\n').filter(line => line.trim() !== ''),
      },
    }));
  };
  
  const handleJsonArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>, parentKey: keyof Location, childKey: string) => {
    const { value } = e.target;
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        setFormData(prev => ({
          ...prev,
          [parentKey]: {
            ...(prev[parentKey] as object),
            [childKey]: parsed,
          },
        }));
      }
    } catch (err) {
      // Ignore parse errors while typing. A visual error could be added here.
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const dataToSave = { ...formData, tehsil_id: tehsilId };
    // Remove id from data if it's a new entry, as it's auto-generated
    if (!location?.id) {
      delete (dataToSave as any).id;
    }

    const { error: apiError } = location?.id
      ? await supabase.from('locations').update(dataToSave).eq('id', location.id)
      : await supabase.from('locations').insert(dataToSave).select();

    if (apiError) {
      setError(apiError.message);
    } else {
      onSave();
    }
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
        {renderInput('image_url', formData.image_url, handleSimpleChange, 'text', 'top', {placeholder: "https://images.unsplash.com/..."})}
        {renderTextarea('short_intro', formData.short_intro, handleSimpleChange, 'top')}

        <details className="border p-4 rounded-lg space-y-2"><summary className="font-medium cursor-pointer">Coordinates</summary>
          {renderInput('lat', formData.coordinates.lat, (e:any) => handleDeeplyNestedChange(e, 'coordinates', 'lat', true), 'number', 'coords', {step: "any"})}
          {renderInput('lng', formData.coordinates.lng, (e:any) => handleDeeplyNestedChange(e, 'coordinates', 'lng', true), 'number', 'coords', {step: "any"})}
        </details>

        <details className="border p-4 rounded-lg space-y-2"><summary className="font-medium cursor-pointer">Basic Info</summary>
          {renderInput('opening_hours', formData.basic_info.opening_hours, (e:any) => handleNestedChange(e, 'basic_info'), 'text', 'basic')}
          {renderInput('best_time_to_visit', formData.basic_info.best_time_to_visit, (e:any) => handleNestedChange(e, 'basic_info'), 'text', 'basic')}
          {renderInput('local', formData.basic_info.entry_fee.local, (e:any) => handleDeeplyNestedChange(e, 'basic_info', 'entry_fee'), 'text', 'basic-fee')}
          {renderInput('foreigner', formData.basic_info.entry_fee.foreigner, (e:any) => handleDeeplyNestedChange(e, 'basic_info', 'entry_fee'), 'text', 'basic-fee')}
        </details>

        <details className="border p-4 rounded-lg space-y-2"><summary className="font-medium cursor-pointer">Access & Transport</summary>
          {renderInput('nearest_airport', formData.access_transport.nearest_airport, (e:any) => handleNestedChange(e, 'access_transport'))}
          {renderTextarea('public_transport_guide', formData.access_transport.public_transport_guide, (e:any) => handleNestedChange(e, 'access_transport'))}
          {renderInput('taxi_fare_estimate', formData.access_transport.taxi_fare_estimate, (e:any) => handleNestedChange(e, 'access_transport'))}
          {renderInput('last_mile_access', formData.access_transport.last_mile_access, (e:any) => handleNestedChange(e, 'access_transport'))}
          {renderInput('travel_time_from_center', formData.access_transport.travel_time_from_center, (e:any) => handleNestedChange(e, 'access_transport'))}
        </details>

        <details className="border p-4 rounded-lg space-y-2"><summary className="font-medium cursor-pointer">Safety & Risks</summary>
          {renderInput('safety_score', formData.safety_risks.safety_score, (e:any) => handleNestedChange(e, 'safety_risks'), 'number', 'safety', {min: 0, max: 10})}
          {renderSelect('pickpocket_risk', formData.safety_risks.pickpocket_risk, (e:any) => handleNestedChange(e, 'safety_risks'), ['Low', 'Medium', 'High'])}
          {renderTextarea('common_scams', formData.safety_risks.common_scams.join('\n'), (e:any) => handleArrayChange(e, 'safety_risks', 'common_scams'), 'safety', {placeholder: "One scam per line"})}
          {renderTextarea('emergency_contacts', JSON.stringify(formData.safety_risks.emergency_contacts, null, 2), (e:any) => handleJsonArrayChange(e, 'safety_risks', 'emergency_contacts'), 'safety', {placeholder: 'Enter as JSON array: [{"name": "Police", "number": "100"}]'})}
        </details>
        
        <details className="border p-4 rounded-lg space-y-2"><summary className="font-medium cursor-pointer">Local Insights</summary>
          {renderTextarea('cultural_etiquette', formData.local_insights.cultural_etiquette.join('\n'), (e:any) => handleArrayChange(e, 'local_insights', 'cultural_etiquette'), 'insights', {placeholder: "One tip per line"})}
          {renderTextarea('local_phrases', JSON.stringify(formData.local_insights.local_phrases, null, 2), (e:any) => handleJsonArrayChange(e, 'local_insights', 'local_phrases'), 'insights', {placeholder: 'Enter as JSON array: [{"phrase": "...", "translation": "...", "pronunciation": "..."}]'})}
          {renderInput('food_safety_note', formData.local_insights.food_safety_note, (e:any) => handleNestedChange(e, 'local_insights'))}
          {renderTextarea('women_specific_tips', formData.local_insights.women_specific_tips.join('\n'), (e:any) => handleArrayChange(e, 'local_insights', 'women_specific_tips'), 'insights', {placeholder: "One tip per line"})}
        </details>

        <details className="border p-4 rounded-lg space-y-2"><summary className="font-medium cursor-pointer">Costs & Money</summary>
          {renderInput('average_budget', formData.costs_money.average_budget, (e:any) => handleNestedChange(e, 'costs_money'))}
          {renderInput('nearby_atms', formData.costs_money.nearby_atms, (e:any) => handleNestedChange(e, 'costs_money'))}
          {renderInput('haggling_needed', formData.costs_money.haggling_needed, (e:any) => handleNestedChange(e, 'costs_money'))}
          {renderCheckbox('digital_payments_accepted', formData.costs_money.digital_payments_accepted, (e:any) => handleNestedChange(e, 'costs_money'))}
        </details>
        
        <details className="border p-4 rounded-lg space-y-2"><summary className="font-medium cursor-pointer">Amenities</summary>
          {renderSelect('toilets', formData.amenities.toilets, (e:any) => handleNestedChange(e, 'amenities'), ['Clean', 'Available', 'Not Available'])}
          {renderSelect('wifi_signal', formData.amenities.wifi_signal, (e:any) => handleNestedChange(e, 'amenities'), ['Strong', 'Average', 'Weak', 'None'])}
          {renderCheckbox('seating', formData.amenities.seating, (e:any) => handleNestedChange(e, 'amenities'))}
          {renderCheckbox('water_refill_points', formData.amenities.water_refill_points, (e:any) => handleNestedChange(e, 'amenities'))}
        </details>

        <details className="border p-4 rounded-lg space-y-2"><summary className="font-medium cursor-pointer">Food & Stay</summary>
          {renderTextarea('nearby_restaurants', JSON.stringify(formData.food_stay.nearby_restaurants, null, 2), (e:any) => handleJsonArrayChange(e, 'food_stay', 'nearby_restaurants'), 'food', {placeholder: 'Enter as JSON array: [{"name": "...", "rating": 4.5}]'})}
          {renderInput('local_specialty', formData.food_stay.local_specialty, (e:any) => handleNestedChange(e, 'food_stay'))}
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
