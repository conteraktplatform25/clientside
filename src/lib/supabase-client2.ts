// lib/supabaseClient.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export function createBrowserSupabaseClient(accessToken?: string): SupabaseClient {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_* env variables');
  }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    realtime: { params: { eventsPerSecond: 10 } },
    global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
  });

  return supabase;
}
