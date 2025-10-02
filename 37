import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const VNICE_API_KEY = Deno.env.get('VNICE_API_KEY')
const API_URL = 'https://api.v-nice.pro/v1/chat/completions'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { model, messages } = await req.json()

    if (!VNICE_API_KEY) {
      return new Response(JSON.stringify({ error: 'API key not configured in serverless function.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${VNICE_API_KEY}`,
      },
      body: JSON.stringify({ model, messages }),
    })

    const data = await response.json()

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
