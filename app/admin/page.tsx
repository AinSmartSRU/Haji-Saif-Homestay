import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AdminDashboard from "@/components/AdminDashboard";
import { isAllowedAdminEmail } from "@/lib/adminAuth";
import {
  createServerSupabaseClient,
  isServerSupabaseConfigured,
} from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isServerSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-[color:var(--color-background)]">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-red-200 bg-red-50 px-6 py-10 text-sm text-red-700">
            Konfigurasi Supabase belum lengkap. Sila tetapkan
            NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY.
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (!isAllowedAdminEmail(user.email)) {
    redirect("/admin/login?error=unauthorized");
  }

  return (
    <div className="min-h-screen bg-[color:var(--color-background)]">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <AdminDashboard adminEmail={user.email ?? ""} />
      </main>
      <Footer />
    </div>
  );
}
