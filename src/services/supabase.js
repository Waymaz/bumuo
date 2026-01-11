import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Auto-refresh tokens before they expire
    autoRefreshToken: true,
    // Persist session in localStorage
    persistSession: true,
    // Detect session from URL (for OAuth callbacks)
    detectSessionInUrl: true,
    // Storage key for session
    storageKey: 'bumuo-auth',
    // Flow type for OAuth
    flowType: 'pkce',
  },
  // Real-time options
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  // Global options
  global: {
    headers: {
      'x-application-name': 'bumuo',
    },
  },
})
