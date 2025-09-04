import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'demo_key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE || 'demo_service_key';

// For demo mode, we'll use mock data instead of throwing errors
const isDemoMode = supabaseUrl === 'https://demo.supabase.co' || supabaseAnonKey === 'demo_key';

// Browser/client Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client with service role key
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Database table names
export const TABLES = {
  PROFILES: 'profiles',
  TASKS: 'tasks',
  TASK_ACTIVITY: 'task_activity',
  CHECKINS: 'checkins',
  EVENTS: 'events',
  EVENT_RSVPS: 'event_rsvps',
  EXPENSES: 'expenses',
  AUDIENCE: 'audience',
  TEMPLATES: 'templates',
  CAMPAIGNS: 'campaigns',
  DISPATCHES: 'dispatches',
  UNIQUE_LINKS: 'unique_links',
  MEDIA_ASSETS: 'media_assets',
} as const;
