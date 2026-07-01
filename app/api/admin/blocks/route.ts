import { NextRequest, NextResponse } from "next/server";
import {
  isBookingBlocksTableMissing,
  isBookingBlockSource,
  isBookingBlockUnit,
  isSupabasePermissionError,
} from "@/lib/bookingBlocks";
import { normalizeDateString } from "@/lib/bookingDates";
import { requireAdminRequest } from "@/lib/adminRequest";

type CreateBlockBody = {
  unit?: string;
  check_in?: string;
  check_out?: string;
  reason?: string | null;
  source?: string;
};

type UpdateBlockBody = {
  blockId?: string;
};

function invalidRangeResponse() {
  return NextResponse.json(
    { error: "Sila pilih tarikh check-in dan check-out yang sah." },
    { status: 400 },
  );
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminRequest();

  if (auth.error || !auth.supabase) {
    return auth.error;
  }

  const body = (await request.json()) as CreateBlockBody;

  if (
    !body.unit ||
    !body.check_in ||
    !body.check_out ||
    !isBookingBlockUnit(body.unit) ||
    !body.source ||
    !isBookingBlockSource(body.source)
  ) {
    return invalidRangeResponse();
  }

  if (
    normalizeDateString(body.check_out) <= normalizeDateString(body.check_in)
  ) {
    return invalidRangeResponse();
  }

  const { data, error } = await auth.supabase
    .from("booking_blocks")
    .insert({
      unit: body.unit,
      check_in: body.check_in,
      check_out: body.check_out,
      source: body.source,
      reason: body.reason?.trim() || null,
      is_active: true,
    })
    .select(
      "id, unit, check_in, check_out, source, reason, is_active, created_at, updated_at",
    )
    .single();

  if (error) {
    if (isBookingBlocksTableMissing(error)) {
      return NextResponse.json(
        {
          error:
            "Jadual booking_blocks belum diwujudkan. Jalankan SQL setup dahulu di Supabase.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "Block tarikh tidak berjaya disimpan." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    block: data,
    message: "Tarikh berjaya diblock.",
    ok: true,
  });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdminRequest();

  if (auth.error || !auth.supabase) {
    return auth.error;
  }

  const body = (await request.json()) as UpdateBlockBody;

  if (!body.blockId) {
    return NextResponse.json(
      { error: "Block tarikh tidak ditemui." },
      { status: 400 },
    );
  }

  const { error } = await auth.supabase
    .from("booking_blocks")
    .update({
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.blockId);

  if (error) {
    if (isBookingBlocksTableMissing(error)) {
      return NextResponse.json(
        {
          error:
            "Jadual booking_blocks belum diwujudkan. Jalankan SQL setup dahulu di Supabase.",
        },
        { status: 500 },
      );
    }

    if (isSupabasePermissionError(error)) {
      return NextResponse.json(
        {
          error:
            "Tidak dapat buka block tarikh. Sila semak RLS policy Supabase untuk booking_blocks.",
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { error: "Gagal buka block tarikh. Sila cuba lagi." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: "Block tarikh telah dibuka semula.",
    ok: true,
  });
}
