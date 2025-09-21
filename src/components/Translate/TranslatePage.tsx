import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Copy, RotateCcw, Globe, BookOpen, EyeOff, Eye } from 'lucide-react';
import { runAssistantQuery } from '../../lib/ai';
import { phraseCategories } from '../../data/phrases';
import { adultPhraseCategory } from '../../data/advanced-phrases';

const TranslatePage: React.FC = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('hi');
  const [isTranslating, setIsTranslating] = useState(false);
  const [showAdultContent, setShowAdultContent] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
  ];

  const handleTranslate = async () => {
    if (!sourceText.trim() || isTranslating) return;
    setIsTranslating(true);
    setTranslatedText('');

    const sourceLangName = languages.find(l => l.code === sourceLang)?.name || 'English';
    const targetLangName = languages.find(l => l.code === targetLang)?.name || 'Hindi';

    const prompt = `Translate the following text from ${sourceLangName} to ${targetLangName}. Provide only the translated text, with no additional explanations or quotation marks. Text: "${sourceText}"`;
    
    const translation = await runAssistantQuery(prompt);
    setTranslatedText(translation);
    setIsTranslating(false);
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const speakText = (text: string, lang: string) => {
    if ('speechSynthesis' in window && text) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang === 'hi-IN') || voices.find(v => v.lang.startsWith('hi'));
      if (lang === 'hi' && voice) {
        utterance.voice = voice;
      } else {
        utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      }
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const copyToClipboard = (text: string) => {
    if (text) navigator.clipboard.writeText(text);
  };

  const allCategories = [...phraseCategories, ...(showAdultContent ? [adultPhraseCategory] : [])];

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 px-4 pt-6 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <Globe className="w-12 h-12 text-blue-500 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Language Helper</h1>
          <p className="text-gray-600">Translate and learn essential Indian phrases</p>
        </motion.div>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)} className="flex-1 p-2 rounded-lg border-gray-200 focus:outline-none focus:border-blue-500 bg-transparent">
              {languages.map(lang => <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>)}
            </select>
            <motion.button onClick={swapLanguages} className="mx-4 p-2 text-gray-500 hover:text-blue-500" whileHover={{ scale: 1.1, rotate: 180 }} whileTap={{ scale: 0.9 }}>
              <RotateCcw className="w-5 h-5" />
            </motion.button>
            <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className="flex-1 p-2 rounded-lg border-gray-200 focus:outline-none focus:border-blue-500 bg-transparent">
              {languages.map(lang => <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>)}
            </select>
          </div>
          <div className="p-4 border-b border-gray-100">
            <textarea value={sourceText} onChange={(e) => setSourceText(e.target.value)} placeholder="Type text..." className="w-full h-24 resize-none focus:outline-none text-gray-900 placeholder-gray-500" />
            <div className="flex items-center justify-end mt-2">
              <motion.button onClick={handleTranslate} disabled={!sourceText.trim() || isTranslating} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium disabled:opacity-50" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                {isTranslating ? 'Translating...' : 'Translate'}
              </motion.button>
            </div>
          </div>
          {(translatedText || isTranslating) && (
            <div className="p-4 bg-gray-50 min-h-[124px]">
              {isTranslating ? (
                <div className="flex items-center justify-center h-24"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div></div>
              ) : (
                <>
                  <p className="text-gray-900 text-lg">{translatedText}</p>
                  <div className="flex items-center justify-between mt-2">
                    <button onClick={() => speakText(translatedText, targetLang)} className="p-1 text-gray-400 hover:text-blue-500" disabled={!translatedText}><Volume2 className="w-4 h-4" /></button>
                    <button onClick={() => copyToClipboard(translatedText)} className="p-1 text-gray-400 hover:text-blue-500" disabled={!translatedText}><Copy className="w-4 h-4" /></button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        {allCategories.map((category) => (
          <div key={category.title} className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-900">{category.title}</h2>
              </div>
              {category.title === "Slang & Adult (18+)" && (
                <button onClick={() => setShowAdultContent(!showAdultContent)} className="flex items-center space-x-1 text-xs text-gray-500">
                  {showAdultContent ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                  <span>{showAdultContent ? 'Hide' : 'Show'}</span>
                </button>
              )}
            </div>
            <div className="space-y-3">
              {category.phrases.map((phrase, index) => (
                <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{phrase.en}</p>
                      <p className="text-lg text-blue-600 mt-1">{phrase.hi}</p>
                      <p className="text-sm text-gray-500 italic">{phrase.pronunciation}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => speakText(phrase.hi, 'hi')} className="p-2 text-gray-400 hover:text-blue-500"><Volume2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
        {!showAdultContent && (
           <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
             <h3 className="font-semibold text-red-800">Adult Content Filter</h3>
             <p className="text-sm text-red-700 my-2">For educational purposes, a section with common slang and explicit words is available. Viewer discretion is advised.</p>
             <button onClick={() => setShowAdultContent(true)} className="px-3 py-1 bg-red-500 text-white text-sm rounded-md">Show Adult Content</button>
           </div>
        )}
      </div>
    </div>
  );
};

export default TranslatePage;
