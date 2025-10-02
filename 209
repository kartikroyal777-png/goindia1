import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// createClient will throw a specific error if the URL or key is missing/invalid.
// We will catch this error gracefully in the AuthContext.
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
