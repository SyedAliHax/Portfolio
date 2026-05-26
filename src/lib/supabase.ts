import { createClient } from '@supabase/supabase-js';

/*
Supabase SQL to create table:

CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
*/

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

// If supabase client is used in the frontend directly or we communicate via express API route.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
