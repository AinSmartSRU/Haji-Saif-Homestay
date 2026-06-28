import { NextResponse } from "next/server";
import { normalizeDateString, rangesOverlap } from "@/lib/bookingDates";
import { sendBookingNotification } from "@/lib/email/sendBookingNotification";
import { siteConfig } from "@/lib/siteConfig";
import {
  isServerSupabaseConfigured,
  serverSupabase,
} from "@/lib/supabaseServer";

type BookingRequestBody = {
  unit_id?: string;
  guest_name?: string;
  phone?: string;
  check_in?: string;
  check_out?: string;
  guests?: number;
  notes?: string | null;
};

type ConfirmedBooking = {
  check_in: string;
  check_out: string;
};

export async function POST(request: Request) {
  if (!isServerSupabaseConfigured) {
    return NextResponse.json(
      {
        error:
          "Konfigurasi Supabase belum lengkap. Sila tetapkan pemboleh ubah persekitaran terlebih dahulu.",
      },
      { status: 500 },
    );
  }

  const body = (await request.json()) as BookingRequestBody;

  if (
    !body.guest_name ||
    !body.phone ||
    !body.unit_id ||
    !body.check_in ||
    !body.check_out
  ) {
    return NextResponse.json(
      {
        error:
          "Sila lengkapkan semua maklumat wajib sebelum menghantar tempahan.",
      },
      { status: 400 },
    );
  }

  if (
    normalizeDateString(body.check_out) <= normalizeDateString(body.check_in)
  ) {
    return NextResponse.json(
      { error: "Tarikh check-out mesti selepas tarikh check-in." },
      { status: 400 },
    );
  }

  const guestCount = Number(body.guests);

  if (!Number.isInteger(guestCount) || guestCount < 1) {
    return NextResponse.json(
      { error: "Jumlah tetamu mesti sekurang-kurangnya 1 orang." },
      { status: 400 },
    );
  }

  if (guestCount > siteConfig.maxGuestsPerUnit) {
    return NextResponse.json(
      {
        error: `Maksimum tetamu untuk setiap unit ialah ${siteConfig.maxGuestsPerUnit} orang.`,
      },
      { status: 400 },
    );
  }

  const { data: units, error: unitError } = await serverSupabase
    .from("units")
    .select("id, name, max_guests")
    .eq("id", body.unit_id)
    .limit(1);

  if (unitError || !units || units.length === 0) {
    return NextResponse.json(
      { error: "Unit yang dipilih tidak ditemui." },
      { status: 400 },
    );
  }

  const unit = units[0] as {
    id: string;
    name: string;
    max_guests: number | null;
  };

  if (guestCount > (unit.max_guests ?? siteConfig.maxGuestsPerUnit)) {
    return NextResponse.json(
      {
        error: `Maksimum tetamu untuk setiap unit ialah ${siteConfig.maxGuestsPerUnit} orang.`,
      },
      { status: 400 },
    );
  }

  const { data: confirmedBookings, error: conflictError } = await serverSupabase
    .from("bookings")
    .select("check_in, check_out")
    .eq("unit_id", body.unit_id)
    .eq("status", "confirmed");

  if (conflictError) {
    return NextResponse.json(
      { error: "Semakan tarikh tidak berjaya. Sila cuba lagi." },
      { status: 500 },
    );
  }

  const overlapsConfirmed = ((confirmedBookings ?? []) as ConfirmedBooking[]).some(
    (booking) =>
      rangesOverlap(
        booking.check_in,
        booking.check_out,
        body.check_in!,
        body.check_out!,
      ),
  );

  if (overlapsConfirmed) {
    return NextResponse.json(
      {
        error:
          "Tarikh ini sudah ditempah untuk unit yang dipilih. Sila pilih tarikh lain.",
      },
      { status: 409 },
    );
  }

  const { data: insertedBooking, error: insertError } = await serverSupabase
    .from("bookings")
    .insert({
      unit_id: body.unit_id,
      guest_name: body.guest_name,
      phone: body.phone,
      check_in: body.check_in,
      check_out: body.check_out,
      guests: guestCount,
      notes: body.notes || null,
      status: "pending",
    })
    .select("created_at, status")
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: "Permintaan tempahan tidak berjaya dihantar. Sila cuba lagi." },
      { status: 500 },
    );
  }

  await sendBookingNotification({
    createdAt:
      (insertedBooking as { created_at?: string } | null)?.created_at ??
      new Date().toISOString(),
    guestName: body.guest_name,
    phone: body.phone,
    unitName: unit.name,
    checkIn: body.check_in,
    checkOut: body.check_out,
    guests: guestCount,
    notes: body.notes || null,
    status:
      (insertedBooking as { status?: string } | null)?.status || "pending",
  });

  return NextResponse.json({
    success: true,
    booking: {
      unitName: unit.name,
      checkIn: body.check_in,
      checkOut: body.check_out,
      guests: guestCount,
    },
  });
}
