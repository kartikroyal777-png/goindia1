import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Zap, X, Info, RefreshCw, FlipHorizontal } from 'lucide-react';
import Lottie from "lottie-react";
import scannerAnimation from '../../assets/scanner-animation.json';
import { runFoodScorerQuery } from '../../lib/ai';

const FoodScorerPage: React.FC = () => {
  const [mode, setMode] = useState<'scanner' | 'analysing' | 'score'>('scanner');
  const [scoreData, setScoreData] = useState<any | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const handleAnalyze = async () => {
    setMode('analysing');
    setScoreData(null);
    
    // In a real app, you'd send the image from webcamRef.current.getScreenshot()
    // For this demo, we'll simulate the flow and call Gemini for the text part.
    
    const mockNutritionData = {
      dish_label: "Masala Dosa",
      calories: 420,
      fat_g: 18,
      sodium_mg: 820,
      sugar_g: 4,
      protein_g: 9,
      detected_method: "pan-fried"
    };

    const prompt = `
      SYSTEM: You are a friendly nutrition advisor. Given a dish name and nutrition estimates, produce a user-facing explanation and tips. Return ONLY valid JSON.
      USER: Dish: "${mockNutritionData.dish_label}", calories: ${mockNutritionData.calories}, fat_g: ${mockNutritionData.fat_g}, sodium_mg: ${mockNutritionData.sodium_mg}, sugar_g: ${mockNutritionData.sugar_g}, detected_method: "${mockNutritionData.detected_method}".
      JSON format: { "explanation": "A short 1-line health summary.", "suggestions": ["A simple, actionable suggestion.", "Another suggestion."] }
    `;

    try {
      const aiResponse = await runFoodScorerQuery(prompt);
      const parsedResponse = JSON.parse(aiResponse);
      
      setScoreData({
        score: 6.2, // This would be calculated by a deterministic backend algorithm
        dish_label: mockNutritionData.dish_label,
        breakdown: {
          calories: { value: mockNutritionData.calories, score: 6 },
          fat: { value: mockNutritionData.fat_g, score: 6 },
          sodium: { value: mockNutritionData.sodium_mg, score: 5 },
          sugar: { value: mockNutritionData.sugar_g, score: 8 },
        },
        explanation: parsedResponse.explanation,
        suggestions: parsedResponse.suggestions
      });
      setMode('score');
    } catch (error) {
      console.error("Failed to get food score analysis:", error);
      setScoreData({ error: "Could not analyze the food. Please try again." });
      setMode('score');
    }
  };

  const ScoreRing = ({ score }: { score: number }) => {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score / 10) * circumference;
    const color = score >= 8 ? '#28A745' : score >= 5 ? '#FFC107' : '#E63946';

    return (
      <div className="relative w-40 h-40">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle className="text-gray-200" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
          <motion.circle
            strokeWidth="10"
            strokeLinecap="round"
            stroke={color}
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            style={{ strokeDasharray: circumference, strokeDashoffset: circumference, transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold" style={{color}}>{score.toFixed(1)}</span>
        </div>
      </div>
    );
  };

  const renderScanner = () => (
    <div className="relative w-full h-full flex flex-col bg-charcoal">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode }}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute top-4 right-4 flex flex-col space-y-4">
        <button onClick={() => setFacingMode(p => p === 'user' ? 'environment' : 'user')} className="p-3 bg-black/30 rounded-full text-white"><FlipHorizontal/></button>
        <button className="p-3 bg-black/30 rounded-full text-white"><Zap/></button>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 pointer-events-none">
        <div className="w-full max-w-sm h-auto">
          <Lottie animationData={scannerAnimation} loop={true} />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center items-center space-x-8 bg-gradient-to-t from-black/70 to-transparent">
        <button className="p-4 bg-white/20 rounded-full"><Upload className="w-6 h-6 text-white" /></button>
        <button onClick={handleAnalyze} className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-black/20">
          <div className="w-16 h-16 bg-primary rounded-full"></div>
        </button>
        <button className="p-4 bg-white/20 rounded-full"><Camera className="w-6 h-6 text-white" /></button>
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-charcoal text-white">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 border-4 border-white/30 border-t-primary rounded-full mb-6"
      />
      <h3 className="text-xl font-bold">Analyzing...</h3>
      <p className="text-white/70">Checking ingredients and cooking style.</p>
    </div>
  );

  const renderScore = () => (
    <div className="w-full h-full bg-light-gray p-4 pt-10 overflow-y-auto">
      <h2 className="text-3xl font-bold text-center mb-4 text-charcoal">{scoreData.dish_label}</h2>
      <motion.div initial={{scale:0.5}} animate={{scale:1}} className="flex justify-center">
        <ScoreRing score={scoreData.score} />
      </motion.div>
      
      <div className="my-6 bg-white p-4 rounded-2xl shadow-sm">
        <h3 className="font-bold mb-3 text-charcoal">Health Breakdown</h3>
        <div className="space-y-3 text-sm">
          {Object.entries(scoreData.breakdown).map(([key, value]: [string, any]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="capitalize text-gray-600">{key}</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-charcoal">{value.value}</span>
                <div className="w-24 h-2 bg-gray-200 rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${100 - (value.score * 10)}%` }}
                    className={`h-2 rounded-full ${value.score > 7 ? 'bg-success' : value.score > 4 ? 'bg-amber' : 'bg-danger'}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl">
        <div className="flex items-start space-x-3">
          <Info className="w-6 h-6 text-primary mt-1 flex-shrink-0"/>
          <div>
            <h4 className="font-semibold text-charcoal">AI Health Note</h4>
            <p className="text-sm text-gray-700">{scoreData.explanation}</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="font-semibold text-charcoal mb-2">Healthier Swaps</h4>
        <ul className="space-y-2">
          {scoreData.suggestions.map((tip: string, index: number) => (
            <li key={index} className="flex items-start space-x-3 text-sm bg-white p-3 rounded-lg shadow-sm">
              <div className="w-4 h-4 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
              <span className="text-gray-700">{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={() => setMode('scanner')} className="w-full mt-6 flex items-center justify-center space-x-2 py-3 bg-primary text-white font-bold rounded-xl shadow-lg">
        <RefreshCw className="w-5 h-5"/>
        <span>Scan Another Dish</span>
      </button>
    </div>
  );

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        {mode === 'scanner' && <motion.div key="scanner" exit={{ opacity: 0 }} className="w-full h-full">{renderScanner()}</motion.div>}
        {mode === 'analysing' && <motion.div key="analysing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">{renderAnalysis()}</motion.div>}
        {mode === 'score' && <motion.div key="score" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full h-full">{renderScore()}</motion.div>}
      </AnimatePresence>
    </div>
  );
};

export default FoodScorerPage;
