"use client";

import { useEffect, useState, useTransition } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  formatDate,
  type BookingStatus,
  type BookingWithUnitRow,
  type BookingWithUnit,
  type Unit,
} from "@/lib/site";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

export default function AdminPage() {
  const [bookings, setBookings] = useState<BookingWithUnit[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [unitFilter, setUnitFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function loadAdminData() {
      if (!isSupabaseConfigured) {
        setError(
          "Konfigurasi Supabase belum lengkap. Sila tetapkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY.",
        );
        setLoading(false);
        return;
      }

      setError(null);

      const [bookingsResult, unitsResult] = await Promise.all([
        supabase
          .from("bookings")
          .select(
            "id, unit_id, guest_name, phone, check_in, check_out, guests, notes, status, created_at, units(name, slug)",
          )
          .order("created_at", { ascending: false }),
        supabase
          .from("units")
          .select("id, name, slug, description, bedrooms, max_guests, normal_price, promo_price, deposit")
          .order("name"),
      ]);

      if (bookingsResult.error || unitsResult.error) {
        setError("Data tempahan tidak dapat dimuatkan sekarang. Sila cuba lagi.");
        setLoading(false);
        return;
      }

      const normalizedBookings = ((bookingsResult.data ?? []) as BookingWithUnitRow[]).map(
        (booking) => ({
          ...booking,
          units: Array.isArray(booking.units) ? booking.units[0] ?? null : booking.units,
        }),
      );

      setBookings(normalizedBookings);
      setUnits((unitsResult.data ?? []) as Unit[]);
      setLoading(false);
    }

    void loadAdminData();
  }, []);

  async function updateStatus(bookingId: string, status: BookingStatus) {
    if (!isSupabaseConfigured) {
      setError(
        "Konfigurasi Supabase belum lengkap. Sila tetapkan pemboleh ubah persekitaran terlebih dahulu.",
      );
      return;
    }

    startTransition(() => {
      void (async () => {
        setError(null);

        const { error: updateError } = await supabase
          .from("bookings")
          .update({ status })
          .eq("id", bookingId);

        if (updateError) {
          setError("Status tempahan tidak berjaya dikemas kini.");
          return;
        }

        setBookings((current) =>
          current.map((booking) =>
            booking.id === bookingId ? { ...booking, status } : booking,
          ),
        );
      })();
    });
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    const matchesUnit = unitFilter === "all" || booking.unit_id === unitFilter;

    return matchesStatus && matchesUnit;
  });

  return (
    <div className="min-h-screen bg-[color:var(--color-background)]">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold tracking-[0.24em] text-stone-500 uppercase">
            Admin Tempahan
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-stone-950">
            Dashboard ringkas untuk semak dan kemas kini booking
          </h1>
        </div>

        <div className="mt-8 grid gap-4 rounded-[2rem] border border-stone-200 bg-white p-5 shadow-[0_18px_60px_rgba(88,69,46,0.08)] md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-stone-700">
            Tapis ikut status
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-400 focus:bg-white"
            >
              <option value="all">Semua status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-stone-700">
            Tapis ikut unit
            <select
              value={unitFilter}
              onChange={(event) => setUnitFilter(event.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-400 focus:bg-white"
            >
              <option value="all">Semua unit</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {loading ? (
          <div className="mt-8 rounded-[2rem] border border-stone-200 bg-white px-6 py-10 text-sm text-stone-600">
            Sedang memuatkan tempahan...
          </div>
        ) : error ? (
          <div className="mt-8 rounded-[2rem] border border-red-200 bg-red-50 px-6 py-10 text-sm text-red-700">
            {error}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="mt-8 rounded-[2rem] border border-dashed border-stone-300 px-6 py-10 text-sm text-stone-600">
            Tiada tempahan ditemui untuk tapisan semasa.
          </div>
        ) : (
          <div className="mt-8 grid gap-5">
            {filteredBookings.map((booking) => (
              <article
                key={booking.id}
                className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(88,69,46,0.08)]"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="grid flex-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase">
                        Tetamu
                      </p>
                      <p className="mt-2 font-semibold text-stone-900">
                        {booking.guest_name}
                      </p>
                      <p className="mt-1 text-sm text-stone-600">{booking.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase">
                        Unit
                      </p>
                      <p className="mt-2 font-semibold text-stone-900">
                        {booking.units?.name ?? "Tidak diketahui"}
                      </p>
                      <p className="mt-1 text-sm text-stone-600">
                        {booking.guests} tetamu
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase">
                        Status
                      </p>
                      <p className="mt-2 font-semibold capitalize text-stone-900">
                        {booking.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase">
                        Check-in
                      </p>
                      <p className="mt-2 text-sm text-stone-700">
                        {formatDate(booking.check_in)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase">
                        Check-out
                      </p>
                      <p className="mt-2 text-sm text-stone-700">
                        {formatDate(booking.check_out)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase">
                        Dicipta
                      </p>
                      <p className="mt-2 text-sm text-stone-700">
                        {formatDate(booking.created_at)}
                      </p>
                    </div>
                    <div className="sm:col-span-2 xl:col-span-3">
                      <p className="text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase">
                        Nota
                      </p>
                      <p className="mt-2 text-sm leading-7 text-stone-700">
                        {booking.notes || "Tiada nota tambahan."}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:w-52">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => updateStatus(booking.id, "confirmed")}
                      className="rounded-full bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-400"
                    >
                      Mark Confirmed
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => updateStatus(booking.id, "cancelled")}
                      className="rounded-full bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-stone-400"
                    >
                      Mark Cancelled
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => updateStatus(booking.id, "pending")}
                      className="rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:text-stone-400"
                    >
                      Mark Pending
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
