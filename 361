import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Phrase } from '../../types';
import { PlusCircle, Edit, Trash2, RefreshCw } from 'lucide-react';
import PhraseForm from './PhraseForm';

const DictionaryManager: React.FC = () => {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [editingPhrase, setEditingPhrase] = useState<Phrase | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhrases = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase.from('phrases').select('*').order('category').order('created_at');
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setPhrases(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPhrases();
  }, [fetchPhrases]);

  const handleAdd = () => {
    setEditingPhrase(null);
    setIsFormOpen(true);
  };

  const handleEdit = (phrase: Phrase) => {
    setEditingPhrase(phrase);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this phrase?')) {
      const { error: deleteError } = await supabase.from('phrases').delete().eq('id', id);
      if (deleteError) {
        setError(deleteError.message);
      } else {
        fetchPhrases();
      }
    }
  };

  const handleSave = () => {
    setIsFormOpen(false);
    setEditingPhrase(null);
    fetchPhrases();
  };

  const groupedPhrases = phrases.reduce((acc, phrase) => {
    const category = phrase.is_adult ? 'Slang & Adult (18+)' : phrase.category;
    (acc[category] = acc[category] || []).push(phrase);
    return acc;
  }, {} as Record<string, Phrase[]>);

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-medium text-gray-800">Dictionary Manager</h2>
        <div className="flex space-x-2">
          <button onClick={fetchPhrases} disabled={loading} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"><RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} /></button>
          <button onClick={handleAdd} className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg shadow-sm hover:bg-orange-600">
            <PlusCircle className="w-5 h-5" />
            <span>Add Phrase</span>
          </button>
        </div>
      </div>

      {loading && <p>Loading phrases...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-6">
        {Object.entries(groupedPhrases).map(([category, phrasesInCategory]) => (
          <div key={category}>
            <h3 className="text-lg font-medium text-gray-700 mb-2 border-b pb-1">{category}</h3>
            <div className="space-y-2">
              {phrasesInCategory.map(phrase => (
                <div key={phrase.id} className="bg-white p-3 rounded-lg shadow-sm flex items-center justify-between">
                  <div>
                    <p className="font-medium">{phrase.en} → {phrase.hi}</p>
                    <p className="text-sm text-gray-500">{phrase.pronunciation}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(phrase)} className="p-2 text-gray-500 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(phrase.id)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <PhraseForm
            phrase={editingPhrase}
            onClose={() => setIsFormOpen(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DictionaryManager;
