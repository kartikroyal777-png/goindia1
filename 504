import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

const dos = [
  "Start bargaining at 50% of quoted price",
  "Stay polite but firm",
  "Walk away if price doesn’t drop to fair range",
  "Research fair prices before bargaining",
  "Use local phrases to build rapport",
];

const donts = [
  "Don’t show excitement for the item",
  "Don’t argue aggressively",
  "Don’t bargain in fixed-price government shops",
  "Don’t accept first quoted price",
  "Don’t carry large cash amounts openly",
];

const DosAndDonts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl p-4 border shadow-sm">
        <h3 className="font-semibold text-lg text-green-600 flex items-center space-x-2 mb-3">
          <CheckCircle2 />
          <span>Do's</span>
        </h3>
        <ul className="space-y-2">
          {dos.map((item, i) => (
            <li key={i} className="flex items-start space-x-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl p-4 border shadow-sm">
        <h3 className="font-semibold text-lg text-red-600 flex items-center space-x-2 mb-3">
          <XCircle />
          <span>Don'ts</span>
        </h3>
        <ul className="space-y-2">
          {donts.map((item, i) => (
            <li key={i} className="flex items-start space-x-2 text-sm">
              <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default DosAndDonts;
