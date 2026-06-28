import { NextRequest, NextResponse } from "next/server";
import { isAllowedAdminEmail } from "@/lib/adminAuth";
import type { BookingStatus, BookingWithUnitRow, Unit } from "@/lib/site";
import {
  createServerSupabaseClient,
  isServerSupabaseConfigured,
} from "@/lib/supabaseServer";

async function requireAdmin() {
  if (!isServerSupabaseConfigured) {
    return {
      error: NextResponse.json(
        { error: "Supabase belum dikonfigurasi." },
        { status: 500 },
      ),
      supabase: null,
      user: null,
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      error: NextResponse.json({ error: "Sila login dahulu." }, { status: 401 }),
      supabase: null,
      user: null,
    };
  }

  if (!isAllowedAdminEmail(user.email)) {
    return {
      error: NextResponse.json(
        { error: "Akaun ini tidak mempunyai akses admin." },
        { status: 403 },
      ),
      supabase: null,
      user,
    };
  }

  return {
    error: null,
    supabase,
    user,
  };
}

export async function GET() {
  const auth = await requireAdmin();

  if (auth.error || !auth.supabase) {
    return auth.error;
  }

  const [bookingsResult, unitsResult] = await Promise.all([
    auth.supabase
      .from("bookings")
      .select(
        "id, unit_id, guest_name, phone, check_in, check_out, guests, notes, status, created_at, units(name, slug)",
      )
      .order("created_at", { ascending: false }),
    auth.supabase
      .from("units")
      .select(
        "id, name, slug, description, bedrooms, max_guests, normal_price, promo_price, deposit",
      )
      .order("name"),
  ]);

  if (bookingsResult.error || unitsResult.error) {
    return NextResponse.json(
      { error: "Data tempahan tidak dapat dimuatkan sekarang. Sila cuba lagi." },
      { status: 500 },
    );
  }

  const bookings = ((bookingsResult.data ?? []) as BookingWithUnitRow[]).map(
    (booking) => ({
      ...booking,
      units: Array.isArray(booking.units)
        ? booking.units[0] ?? null
        : booking.units,
    }),
  );

  return NextResponse.json({
    bookings,
    units: (unitsResult.data ?? []) as Unit[],
  });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin();

  if (auth.error || !auth.supabase) {
    return auth.error;
  }

  const body = (await request.json()) as {
    bookingId?: string;
    status?: BookingStatus;
  };

  const allowedStatuses: BookingStatus[] = ["pending", "confirmed", "cancelled"];

  if (!body.bookingId || !body.status || !allowedStatuses.includes(body.status)) {
    return NextResponse.json(
      { error: "Maklumat status tidak lengkap." },
      { status: 400 },
    );
  }

  const { error } = await auth.supabase
    .from("bookings")
    .update({ status: body.status })
    .eq("id", body.bookingId);

  if (error) {
    return NextResponse.json(
      { error: "Status tempahan tidak berjaya dikemas kini." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
