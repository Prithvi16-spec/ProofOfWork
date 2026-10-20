import { createClient } from '@supabase/supabase-js';

// A Supabase publishable key is intended for client-side use. Keep Row Level Security
// enabled and never place a service_role/secret key in this file or the browser bundle.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bctporhapokwtixstqwc.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_a6hMijuSs5hIOKo5KFr0Jw_QkOH520k';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});
