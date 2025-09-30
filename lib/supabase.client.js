import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables! Check .env.local");
  throw new Error('Supabase client failed to initialize: Missing URL or Key.');
}

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);