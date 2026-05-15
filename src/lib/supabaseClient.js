import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Fix for "Multiple GoTrueClient instances detected" warning during Vite HMR
if (!window._supabaseInstance) {
  window._supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
}
export const supabase = window._supabaseInstance

// Expose for debugging in console
if (typeof window !== 'undefined') {
  window.supabase = supabase
}
