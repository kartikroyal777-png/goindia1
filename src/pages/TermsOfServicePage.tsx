import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const TermsOfServicePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center space-x-4">
        <motion.button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </motion.button>
        <h1 className="text-xl font-bold text-gray-900">Terms of Service</h1>
      </div>
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-sm border p-6 prose">
            <h2>1. Terms</h2>
            <p>
                By accessing this Application, you are agreeing to be bound by these
                terms of service, all applicable laws and regulations, and agree that you
                are responsible for compliance with any applicable local laws. If you do
                not agree with any of these terms, you are prohibited from using or
                accessing this site. The materials contained in this website are
                protected by applicable copyright and trademark law.
            </p>
            <h2>2. Use License</h2>
            <ol type="a">
                <li>
                    Permission is granted to temporarily download one copy of the materials
                    (information or software) on Go India's application for personal,
                    non-commercial transitory viewing only. This is the grant of a license,
                    not a transfer of title, and under this license you may not:
                    <ol type="i">
                        <li>modify or copy the materials;</li>
                        <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                        <li>attempt to decompile or reverse engineer any software contained on Go India's website;</li>
                        <li>remove any copyright or other proprietary notations from the materials; or</li>
                        <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
                    </ol>
                </li>
            </ol>
            <p>
                [Placeholder for more detailed terms of service content...]
            </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
