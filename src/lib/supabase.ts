import { createClient } from '@supabase/supabase-js';


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;


// If supabase client is used in the frontend directly or we communicate via express API route.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
