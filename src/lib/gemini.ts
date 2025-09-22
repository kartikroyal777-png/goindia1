import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, BlockReason } from "@google/generative-ai";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;

if (!GOOGLE_API_KEY || GOOGLE_API_KEY.includes('YOUR_API_KEY') || GOOGLE_API_KEY.length < 30) {
  // This is a front-end check. The real error will come from the API call.
  // We will throw a more user-friendly error in the calling components.
  console.error("VITE_GOOGLE_GEMINI_API_KEY is not configured correctly in .env file.");
}

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

const generationConfig = {
  temperature: 0.7,
  topK: 1,
  topP: 1,
  maxOutputTokens: 8192,
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

const handleApiError = (error: any, apiName: string): string => {
  console.error(`Error calling ${apiName} API:`, error);
  if (error.message.includes('API key not valid')) {
    return `The provided Google Gemini API key is not valid. Please check it in your .env file and ensure the 'Generative Language API' is enabled in your Google Cloud project.`;
  }
  if (error.message.includes('[400]')) {
    return `The request was malformed. This may be due to an invalid model name or incorrect parameters in the code.`;
  }
  if (error.message.includes('permission')) {
     return `API key does not have permission to access the model. Please check your Google Cloud project settings.`;
  }
  return `Sorry, an unexpected error occurred with the ${apiName} assistant. Please try again later.`;
};

const cleanJsonString = (rawText: string): string => {
  // Find the start and end of the JSON object/array
  const firstBracket = rawText.indexOf('{');
  const firstSquareBracket = rawText.indexOf('[');
  let start = -1;

  if (firstBracket === -1 && firstSquareBracket === -1) return rawText;
  if (firstBracket === -1) start = firstSquareBracket;
  else if (firstSquareBracket === -1) start = firstBracket;
  else start = Math.min(firstBracket, firstSquareBracket);

  const lastBracket = rawText.lastIndexOf('}');
  const lastSquareBracket = rawText.lastIndexOf(']');
  let end = Math.max(lastBracket, lastSquareBracket);

  if (start === -1 || end === -1) return rawText;

  return rawText.substring(start, end + 1);
}

export const runGeminiQuery = async (prompt: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest", safetySettings, generationConfig });
    const result = await model.generateContent(prompt);
    const response = result.response;

    if (response.promptFeedback?.blockReason) {
      throw new Error(`Your request was blocked for safety reasons: ${response.promptFeedback.blockReason}. Please rephrase.`);
    }
    
    const text = response.text();
    return cleanJsonString(text);
  } catch (error: any) {
    throw new Error(handleApiError(error, "Google Gemini"));
  }
};

export const runGeminiVisionQuery = async (prompt: string, base64Image: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest", safetySettings, generationConfig });
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: "image/jpeg",
      },
    };
    const result = await model.generateContent([prompt, imagePart]);
    const response = result.response;

    if (response.promptFeedback?.blockReason) {
      throw new Error(`Your request was blocked for safety reasons: ${response.promptFeedback.blockReason}. Please rephrase.`);
    }

    const text = response.text();
    return cleanJsonString(text);
  } catch (error: any) {
    throw new Error(handleApiError(error, "Google Gemini Vision"));
  }
};
