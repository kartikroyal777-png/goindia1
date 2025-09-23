import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { City, Tehsil, Location } from '../../types';
import { PlusCircle, Edit, Trash2, RefreshCw, ChevronRight, Home } from 'lucide-react';
import CityForm from './CityForm';
import TehsilForm from './TehsilForm';
import LocationForm from './LocationForm';

type View = 'cities' | 'tehsils' | 'locations';
type FormState = {
  type: View | null;
  mode: 'add' | 'edit';
  data: City | Tehsil | Location | null;
};

const ContentManager: React.FC = () => {
  const [view, setView] = useState<View>('cities');
  const [items, setItems] = useState<(City | Tehsil | Location)[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedTehsil, setSelectedTehsil] = useState<Tehsil | null>(null);
  const [formState, setFormState] = useState<FormState>({ type: null, mode: 'add', data: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setFormState({ type: null, mode: 'add', data: null });

    let query;
    if (view === 'locations' && selectedTehsil) {
      query = supabase.from('locations').select('*, images:location_images(*)').eq('tehsil_id', selectedTehsil.id);
    } else if (view === 'tehsils' && selectedCity) {
      query = supabase.from('tehsils').select('*').eq('city_id', selectedCity.id);
    } else {
      query = supabase.from('cities').select('*, city_categories(categories(*))');
    }

    const { data, error: fetchError } = await query.order('name');
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setItems(data as any);
    }
    setLoading(false);
  }, [view, selectedCity, selectedTehsil]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDrillDown = (item: City | Tehsil) => {
    if ('state' in item) { // It's a City
      setSelectedCity(item);
      setView('tehsils');
    } else { // It's a Tehsil
      setSelectedTehsil(item);
      setView('locations');
    }
  };

  const handleBreadcrumbClick = (targetView: View) => {
    if (targetView === 'cities') {
      setSelectedCity(null);
      setSelectedTehsil(null);
    }
    if (targetView === 'tehsils') {
      setSelectedTehsil(null);
    }
    setView(targetView);
  };

  const handleAdd = () => {
    setFormState({ type: view, mode: 'add', data: null });
  };

  const handleEdit = (item: City | Tehsil | Location) => {
    setFormState({ type: view, mode: 'edit', data: item });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      setLoading(true);
      const { error: deleteError } = await supabase.from(view).delete().eq('id', id);
      if (deleteError) {
        setError(deleteError.message);
      } else {
        fetchData();
      }
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (!formState.type) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <Edit className="w-16 h-16 mb-4" />
          <p>Select an item to edit or</p>
          <p>click "Add New" to create one.</p>
        </div>
      );
    }

    const onSave = () => {
      setFormState({ type: null, mode: 'add', data: null });
      fetchData();
    };

    switch (formState.type) {
      case 'cities':
        return <CityForm city={formState.mode === 'edit' ? formState.data as City : null} onSave={onSave} />;
      case 'tehsils':
        if (!selectedCity) return <div className="p-4 text-center text-gray-500">Please select a city first.</div>;
        return <TehsilForm tehsil={formState.mode === 'edit' ? formState.data as Tehsil : null} cityId={selectedCity.id} onSave={onSave} />;
      case 'locations':
        if (!selectedTehsil) return <div className="p-4 text-center text-gray-500">Please select a tehsil first.</div>;
        return <LocationForm location={formState.mode === 'edit' ? formState.data as Location : null} tehsilId={selectedTehsil.id} onSave={onSave} />;
      default:
        return null;
    }
  };
  
  const getItemName = (item: any) => item.name;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 h-[calc(100vh-10rem)]">
      <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Home onClick={() => handleBreadcrumbClick('cities')} className="w-4 h-4 mr-2 cursor-pointer hover:text-orange-500" />
            {selectedCity && <><ChevronRight className="w-4 h-4" /><span onClick={() => handleBreadcrumbClick('tehsils')} className="cursor-pointer hover:text-orange-500">{selectedCity.name}</span></>}
            {selectedTehsil && <><ChevronRight className="w-4 h-4" /><span className="text-gray-700 font-medium">{selectedTehsil.name}</span></>}
          </div>
          <div className="flex space-x-2">
            <button onClick={fetchData} disabled={loading} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
            <button onClick={handleAdd} className="flex items-center space-x-1 px-3 py-1.5 bg-orange-500 text-white rounded-lg shadow-sm hover:bg-orange-600 text-sm">
              <PlusCircle className="w-4 h-4" />
              <span>Add New</span>
            </button>
          </div>
        </div>

        {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : (
          <ul className="space-y-2">
            {items.map(item => (
              <li key={item.id} className={`p-2 rounded-lg cursor-pointer flex justify-between items-center transition-colors ${formState.data?.id === item.id ? 'bg-orange-100' : 'hover:bg-gray-50'}`}>
                <span onClick={() => handleEdit(item)} className="flex-grow font-medium text-gray-800">{getItemName(item)}</span>
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full"><Trash2 className="w-4 h-4" /></button>
                  {view !== 'locations' && <button onClick={() => handleDrillDown(item as City | Tehsil)} className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-100 rounded-full"><ChevronRight className="w-5 h-5" /></button>}
                </div>
              </li>
            ))}
             {items.length === 0 && <p className="text-center text-gray-500 mt-8">No {view} found.</p>}
          </ul>
        )}
      </div>

      <div className="lg:col-span-3 bg-white p-4 rounded-lg shadow-sm overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={formState.type + formState.data?.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderForm()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContentManager;
