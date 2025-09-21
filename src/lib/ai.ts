import axios, { AxiosError } from 'axios';
import { supabase } from './supabase';

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;
const GOOGLE_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GOOGLE_API_KEY}`;

const handleApiError = (error: unknown, apiName: string): string => {
  console.error(`Error calling ${apiName} API:`, error);

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error: { message: string, status: string } }>;
    if (axiosError.response?.status === 400 && axiosError.response?.data?.error?.status === 'INVALID_ARGUMENT') {
      return `The provided ${apiName} API key is not valid. Please update it in your .env file.`;
    }
  }
  
  return `Sorry, I couldn't connect to the ${apiName} assistant right now. Please try again later.`;
};

export const runTripPlannerQuery = async (prompt: string): Promise<string> => {
  if (!GOOGLE_API_KEY || GOOGLE_API_KEY.includes('YOUR_API_KEY')) {
    return Promise.reject("Google Gemini API key is not configured.");
  }

  try {
    const response = await axios.post(GOOGLE_API_URL, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, topK: 1, topP: 1, maxOutputTokens: 8192 },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    });
    const text = response.data.candidates[0].content.parts[0].text;
    return text.replace(/```json/g, '').replace(/```/g, '').trim();
  } catch (error) {
    const errorMessage = handleApiError(error, "Google Gemini");
    return Promise.reject(errorMessage);
  }
};

export const runFoodScorerQuery = async (prompt: string): Promise<string> => {
  if (!GOOGLE_API_KEY || GOOGLE_API_KEY.includes('YOUR_API_KEY')) {
    return Promise.reject("Google Gemini API key is not configured.");
  }

  try {
    const response = await axios.post(GOOGLE_API_URL, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.5, maxOutputTokens: 2048 },
    });
    const text = response.data.candidates[0].content.parts[0].text;
    return text.replace(/```json/g, '').replace(/```/g, '').trim();
  } catch (error) {
    const errorMessage = handleApiError(error, "Google Gemini");
    return Promise.reject(errorMessage);
  }
};

export const runAssistantQuery = async (prompt: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('ai-proxy', {
      body: {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      },
    });

    if (error) {
      throw error;
    }
    
    if (data.error) {
      throw new Error(data.error);
    }

    return data.choices[0].message.content.trim();
  } catch (err) {
    console.error('Error invoking Supabase function:', err);
    return 'Sorry, there was an issue connecting to the AI assistant.';
  }
};
