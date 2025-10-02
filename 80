import { supabase } from './supabase';

// This file is now deprecated for Gemini calls.
// Keeping it for the Supabase function proxy if it's needed elsewhere.
// New AI calls should use functions from `src/lib/gemini.ts`.

export const runAssistantQueryWithProxy = async (prompt: string): Promise<string> => {
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
