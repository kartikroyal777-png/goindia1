import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Compass, Shield, Globe, Heart } from 'lucide-react';
import { runGeminiQuery } from '../../lib/gemini';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi there! 👋 I'm your AI travel assistant for India. I can help you with travel tips, safety advice, cultural insights, and answer any questions about your Indian adventure. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const quickQuestions = [
    { icon: Compass, text: "Best time to visit Rajasthan?", category: "travel" },
    { icon: Shield, text: "Safety tips for solo female travelers in Delhi", category: "safety" },
    { icon: Globe, text: "Basic Hindi phrases to learn for ordering food", category: "language" },
    { icon: Heart, text: "Vegetarian food recommendations in South India", category: "food" }
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    const prompt = `You are a friendly and expert travel assistant for "Go India", an app for foreigners visiting India. A user asks: "${text}". Provide a helpful, concise, and practical answer. Use emojis to make it engaging.`;
    const aiResponse = await runGeminiQuery(prompt);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  };
  
  return (
    <div className="flex flex-col h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">AI Travel Assistant</h1>
            <p className="text-sm text-gray-500">Powered by Gemini</p>
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div className="p-4 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Questions</h3>
          <div className="grid grid-cols-1 gap-2">
            {quickQuestions.map((question, index) => {
              const Icon = question.icon;
              return (
                <motion.button
                  key={index}
                  onClick={() => handleSendMessage(question.text)}
                  className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-orange-300 transition-colors text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5 text-orange-500" />
                  <span className="text-sm text-gray-700">{question.text}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%] ${
              message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-orange-500' 
                  : 'bg-gray-200'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-gray-600" />
                )}
              </div>
              <div className={`px-4 py-3 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-orange-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-gray-600" />
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
            placeholder="Ask me anything about traveling in India..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-orange-500 text-sm"
          />
          <motion.button
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim() || isTyping}
            className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default AssistantPage;
