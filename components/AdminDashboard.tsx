"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  bookingBlockSources,
  bookingBlockUnits,
  getBookingBlockSourceLabel,
  type BookingBlock,
  type BookingBlockSource,
  type BookingBlockUnit,
} from "@/lib/bookingBlocks";
import { getBookedNightDates, normalizeDateString } from "@/lib/bookingDates";
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
  blocks?: BookingBlock[];
  blocksTableReady?: boolean;
  bookings: BookingWithUnit[];
  error?: string;
  units: Unit[];
};

type BlockFormState = {
  check_in: string;
  check_out: string;
  reason: string;
  source: BookingBlockSource;
  unit: BookingBlockUnit;
};

const initialBlockFormState: BlockFormState = {
  check_in: "",
  check_out: "",
  reason: "",
  source: "manual",
  unit: "Nonamanis",
};

export default function AdminDashboard({ adminEmail }: AdminDashboardProps) {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingWithUnit[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [blocks, setBlocks] = useState<BookingBlock[]>([]);
  const [blockForm, setBlockForm] = useState<BlockFormState>(initialBlockFormState);
  const [statusFilter, setStatusFilter] = useState("all");
  const [unitFilter, setUnitFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [blocksTableReady, setBlocksTableReady] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blockError, setBlockError] = useState<string | null>(null);
  const [blockSuccess, setBlockSuccess] = useState<string | null>(null);
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
          result.error ??
            "Data tempahan tidak dapat dimuatkan sekarang. Sila cuba lagi.",
        );

        if (response.status === 401 || response.status === 403) {
          router.replace("/admin/login");
        }

        setLoading(false);
        return;
      }

      setBookings(result.bookings ?? []);
      setUnits(result.units ?? []);
      setBlocks(result.blocks ?? []);
      setBlocksTableReady(result.blocksTableReady ?? true);
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

  function updateBlockField<K extends keyof BlockFormState>(
    field: K,
    value: BlockFormState[K],
  ) {
    setBlockForm((current) => ({
      ...current,
      [field]: value,
    }));
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

  async function createBlock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBlockError(null);
    setBlockSuccess(null);

    if (
      !blockForm.unit ||
      !blockForm.check_in ||
      !blockForm.check_out ||
      normalizeDateString(blockForm.check_out) <=
        normalizeDateString(blockForm.check_in)
    ) {
      setBlockError("Sila pilih tarikh check-in dan check-out yang sah.");
      return;
    }

    startTransition(() => {
      void (async () => {
        const response = await fetch("/api/admin/blocks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(blockForm),
        });

        const result = (await response.json()) as {
          block?: BookingBlock;
          error?: string;
          message?: string;
        };

        if (!response.ok || !result.block) {
          setBlockError(result.error ?? "Block tarikh tidak berjaya disimpan.");
          return;
        }

        setBlocks((current) => [result.block!, ...current]);
        setBlockForm((current) => ({
          ...initialBlockFormState,
          unit: current.unit,
          source: current.source,
        }));
        setBlockSuccess(result.message ?? "Tarikh berjaya diblock.");
        setBlocksTableReady(true);
      })();
    });
  }

  async function removeBlock(blockId: string) {
    setBlockError(null);
    setBlockSuccess(null);

    startTransition(() => {
      void (async () => {
        const response = await fetch("/api/admin/blocks", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ blockId }),
        });

        const result = (await response.json()) as {
          error?: string;
          message?: string;
        };

        if (!response.ok) {
          setBlockError(
            result.error ?? "Block tarikh tidak berjaya dibuka semula.",
          );
          return;
        }

        setBlocks((current) => current.filter((block) => block.id !== blockId));
        setBlockSuccess(result.message ?? "Block tarikh telah dibuka semula.");
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
            Login sebagai{" "}
            <span className="font-medium text-stone-900">{adminEmail}</span>
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

      <section className="mt-8 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(88,69,46,0.08)] sm:p-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-semibold tracking-[0.24em] text-stone-500 uppercase">
            Block Tarikh
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-stone-950">
            Block Tarikh
          </h2>
          <p className="text-sm leading-7 text-stone-600">
            Gunakan bahagian ini untuk block tarikh yang sudah ditempah dari
            Booking.com, Agoda, WhatsApp, atau kegunaan sendiri.
          </p>
        </div>

        {!blocksTableReady ? (
          <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-900">
            Jadual <span className="font-semibold">booking_blocks</span> belum
            tersedia. Jalankan SQL setup di Supabase dahulu untuk aktifkan
            fungsi block tarikh.
          </div>
        ) : null}

        {blockError ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {blockError}
          </div>
        ) : null}

        {blockSuccess ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {blockSuccess}
          </div>
        ) : null}

        <form className="mt-6 space-y-5" onSubmit={createBlock}>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <label className="space-y-2 text-sm font-medium text-stone-700">
              Unit
              <select
                value={blockForm.unit}
                onChange={(event) =>
                  updateBlockField("unit", event.target.value as BookingBlockUnit)
                }
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-400 focus:bg-white"
                required
              >
                {bookingBlockUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-stone-700">
              Tarikh check-in
              <input
                type="date"
                value={blockForm.check_in}
                onChange={(event) => updateBlockField("check_in", event.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-400 focus:bg-white"
                required
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-stone-700">
              Tarikh check-out
              <input
                type="date"
                value={blockForm.check_out}
                onChange={(event) => updateBlockField("check_out", event.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-400 focus:bg-white"
                required
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-stone-700 md:col-span-2 xl:col-span-1">
              Sumber booking
              <select
                value={blockForm.source}
                onChange={(event) =>
                  updateBlockField(
                    "source",
                    event.target.value as BookingBlockSource,
                  )
                }
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-400 focus:bg-white"
                required
              >
                {bookingBlockSources.map((source) => (
                  <option key={source} value={source}>
                    {getBookingBlockSourceLabel(source)}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-stone-700 md:col-span-2 xl:col-span-2">
              Catatan / sebab
              <textarea
                value={blockForm.reason}
                onChange={(event) => updateBlockField("reason", event.target.value)}
                className="min-h-28 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-400 focus:bg-white"
                placeholder="Contoh: Booking Agoda, maintenance, family use, atau tempahan manual"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isPending || !blocksTableReady}
            className="inline-flex rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
          >
            Block Tarikh
          </button>
        </form>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-stone-900">
            Block tarikh aktif
          </h3>
          {blocks.length === 0 ? (
            <div className="mt-4 rounded-[1.5rem] border border-dashed border-stone-300 px-5 py-6 text-sm text-stone-600">
              Tiada block tarikh aktif buat masa ini.
            </div>
          ) : (
            <div className="mt-4 grid gap-4">
              {blocks.map((block) => (
                <article
                  key={block.id}
                  className="rounded-[1.5rem] border border-stone-200 bg-stone-50/70 p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="grid flex-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      <div>
                        <p className="text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase">
                          Unit
                        </p>
                        <p className="mt-2 font-semibold text-stone-900">
                          {block.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase">
                          Check-in
                        </p>
                        <p className="mt-2 text-sm text-stone-700">
                          {formatDate(block.check_in)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase">
                          Check-out
                        </p>
                        <p className="mt-2 text-sm text-stone-700">
                          {formatDate(block.check_out)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase">
                          Malam diblock
                        </p>
                        <p className="mt-2 text-sm text-stone-700">
                          {getBookedNightDates(block.check_in, block.check_out).length}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase">
                          Source
                        </p>
                        <p className="mt-2">
                          <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-stone-700">
                            {getBookingBlockSourceLabel(block.source)}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase">
                          Dicipta
                        </p>
                        <p className="mt-2 text-sm text-stone-700">
                          {formatDate(block.created_at)}
                        </p>
                      </div>
                      <div className="sm:col-span-2 xl:col-span-3">
                        <p className="text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase">
                          Sebab
                        </p>
                        <p className="mt-2 text-sm leading-7 text-stone-700">
                          {block.reason || "Tiada catatan tambahan."}
                        </p>
                      </div>
                    </div>

                    <div className="lg:w-44">
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => removeBlock(block.id)}
                        className="w-full rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:text-stone-400"
                      >
                        Buka Block
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

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
