import { NextRequest, NextResponse } from "next/server";
import { isBookingBlocksTableMissing, type BookingBlock } from "@/lib/bookingBlocks";
import type { BookingStatus, BookingWithUnitRow, Unit } from "@/lib/site";
import { requireAdminRequest } from "@/lib/adminRequest";

export async function GET() {
  const auth = await requireAdminRequest();

  if (auth.error || !auth.supabase) {
    return auth.error;
  }

  const [bookingsResult, unitsResult, blocksResult] = await Promise.all([
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
    auth.supabase
      .from("booking_blocks")
      .select(
        "id, unit, check_in, check_out, source, reason, is_active, created_at, updated_at",
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
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

  const blocksTableReady = !isBookingBlocksTableMissing(blocksResult.error);

  if (blocksResult.error && blocksTableReady) {
    return NextResponse.json(
      { error: "Data block tarikh tidak dapat dimuatkan sekarang. Sila cuba lagi." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    blocks: ((blocksResult.data ?? []) as BookingBlock[]),
    blocksTableReady,
    bookings,
    units: (unitsResult.data ?? []) as Unit[],
  });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdminRequest();

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
