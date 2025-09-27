const PROXY_URL = "/.netlify/functions/openrouter-proxy";

const handleApiError = (error: any, apiName: string): string => {
  console.error(`Error calling ${apiName} API via proxy:`, error);
  const errorMessage = error.message || 'An unknown error occurred.';
  
  if (errorMessage.includes('API key is not configured')) {
    return `The backend proxy is missing the API key. Please ensure OPENROUTER_API_KEY is set in your Netlify deployment settings.`;
  }
  
  return `Sorry, an unexpected error occurred with the ${apiName} assistant. Please try again later. (Details: ${errorMessage})`;
};

const cleanJsonString = (rawText: string): string => {
  let cleanedText = rawText.trim();
  
  const jsonMatch = cleanedText.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch && jsonMatch[1]) {
    cleanedText = jsonMatch[1];
  }

  const firstBracket = cleanedText.indexOf('{');
  const firstSquareBracket = cleanedText.indexOf('[');
  let start = -1;

  if (firstBracket === -1 && firstSquareBracket === -1) return cleanedText;
  if (firstBracket === -1) start = firstSquareBracket;
  else if (firstSquareBracket === -1) start = firstBracket;
  else start = Math.min(firstBracket, firstSquareBracket);

  const lastBracket = cleanedText.lastIndexOf('}');
  const lastSquareBracket = cleanedText.lastIndexOf(']');
  let end = Math.max(lastBracket, lastSquareBracket);

  if (start === -1 || end === -1) return cleanedText;

  return cleanedText.substring(start, end + 1);
};

const runOpenRouterQuery = async (messages: any[]): Promise<string> => {
  try {
    const response = await fetch(PROXY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Title": "GoIndia Travel App",
      },
      body: JSON.stringify({
        "model": "qwen/qwen2.5-vl-72b-instruct:free",
        "messages": messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || `Proxy request failed with status: ${response.status}`);
    }

    const text = data.choices[0].message.content;
    return cleanJsonString(text);

  } catch (error: any) {
    throw new Error(handleApiError(error, "OpenRouter"));
  }
};

export const runGeminiQuery = async (prompt: string): Promise<string> => {
  const messages = [{ "role": "user", "content": prompt }];
  return runOpenRouterQuery(messages);
};

export const runGeminiVisionQuery = async (prompt: string, base64Image: string): Promise<string> => {
  const messages = [
    {
      "role": "user",
      "content": [
        { "type": "text", "text": prompt },
        {
          "type": "image_url",
          "image_url": {
            "url": `data:image/jpeg;base64,${base64Image}`
          }
        }
      ]
    }
  ];
  return runOpenRouterQuery(messages);
};
