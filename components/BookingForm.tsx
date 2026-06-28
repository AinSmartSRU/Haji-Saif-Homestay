"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  buildWhatsAppUrl,
  formatDate,
  type Unit,
} from "@/lib/site";
import { normalizeDateString } from "@/lib/bookingDates";
import { siteConfig } from "@/lib/siteConfig";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

type BookingFormProps = {
  initialUnitSlug?: string | null;
};

type FormState = {
  guest_name: string;
  phone: string;
  unit_id: string;
  check_in: string;
  check_out: string;
  guests: string;
  notes: string;
};

const initialFormState: FormState = {
  guest_name: "",
  phone: "",
  unit_id: "",
  check_in: "",
  check_out: "",
  guests: "1",
  notes: "",
};

type SuccessState = {
  guestName: string;
  phone: string;
  unitName: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  notes: string;
};

export default function BookingForm({ initialUnitSlug }: BookingFormProps) {
  const [units, setUnits] = useState<Unit[]>([]);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [loadingUnits, setLoadingUnits] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SuccessState | null>(null);

  useEffect(() => {
    async function loadUnits() {
      if (!isSupabaseConfigured) {
        setError(
          "Konfigurasi Supabase belum lengkap. Sila tetapkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY.",
        );
        setLoadingUnits(false);
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
        setLoadingUnits(false);
        return;
      }

      const loadedUnits = (data ?? []) as Unit[];
      setUnits(loadedUnits);

      setForm((current) => {
        const preferredUnit = loadedUnits.find(
          (unit) => unit.slug === initialUnitSlug,
        );

        return {
          ...current,
          unit_id: preferredUnit?.id ?? loadedUnits[0]?.id ?? "",
        };
      });

      setLoadingUnits(false);
    }

    void loadUnits();
  }, [initialUnitSlug]);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.guest_name || !form.phone || !form.unit_id || !form.check_in || !form.check_out) {
      setError("Sila lengkapkan semua maklumat wajib sebelum menghantar tempahan.");
      return;
    }

    if (
      normalizeDateString(form.check_out) <= normalizeDateString(form.check_in)
    ) {
      setError("Tarikh check-out mesti selepas tarikh check-in.");
      return;
    }

    const guestCount = Number(form.guests);

    if (!Number.isInteger(guestCount) || guestCount < 1) {
      setError("Jumlah tetamu mesti sekurang-kurangnya 1 orang.");
      return;
    }

    if (guestCount > siteConfig.maxGuestsPerUnit) {
      setError(
        `Maksimum tetamu untuk setiap unit ialah ${siteConfig.maxGuestsPerUnit} orang.`,
      );
      return;
    }

    if (!isSupabaseConfigured) {
      setError(
        "Konfigurasi Supabase belum lengkap. Sila tetapkan pemboleh ubah persekitaran terlebih dahulu.",
      );
      return;
    }

    setSubmitting(true);
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        unit_id: form.unit_id,
        guest_name: form.guest_name,
        phone: form.phone,
        check_in: form.check_in,
        check_out: form.check_out,
        guests: guestCount,
        notes: form.notes || null,
      }),
    });
    setSubmitting(false);

    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      setError(
        result.error ||
          "Permintaan tempahan tidak berjaya dihantar. Sila cuba lagi.",
      );
      return;
    }

    const selectedUnit = units.find((unit) => unit.id === form.unit_id);

    setSuccess({
      guestName: form.guest_name,
      phone: form.phone,
      unitName: selectedUnit?.name ?? "Unit pilihan",
      checkIn: form.check_in,
      checkOut: form.check_out,
      guests: form.guests,
      notes: form.notes,
    });
    setForm((current) => ({
      ...initialFormState,
      unit_id: current.unit_id,
    }));
  }

  const whatsappMessage = success
    ? `Hi ${siteConfig.adminName}, saya telah hantar permintaan tempahan ${siteConfig.siteName}.\n\nNama: ${success.guestName}\nTelefon: ${success.phone}\nUnit: ${success.unitName}\nCheck-in: ${success.checkIn}\nCheck-out: ${success.checkOut}\nJumlah tetamu: ${success.guests}\nNota: ${success.notes || "-"}\n\nSaya ingin semak ketersediaan dan teruskan tempahan jika slot masih kosong.`
    : "";

  return (
    <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(88,69,46,0.08)] sm:p-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-stone-900">
          Beritahu kami bila anda nak datang
        </h2>
        <p className="text-sm leading-7 text-stone-600">
          Lepas borang dihantar, kami akan WhatsApp anda untuk sahkan tarikh,
          bayaran, dan butiran tempahan.
        </p>
        <p className="text-sm leading-7 text-stone-500">
          Tarikh hanya disahkan selepas admin sahkan tempahan dan deposit
          diterima.
        </p>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mt-6 rounded-[2rem] border border-emerald-200 bg-[linear-gradient(180deg,_#f4fbf6,_#ecf8f0)] p-6 text-sm text-stone-800 shadow-[0_18px_50px_rgba(41,84,54,0.08)]">
          <p className="text-2xl font-semibold text-stone-950">
            {success.guestName
              ? `Terima kasih, ${success.guestName}! Kami akan hubungi anda tidak lama lagi`
              : "Terima kasih! Kami akan hubungi anda tidak lama lagi"}
          </p>
          <p className="mt-3 max-w-2xl leading-7 text-stone-700">
            Butiran tempahan anda sudah kami terima. Pihak Haji Saif Homestay
            akan WhatsApp anda untuk sahkan tarikh dan proses bayaran.
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-600">
            Pastikan nombor WhatsApp anda aktif ya.
          </p>
          <div className="mt-6 grid gap-4 rounded-[1.5rem] border border-emerald-100 bg-white/90 p-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase">Nama</p>
              <p className="mt-2 font-medium text-stone-900">{success.guestName}</p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase">No. telefon</p>
              <p className="mt-2 font-medium text-stone-900">{success.phone}</p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase">Unit</p>
              <p className="mt-2 font-medium text-stone-900">{success.unitName}</p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase">Jumlah tetamu</p>
              <p className="mt-2 font-medium text-stone-900">{success.guests}</p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase">Check-in</p>
              <p className="mt-2 font-medium text-stone-900">{formatDate(success.checkIn)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase">Check-out</p>
              <p className="mt-2 font-medium text-stone-900">{formatDate(success.checkOut)}</p>
            </div>
            {success.notes ? (
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase">Nota</p>
                <p className="mt-2 leading-7 text-stone-700">{success.notes}</p>
              </div>
            ) : null}
          </div>
          <a
            href={buildWhatsAppUrl(whatsappMessage)}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex rounded-full bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800"
          >
            WhatsApp Haji Saif Sekarang
          </a>
        </div>
      ) : null}

      {loadingUnits ? (
        <div className="mt-8 rounded-2xl bg-stone-50 px-4 py-6 text-sm text-stone-600">
          Sedang memuatkan pilihan unit...
        </div>
      ) : units.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-stone-300 px-4 py-6 text-sm text-stone-600">
          Tiada unit aktif tersedia buat masa ini.
        </div>
      ) : success ? (
        <div className="mt-8 rounded-[1.75rem] border border-dashed border-stone-300 bg-stone-50/80 px-5 py-6 text-sm leading-7 text-stone-600">
          Nak buat tempahan lain? Reload halaman ini.
        </div>
      ) : (
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-stone-700">
              Nama penuh
              <input
                value={form.guest_name}
                onChange={(event) => updateField("guest_name", event.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-400 focus:bg-white"
                placeholder="Nama anda"
                required
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-stone-700">
              Nombor WhatsApp
              <input
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-400 focus:bg-white"
                placeholder="Nombor yang aktif WhatsApp"
                required
              />
              <p className="text-xs font-normal text-stone-500">
                Contoh: {siteConfig.whatsappDisplay}
              </p>
            </label>
            <label className="space-y-2 text-sm font-medium text-stone-700">
              Rumah pilihan
              <select
                value={form.unit_id}
                onChange={(event) => updateField("unit_id", event.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-400 focus:bg-white"
                required
              >
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-stone-700">
              Berapa orang yang datang?
              <input
                type="number"
                min={1}
                max={siteConfig.maxGuestsPerUnit}
                value={form.guests}
                onChange={(event) => updateField("guests", event.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-400 focus:bg-white"
                required
              />
              <p className="text-xs font-normal text-stone-500">
                Setiap unit boleh muat sehingga 10 orang.
              </p>
            </label>
            <label className="space-y-2 text-sm font-medium text-stone-700">
              Tarikh check-in
              <input
                type="date"
                value={form.check_in}
                onChange={(event) => updateField("check_in", event.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-400 focus:bg-white"
                required
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-stone-700">
              Tarikh check-out
              <input
                type="date"
                value={form.check_out}
                onChange={(event) => updateField("check_out", event.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-400 focus:bg-white"
                required
              />
            </label>
          </div>

          <div className="flex flex-col gap-2 text-sm text-stone-600">
            <Link
              href="/calendar"
              className="font-semibold text-[color:var(--color-accent-deep)] transition hover:text-stone-950"
            >
              Semak kalendar tempahan
            </Link>
            <p>
              Tarikh yang bertanda dalam kalendar dah ada orang book. Yang
              lain masih kosong — kami akan confirm bila kami WhatsApp anda.
            </p>
          </div>

          <label className="block space-y-2 text-sm font-medium text-stone-700">
            Ada apa-apa yang kami perlu tahu?
            <textarea
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              className="min-h-32 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-400 focus:bg-white"
              placeholder="Masa anda nak tiba, keperluan khas, atau apa-apa soalan untuk kami."
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
          >
            {submitting ? "Menghantar..." : "Hantar Permintaan Tempahan"}
          </button>
          <p className="text-sm leading-7 text-stone-600">
            Nota: Tempahan hanya disahkan selepas pihak homestay mengesahkan
            slot dan deposit diterima.
          </p>
        </form>
      )}
    </div>
  );
}
