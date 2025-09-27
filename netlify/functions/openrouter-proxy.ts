import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  if (!OPENROUTER_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'OpenRouter API key is not configured on the server.' }),
    };
  }

  try {
    const requestBody = JSON.parse(event.body || '{}');
    
    const referrer = event.headers['referer'] || '';
    const title = event.headers['x-title'] || 'GoIndia Travel App';

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": referrer,
        "X-Title": title,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: errorData.error?.message || 'Failed to fetch from OpenRouter API' }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'An internal server error occurred.' }),
    };
  }
};

export { handler };
