import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center space-x-4">
        <Link to="/profile" className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Terms of Use</h1>
      </div>
      <div className="p-6 space-y-6 text-gray-700 leading-relaxed">
        <p>By using GoIndia, you agree to the following:</p>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-gray-800">Information Accuracy</h3>
            <p>We provide travel data from APIs, local authorities, and user input. While we strive for accuracy, conditions (weather, safety, timings) may change without notice.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Personal Use Only</h3>
            <p>The app is intended for personal, non-commercial use by travelers.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Third-Party Services</h3>
            <p>GoIndia integrates with third-party providers (maps, weather, booking, payments). We are not responsible for their policies or service availability.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Liability Disclaimer</h3>
            <p>GoIndia is a guide. Users are responsible for their own safety and decisions while traveling.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Changes to Terms</h3>
            <p>Terms may be updated periodically, and continued use of the app means acceptance of changes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
