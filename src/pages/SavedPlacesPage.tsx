import React from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SavedPlacesPage = () => {
  const navigate = useNavigate();
  return (
    <div className="p-4">
      <button onClick={() => navigate(-1)} className="flex items-center space-x-2 mb-4">
        <ArrowLeft />
        <span>Back</span>
      </button>
      <h1 className="text-2xl font-bold flex items-center space-x-2"><Heart /> <span>Saved Places</span></h1>
      <p className="mt-4 text-gray-600">This is where your saved places will appear. Feature coming soon!</p>
    </div>
  );
};

export default SavedPlacesPage;
