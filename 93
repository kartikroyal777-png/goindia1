import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center space-x-4">
        <Link to="/profile" className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Privacy Policy</h1>
      </div>
      <div className="p-6 space-y-6 text-gray-700 leading-relaxed">
        <p>We respect your privacy and keep your data secure.</p>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-gray-800">Data We Collect</h3>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>Basic account details (name, email).</li>
              <li>Location (only when you allow, for better recommendations).</li>
              <li>Usage data (to improve app performance).</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">How We Use Data</h3>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>Personalize travel recommendations.</li>
              <li>Show nearby attractions, guides, and services.</li>
              <li>Improve app functionality and user experience.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Data Sharing</h3>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>We never sell your personal data.</li>
              <li>We may share limited info with trusted partners (e.g., map or booking services) to serve you better.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Your Control</h3>
            <p>You can delete your account and personal data anytime from settings.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Security</h3>
            <p>We use modern encryption and follow strict security practices to protect your information.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
