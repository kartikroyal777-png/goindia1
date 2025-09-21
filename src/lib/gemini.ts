import axios from 'axios';

const API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

export const runGeminiQuery = async (prompt: string): Promise<string> => {
  if (!API_KEY || API_KEY.includes('YOUR_API_KEY')) {
    console.error("Gemini API key is not configured.");
    return "Gemini API is not set up. Please add your API key in the .env file.";
  }

  try {
    const response = await axios.post(API_URL, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
       safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    });

    const text = response.data.candidates[0].content.parts[0].text;
    // Clean the response to get raw JSON if applicable
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return cleanedText;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I couldn't connect to the AI assistant right now. Please try again later.";
  }
};
