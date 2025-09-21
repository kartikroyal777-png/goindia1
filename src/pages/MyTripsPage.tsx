import React from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyTripsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="p-4">
      <button onClick={() => navigate(-1)} className="flex items-center space-x-2 mb-4">
        <ArrowLeft />
        <span>Back</span>
      </button>
      <h1 className="text-2xl font-bold flex items-center space-x-2"><MapPin /> <span>My Trips</span></h1>
      <p className="mt-4 text-gray-600">This is where your saved trips will appear. Feature coming soon!</p>
    </div>
  );
};

export default MyTripsPage;
