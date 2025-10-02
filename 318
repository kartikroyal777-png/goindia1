import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Store, RefreshCw, Check, X, Trophy } from 'lucide-react';

const scenarios = {
  easy: {
    item: 'T-shirt',
    fairPrice: { min: 150, max: 300 },
    initialQuote: 600,
    dialogue: [
      {
        speaker: 'shopkeeper',
        text: 'This T-shirt is ₹600, very good quality!',
        options: [
          { text: 'Offer ₹200', next: 1, points: 0 },
          { text: 'Say "Too expensive"', next: 2, points: 0 },
          { text: 'Accept ₹600', next: 'end_bad', points: -5 },
        ],
      },
      {
        speaker: 'shopkeeper',
        text: 'Okay, special price for you, ₹400.',
        options: [
          { text: 'Offer ₹250', next: 'end_good', points: 10 },
          { text: 'Walk away', next: 'end_walk', points: -10 },
          { text: 'Accept ₹400', next: 'end_ok', points: 5 },
        ],
      },
      {
        speaker: 'shopkeeper',
        text: 'Alright, ₹450 for you.',
        options: [
          { text: 'Offer ₹250', next: 'end_good', points: 10 },
          { text: 'Accept ₹450', next: 'end_ok', points: 5 },
        ],
      },
    ],
    endings: {
      end_good: { text: 'Great job! You settled for ₹250, which is in the fair price range (₹150-₹300).', success: true },
      end_ok: { text: 'You paid a bit more than the fair price, but not bad for a beginner!', success: true },
      end_bad: { text: 'You overpaid! The fair price is around ₹150-₹300.', success: false },
      end_walk: { text: 'You walked away. Sometimes that\'s the right move, but you could have gotten a deal!', success: false },
    },
  },
  medium: {
    item: 'Taxi Ride (5km)',
    fairPrice: { min: 150, max: 200 },
    initialQuote: 350,
    dialogue: [
      {
        speaker: 'shopkeeper',
        text: 'Airport to hotel, ₹350.',
        options: [
          { text: 'Offer ₹150', next: 1, points: 0 },
          { text: 'Say "Thoda kam karo bhaiya"', next: 2, points: 5 },
          { text: 'Accept ₹350', next: 'end_bad', points: -5 },
        ],
      },
      {
        speaker: 'shopkeeper',
        text: 'No way, sir. ₹300 minimum. Petrol price is high.',
        options: [
          { text: 'Offer ₹180', next: 3, points: 0 },
          { text: 'Accept ₹300', next: 'end_ok', points: 5 },
        ],
      },
      {
        speaker: 'shopkeeper',
        text: 'Okay, for you, ₹280.',
        options: [
          { text: 'Offer ₹180', next: 3, points: 0 },
          { text: 'Accept ₹280', next: 'end_ok', points: 5 },
        ],
      },
      {
        speaker: 'shopkeeper',
        text: 'Final price ₹250. My last offer.',
        options: [
            { text: 'Offer ₹200', next: 'end_good', points: 10 },
            { text: 'Accept ₹250', next: 'end_ok', points: 5 },
        ]
      }
    ],
    endings: {
      end_good: { text: 'Excellent! You got a fair price of ₹200 for the ride.', success: true },
      end_ok: { text: 'You paid a little extra, but you reached your destination. Good effort!', success: true },
      end_bad: { text: 'You overpaid significantly. Always negotiate taxi fares!', success: false },
    },
  },
  hard: {
    item: 'Handicraft Bundle',
    fairPrice: { min: 500, max: 700 },
    initialQuote: 1200,
    dialogue: [
      {
        speaker: 'shopkeeper',
        text: 'This handicraft bundle is ₹1200, very special!',
        options: [
          { text: 'Offer ₹400', next: 1, points: 0 },
          { text: 'Say "Ye toh tourist price hai"', next: 2, points: 5 },
          { text: 'Accept ₹1200', next: 'end_bad', points: -5 },
        ],
      },
      {
        speaker: 'shopkeeper',
        text: 'You’re joking! This is pure art. ₹1000.',
        options: [
          { text: 'Offer ₹600', next: 3, points: 0 },
          { text: 'Walk away', next: 'end_walk', points: -10 },
        ],
      },
      {
        speaker: 'shopkeeper',
        text: 'Okay, you know prices. ₹900 for you.',
        options: [
          { text: 'Offer ₹600', next: 3, points: 0 },
          { text: 'Accept ₹900', next: 'end_ok', points: 5 },
        ],
      },
      {
        speaker: 'shopkeeper',
        text: 'My final price is ₹800. I am not making any profit.',
        options: [
            { text: 'Offer ₹700', next: 'end_good', points: 10 },
            { text: 'Accept ₹800', next: 'end_ok', points: 5 },
        ]
      }
    ],
    endings: {
      end_good: { text: 'Master haggler! You got the bundle for ₹700, a great price.', success: true },
      end_ok: { text: 'You paid a premium, but it\'s a beautiful souvenir. Well done.', success: true },
      end_bad: { text: 'You accepted the first price! A tough lesson in Indian markets.', success: false },
      end_walk: { text: 'Walking away is a powerful move. You might have been called back!', success: false },
    },
  },
  expert: {
    item: 'Pashmina Shawl',
    fairPrice: { min: 2500, max: 4000 },
    initialQuote: 8000,
    dialogue: [
      {
        speaker: 'shopkeeper',
        text: 'Pure Pashmina, sir. Very rare. Only ₹8000.',
        options: [
          { text: 'Offer ₹2000', next: 1, points: 0 },
          { text: 'Ask about quality', next: 2, points: 0 },
          { text: 'Accept ₹8000', next: 'end_bad', points: -15 },
        ],
      },
      {
        speaker: 'shopkeeper',
        text: '₹2000? Sir, this is not a normal shawl. My cost is more than that. Let\'s do ₹6500.',
        options: [
          { text: 'Offer ₹3000 and start to walk away', next: 3, points: 5 },
          { text: 'Accept ₹6500', next: 'end_ok', points: -5 },
        ],
      },
      {
        speaker: 'shopkeeper',
        text: 'It is 100% genuine, passes the ring test. See? For you, ₹7000.',
        options: [
          { text: 'Offer ₹3000', next: 1, points: 0 },
          { text: 'Say "I saw it cheaper elsewhere"', next: 3, points: 0 },
        ],
      },
      {
        speaker: 'shopkeeper',
        text: 'Okay, okay, wait! You are a tough customer. What is your final price?',
        options: [
            { text: 'Say "₹3500 is my last offer"', next: 'end_good', points: 15 },
            { text: 'Offer ₹4500', next: 'end_ok', points: 5 },
        ]
      }
    ],
    endings: {
      end_good: { text: 'Incredible! You negotiated like a pro and got it for ₹3500.', success: true },
      end_ok: { text: 'You got a discount, but a local might have paid less. Still a good buy!', success: true },
      end_bad: { text: 'Oh no! You paid a very high tourist price. Pashmina is tricky!', success: false },
    },
  }
};

type DialogueStep = {
  speaker: 'user' | 'shopkeeper';
  text: string;
};

const Simulator: React.FC = () => {
  const [level, setLevel] = useState<keyof typeof scenarios>('easy');
  const [currentStep, setCurrentStep] = useState(0);
  const [dialogue, setDialogue] = useState<DialogueStep[]>([]);
  const [score, setScore] = useState(0);
  const [isGameover, setIsGameover] = useState(false);
  const [finalMessage, setFinalMessage] = useState({ text: '', success: false });
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scenario = scenarios[level];

  useEffect(() => {
    startNewGame();
  }, [level]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dialogue, isGameover]);

  const startNewGame = () => {
    const currentScenario = scenarios[level];
    setCurrentStep(0);
    setDialogue([{ speaker: 'shopkeeper', text: currentScenario.dialogue[0].text }]);
    setIsGameover(false);
    setFinalMessage({ text: '', success: false });
  };

  const handleOptionClick = (option: any) => {
    const userResponse: DialogueStep = { speaker: 'user', text: option.text };
    setDialogue(prev => [...prev, userResponse]);
    setScore(prev => prev + option.points);

    setTimeout(() => {
      if (typeof option.next === 'string' && option.next.startsWith('end_')) {
        const ending = scenario.endings[option.next as keyof typeof scenario.endings];
        setFinalMessage(ending);
        setIsGameover(true);
      } else {
        const nextStepIndex = option.next;
        const nextDialogue = scenario.dialogue[nextStepIndex];
        const shopkeeperResponse: DialogueStep = { speaker: 'shopkeeper', text: nextDialogue.text };
        setDialogue(prev => [...prev, shopkeeperResponse]);
        setCurrentStep(nextStepIndex);
      }
    }, 1000);
  };

  const currentOptions = !isGameover ? scenario.dialogue[currentStep].options : [];

  return (
    <div className="bg-white rounded-xl shadow-lg border p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-lg">Bargaining Simulator</h3>
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <span className="text-sm font-semibold text-gray-700">{score}</span>
        </div>
      </div>
      
      <div className="mb-4 flex items-center justify-center space-x-1 p-1 bg-gray-100 rounded-full">
        {(Object.keys(scenarios) as Array<keyof typeof scenarios>).map(lvl => (
            <button key={lvl} onClick={() => setLevel(lvl)} className={`w-full px-3 py-1.5 text-sm font-medium rounded-full capitalize transition-colors ${level === lvl ? 'bg-rose-500 text-white shadow' : 'text-gray-600 hover:bg-white'}`}>
                {lvl}
            </button>
        ))}
      </div>

      <div className="h-96 bg-gray-50 rounded-lg p-4 overflow-y-auto flex flex-col space-y-4 relative">
        <AnimatePresence>
          {dialogue.map((msg, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start space-x-2 max-w-[85%] ${msg.speaker === 'user' ? 'self-end flex-row-reverse space-x-reverse' : 'self-start'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.speaker === 'user' ? 'bg-orange-500' : 'bg-gray-200'}`}>
                {msg.speaker === 'user' ? <User className="w-4 h-4 text-white" /> : <Store className="w-4 h-4 text-gray-600" />}
              </div>
              <div className={`px-4 py-3 rounded-2xl shadow-sm ${msg.speaker === 'user' ? 'bg-orange-500 text-white rounded-br-none' : 'bg-white text-gray-900 rounded-bl-none'}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            </motion.div>
          ))}
          {isGameover && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className={`p-4 rounded-lg text-center ${finalMessage.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${finalMessage.success ? 'bg-green-200' : 'bg-red-200'}`}>
                {finalMessage.success ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </div>
              <p className="font-medium">{finalMessage.text}</p>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
        {!isGameover ? currentOptions.map((opt, i) => (
          <motion.button
            key={i}
            onClick={() => handleOptionClick(opt)}
            className="w-full p-3 bg-white border-2 border-orange-500 text-orange-500 rounded-lg font-medium text-sm text-center hover:bg-orange-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {opt.text}
          </motion.button>
        )) : (
          <motion.button onClick={startNewGame} className="w-full md:col-span-2 p-3 bg-orange-500 text-white rounded-lg font-medium text-sm text-center flex items-center justify-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Play Again</span>
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default Simulator;
