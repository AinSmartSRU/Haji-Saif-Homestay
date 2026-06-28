import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const fallbackUrl = "https://placeholder.supabase.co";
const fallbackAnonKey =
  "placeholder-anon-key-placeholder-anon-key-placeholder-anon-key";

export const serverSupabase = createClient(
  supabaseUrl ?? fallbackUrl,
  supabaseAnonKey ?? fallbackAnonKey,
);

export const isServerSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey,
);

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    supabaseUrl ?? fallbackUrl,
    supabaseAnonKey ?? fallbackAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components may be read-only; auth refresh still works for this request.
          }
        },
      },
    },
  );
}
