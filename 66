import React from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';

const phrases = [
  { en: "Too expensive, give me local price.", hi: "Bahut mehenga hai, sahi daam lagaiye.", pronunciation: "Bahut mehenga hai, sahi daam lagaiye" },
  { en: "I will check another shop.", hi: "Main doosri dukaan dekh lunga.", pronunciation: "Main doosri dukaan dekh lunga" },
  { en: "Please reduce a little, brother.", hi: "Thoda kam karo bhaiya.", pronunciation: "Thoda kam karo bhaiya" },
  { en: "This is tourist price.", hi: "Ye toh tourist price hai.", pronunciation: "Ye toh tourist price hai" },
];

const CommonPhrases: React.FC = () => {
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in your browser.');
    }
  };

  return (
    <div className="space-y-4">
      {phrases.map((phrase, index) => (
        <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-lg p-4 border shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-gray-900">{phrase.en}</p>
              <p className="text-lg text-blue-600 mt-1">{phrase.hi}</p>
              <p className="text-sm text-gray-500 italic">{phrase.pronunciation}</p>
            </div>
            <button onClick={() => speak(phrase.hi)} className="p-2 text-gray-400 hover:text-blue-500">
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CommonPhrases;
