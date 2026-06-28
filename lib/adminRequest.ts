import { NextResponse } from "next/server";
import { isAllowedAdminEmail } from "@/lib/adminAuth";
import {
  createServerSupabaseClient,
  isServerSupabaseConfigured,
} from "@/lib/supabaseServer";

export async function requireAdminRequest() {
  if (!isServerSupabaseConfigured) {
    return {
      error: NextResponse.json(
        { error: "Supabase belum dikonfigurasi." },
        { status: 500 },
      ),
      supabase: null,
      user: null,
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      error: NextResponse.json({ error: "Sila login dahulu." }, { status: 401 }),
      supabase: null,
      user: null,
    };
  }

  if (!isAllowedAdminEmail(user.email)) {
    return {
      error: NextResponse.json(
        { error: "Akaun ini tidak mempunyai akses admin." },
        { status: 403 },
      ),
      supabase: null,
      user,
    };
  }

  return {
    error: null,
    supabase,
    user,
  };
}
