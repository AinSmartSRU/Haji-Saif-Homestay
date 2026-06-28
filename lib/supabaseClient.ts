import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Fallback values keep the app build-safe while still allowing the UI
// to show a clear configuration error until real public keys are provided.
const fallbackUrl = "https://placeholder.supabase.co";
const fallbackAnonKey =
  "placeholder-anon-key-placeholder-anon-key-placeholder-anon-key";

let browserSupabase: SupabaseClient | null = null;

export function createBrowserSupabaseClient() {
  if (!browserSupabase) {
    browserSupabase = createBrowserClient(
      supabaseUrl ?? fallbackUrl,
      supabaseAnonKey ?? fallbackAnonKey,
    );
  }

  return browserSupabase;
}

export const supabase = createBrowserSupabaseClient();
