import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve Supabase credentials from Vite environment or localStorage override
const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('rent2go_supabase_url') : null;
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem('rent2go_supabase_key') : null;

  const url = storedUrl || envUrl || '';
  const key = storedKey || envKey || '';

  return { url, key, isConfigured: Boolean(url && key && url.startsWith('http')) };
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, key);
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return supabaseInstance;
};

export const setCustomSupabaseConfig = (url: string, key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('rent2go_supabase_url', url.trim());
    localStorage.setItem('rent2go_supabase_key', key.trim());
    supabaseInstance = null; // reset instance
  }
};

export const AUTHORIZED_ADMIN_EMAIL = 'bearbates512@gmail.com';
export const AUTHORIZED_ADMIN_PASSWORD = 'office@12';
