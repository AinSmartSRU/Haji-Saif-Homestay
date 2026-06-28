import { Suspense } from "react";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AdminLoginForm from "@/components/AdminLoginForm";
import { isAllowedAdminEmail } from "@/lib/adminAuth";
import {
  createServerSupabaseClient,
  isServerSupabaseConfigured,
} from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (isServerSupabaseConfigured) {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && isAllowedAdminEmail(user.email)) {
      redirect("/admin");
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f8f3ea,_#f3ede0)]">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <section className="rounded-[2.25rem] border border-stone-200/20 bg-[linear-gradient(180deg,_rgba(57,42,28,0.95),_rgba(35,27,19,0.96))] p-8 text-stone-100 shadow-[0_26px_80px_rgba(48,33,21,0.22)] sm:p-10">
            <p className="text-xs font-semibold tracking-[0.24em] text-[color:var(--color-accent)] uppercase">
              Ruang Admin
            </p>
            <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-white">
              Masuk untuk urus tempahan dengan lebih selamat
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300 sm:text-[15px]">
              Halaman ini hanya untuk admin Haji Saif Homestay. Selepas login,
              anda boleh semak permintaan tempahan, kemas kini status booking,
              dan follow up tetamu dengan lebih cepat.
            </p>
          </section>

          <Suspense
            fallback={
              <div className="rounded-[2rem] border border-stone-200/90 bg-white/95 p-6 text-sm text-stone-600 shadow-[0_20px_70px_rgba(88,69,46,0.1)] sm:p-8">
                Sedang memuatkan borang login...
              </div>
            }
          >
            <AdminLoginForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
