import { NextResponse } from "next/server";
import { isAllowedAdminEmail } from "@/lib/adminAuth";
import {
  createServerSupabaseClient,
  isServerSupabaseConfigured,
} from "@/lib/supabaseServer";

export async function GET() {
  if (!isServerSupabaseConfigured) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi." },
      { status: 500 },
    );
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Tidak dibenarkan." }, { status: 401 });
  }

  if (!isAllowedAdminEmail(user.email)) {
    return NextResponse.json(
      { error: "Akaun ini tidak mempunyai akses admin." },
      { status: 403 },
    );
  }

  return NextResponse.json({
    email: user.email,
    ok: true,
  });
}
