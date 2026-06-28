"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import UnitCard from "@/components/UnitCard";
import { type Unit } from "@/lib/site";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

export default function UnitsPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUnits() {
      if (!isSupabaseConfigured) {
        setError(
          "Konfigurasi Supabase belum lengkap. Sila tetapkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY.",
        );
        setLoading(false);
        return;
      }

      const { data, error: unitsError } = await supabase
        .from("units")
        .select(
          "id, name, slug, description, bedrooms, max_guests, normal_price, promo_price, deposit, is_active",
        )
        .eq("is_active", true)
        .order("name");

      if (unitsError) {
        setError("Unit tidak dapat dimuatkan sekarang. Sila cuba lagi.");
        setLoading(false);
        return;
      }

      setUnits((data ?? []) as Unit[]);
      setLoading(false);
    }

    void loadUnits();
  }, []);

  return (
    <div className="min-h-screen bg-[color:var(--color-background)]">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold tracking-[0.24em] text-stone-500 uppercase">
            Unit Homestay
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-stone-950">
            Pilih unit yang sesuai untuk tempahan anda
          </h1>
          <p className="text-lg leading-8 text-stone-700">
            Nonamanis dan Serimuka masing-masing mempunyai 3 bilik, sesuai
            untuk sehingga 10 tetamu, dan terletak bersebelahan untuk kemudahan
            kumpulan.
          </p>
        </div>

        {loading ? (
          <div className="mt-10 rounded-[2rem] border border-stone-200 bg-white px-6 py-10 text-sm text-stone-600">
            Sedang memuatkan unit...
          </div>
        ) : error ? (
          <div className="mt-10 rounded-[2rem] border border-red-200 bg-red-50 px-6 py-10 text-sm text-red-700">
            {error}
          </div>
        ) : units.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-dashed border-stone-300 px-6 py-10 text-sm text-stone-600">
            Tiada unit aktif tersedia buat masa ini.
          </div>
        ) : (
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {units.map((unit) => (
              <UnitCard key={unit.id} unit={unit} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
