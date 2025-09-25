import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Car, Loader2, AlertTriangle, Sparkles, Shield, MapPin, Search } from 'lucide-react';
import { runGeminiQuery } from '../../lib/gemini';

interface FareResult {
  city: string;
  from: string;
  to: string;
  distance_km: number;
  travel_time: string;
  fare_estimate_inr: string;
  fare_estimate_usd: string;
  scam_alert: string;
  tips: string;
  alternatives: string[];
}

const FareCalculatorPage: React.FC = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [city, setCity] = useState('Delhi');
  const [result, setResult] = useState<FareResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculate = async () => {
    if (!from || !to || !city) {
      setError('Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    const prompt = `
      You are a backend assistant for an Indian travel app. Your task is to calculate approximate auto/taxi fares.
      User wants to travel from "${from}" to "${to}" in "${city}".
      
      Your response must be a clean JSON object with the following structure:
      {
        "city": "${city}",
        "from": "${from}",
        "to": "${to}",
        "distance_km": number,
        "travel_time": "string",
        "fare_estimate_inr": "₹___ – ₹___",
        "fare_estimate_usd": "$__ – $__",
        "scam_alert": "A short, relevant scam alert for this route or city.",
        "tips": "A helpful, short safety tip for foreigners.",
        "alternatives": ["Ola: ₹___", "Uber: ₹___"]
      }

      Use average Indian rates (₹12/km for auto, ₹20/km for taxi) if a specific city rule isn't known.
      Base your distance and time estimates on typical traffic conditions.
      Keep all text foreigner-friendly. Return ONLY the JSON object.
    `;

    try {
      const response = await runGeminiQuery(prompt);
      const parsedResult: FareResult = JSON.parse(response);
      setResult(parsedResult);
    } catch (e: any) {
      setError(e.message || "Failed to calculate fare. The AI model might be busy. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = !from.trim() || !to.trim() || !city.trim() || isLoading;

  return (
    <div className="pb-32 bg-gray-50 min-h-screen">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-20 flex items-center space-x-4">
        <Link to="/tools" className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Fare Calculator</h1>
      </div>

      <div className="p-4 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border p-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">From</label>
              <input type="text" value={from} onChange={e => setFrom(e.target.value)} placeholder="e.g., Delhi Airport" className="w-full mt-1 p-3 border rounded-lg bg-gray-50" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">To</label>
              <input type="text" value={to} onChange={e => setTo(e.target.value)} placeholder="e.g., Connaught Place" className="w-full mt-1 p-3 border rounded-lg bg-gray-50" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">City</label>
              <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="e.g., Delhi" className="w-full mt-1 p-3 border rounded-lg bg-gray-50" />
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-lg flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold">Calculation Error</h4>
                <p className="text-sm">{error}</p>
              </div>
            </motion.div>
          )}

          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm border p-4">
                <h3 className="font-bold text-lg mb-3">Fare Estimate 💸</h3>
                <p className="text-3xl font-bold text-gray-800">{result.fare_estimate_inr}</p>
                <p className="text-gray-600">(≈ {result.fare_estimate_usd} USD)</p>
                <div className="mt-3 text-sm text-gray-500 flex items-center space-x-4">
                  <span>~{result.distance_km} km</span>
                  <span>~{result.travel_time}</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-4">
                <h3 className="font-bold text-lg mb-2 flex items-center space-x-2"><AlertTriangle className="w-5 h-5 text-red-500" /><span>Scam Alert</span></h3>
                <p className="text-sm text-gray-700">{result.scam_alert}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-4">
                <h3 className="font-bold text-lg mb-2 flex items-center space-x-2"><Shield className="w-5 h-5 text-green-500" /><span>Safety Tip</span></h3>
                <p className="text-sm text-gray-700">{result.tips}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-4">
                <h3 className="font-bold text-lg mb-2 flex items-center space-x-2"><Car className="w-5 h-5 text-blue-500" /><span>Alternatives</span></h3>
                <div className="flex space-x-4 text-sm text-gray-700">
                  {result.alternatives.map((alt, i) => <span key={i}>{alt}</span>)}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white to-transparent z-10"
      >
        <motion.button
          onClick={handleCalculate}
          disabled={isButtonDisabled}
          className="w-full max-w-md mx-auto py-4 bg-orange-500 text-white font-bold rounded-2xl shadow-2xl shadow-orange-300 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg transition-opacity"
          whileHover={{ scale: isButtonDisabled ? 1 : 1.02 }}
          whileTap={{ scale: isButtonDisabled ? 1 : 0.98 }}
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
          <span>{isLoading ? 'Calculating...' : 'Calculate Fare'}</span>
        </motion.button>
      </div>
    </div>
  );
};

export default FareCalculatorPage;
