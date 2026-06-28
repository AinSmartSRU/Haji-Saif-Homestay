"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  formatDate,
  normalizeMalaysianWhatsAppNumber,
  type BookingStatus,
  type BookingWithUnit,
  type Unit,
} from "@/lib/site";
import { siteConfig } from "@/lib/siteConfig";
import { supabase } from "@/lib/supabaseClient";

type AdminDashboardProps = {
  adminEmail: string;
};

type AdminBookingsResponse = {
  bookings: BookingWithUnit[];
  error?: string;
  units: Unit[];
};

export default function AdminDashboard({ adminEmail }: AdminDashboardProps) {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingWithUnit[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [unitFilter, setUnitFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function loadAdminData() {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/bookings", {
        cache: "no-store",
      });
      const result = (await response.json()) as AdminBookingsResponse;

      if (!response.ok) {
        setError(
          result.error ?? "Data tempahan tidak dapat dimuatkan sekarang. Sila cuba lagi.",
        );

        if (response.status === 401 || response.status === 403) {
          router.replace("/admin/login");
        }

        setLoading(false);
        return;
      }

      setBookings(result.bookings ?? []);
      setUnits(result.units ?? []);
      setLoading(false);
    }

    void loadAdminData();
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  async function updateStatus(bookingId: string, status: BookingStatus) {
    startTransition(() => {
      void (async () => {
        setError(null);

        const response = await fetch("/api/admin/bookings", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bookingId, status }),
        });

        const result = (await response.json()) as { error?: string };

        if (!response.ok) {
          setError(result.error ?? "Status tempahan tidak berjaya dikemas kini.");

          if (response.status === 401 || response.status === 403) {
            router.replace("/admin/login");
          }

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

  function createGuestWhatsAppLink(booking: BookingWithUnit) {
    const normalizedPhone = normalizeMalaysianWhatsAppNumber(booking.phone);

    if (!normalizedPhone) {
      return null;
    }

    const unitName = booking.units?.name ?? "unit pilihan anda";
    const message = `Hi, ini ${siteConfig.adminName} dari ${siteConfig.siteName}. Kami ingin follow up permintaan tempahan anda untuk ${unitName} pada ${booking.check_in} hingga ${booking.check_out}.`;

    return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
  }

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <p className="text-sm font-semibold tracking-[0.24em] text-stone-500 uppercase">
            Admin Tempahan
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-stone-950">
            Dashboard ringkas untuk semak dan kemas kini booking
          </h1>
          <p className="text-sm text-stone-600">
            Login sebagai <span className="font-medium text-stone-900">{adminEmail}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/calendar"
            className="inline-flex rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-900 transition hover:bg-stone-50"
          >
            Kalendar Tempahan
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
          >
            {loggingOut ? "Logout..." : "Logout"}
          </button>
        </div>
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
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-stone-600">
                      <span>{booking.guests} tetamu</span>
                      {booking.guests > siteConfig.maxGuestsPerUnit ? (
                        <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
                          Lebih had
                        </span>
                      ) : null}
                    </div>
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
                  {createGuestWhatsAppLink(booking) ? (
                    <a
                      href={createGuestWhatsAppLink(booking) ?? undefined}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-[color:var(--color-accent)] bg-[color:var(--color-accent)]/12 px-4 py-2.5 text-center text-sm font-semibold text-[color:var(--color-accent-deep)] transition hover:bg-[color:var(--color-accent)]/20"
                    >
                      WhatsApp Guest
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="rounded-full border border-stone-200 bg-stone-100 px-4 py-2.5 text-sm font-semibold text-stone-400"
                    >
                      WhatsApp Guest
                    </button>
                  )}
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
    </>
  );
}
