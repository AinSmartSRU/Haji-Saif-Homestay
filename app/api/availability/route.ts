import { NextResponse } from "next/server";
import { isBookingBlocksTableMissing, type BookingBlockUnit } from "@/lib/bookingBlocks";
import { type Unit } from "@/lib/site";
import {
  isServerSupabaseConfigured,
  serverSupabase,
} from "@/lib/supabaseServer";

type ConfirmedBooking = {
  id: string;
  unit_id: string;
  check_in: string;
  check_out: string;
};

type PublicBlock = {
  check_in: string;
  check_out: string;
  unit: BookingBlockUnit;
};

export async function GET() {
  if (!isServerSupabaseConfigured) {
    return NextResponse.json(
      {
        error:
          "Konfigurasi Supabase belum lengkap. Sila tetapkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      },
      { status: 500 },
    );
  }

  const [unitsResult, bookingsResult, blocksResult] = await Promise.all([
    serverSupabase
      .from("units")
      .select(
        "id, name, slug, description, bedrooms, max_guests, normal_price, promo_price, deposit, is_active",
      )
      .eq("is_active", true)
      .order("name"),
    serverSupabase
      .from("bookings")
      .select("id, unit_id, check_in, check_out")
      .eq("status", "confirmed"),
    serverSupabase
      .from("booking_blocks")
      .select("unit, check_in, check_out")
      .eq("is_active", true),
  ]);

  if (unitsResult.error || bookingsResult.error) {
    return NextResponse.json(
      { error: "Kalendar tempahan tidak dapat dimuatkan sekarang. Sila cuba lagi." },
      { status: 500 },
    );
  }

  if (blocksResult.error && !isBookingBlocksTableMissing(blocksResult.error)) {
    return NextResponse.json(
      { error: "Kalendar tempahan tidak dapat dimuatkan sekarang. Sila cuba lagi." },
      { status: 500 },
    );
  }

  const units = (unitsResult.data ?? []) as Unit[];
  const confirmedBookings = (bookingsResult.data ?? []) as ConfirmedBooking[];
  const blocks = (blocksResult.data ?? []) as PublicBlock[];

  return NextResponse.json({
    blocks,
    bookings: confirmedBookings,
    units,
  });
}
