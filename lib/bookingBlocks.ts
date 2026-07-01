export const bookingBlockUnits = ["Nonamanis", "Serimuka"] as const;

export const bookingBlockSources = [
  "manual",
  "booking.com",
  "agoda",
  "whatsapp",
  "internal",
  "maintenance",
  "other",
] as const;

export type BookingBlockUnit = (typeof bookingBlockUnits)[number];
export type BookingBlockSource = (typeof bookingBlockSources)[number];

export type BookingBlock = {
  id: string;
  unit: BookingBlockUnit;
  check_in: string;
  check_out: string;
  source: BookingBlockSource;
  reason: string | null;
  is_active: boolean;
  created_at: string;
  updated_at?: string | null;
};

type MaybeSupabaseError = {
  code?: string;
  message?: string;
} | null;

export function isSupabasePermissionError(error: MaybeSupabaseError) {
  if (!error) {
    return false;
  }

  const message = error.message?.toLowerCase() ?? "";

  return (
    error.code === "42501" ||
    message.includes("row-level security") ||
    message.includes("permission denied") ||
    message.includes("not allowed")
  );
}

export function isBookingBlockUnit(value: string): value is BookingBlockUnit {
  return bookingBlockUnits.includes(value as BookingBlockUnit);
}

export function isBookingBlockSource(value: string): value is BookingBlockSource {
  return bookingBlockSources.includes(value as BookingBlockSource);
}

export function getBookingBlockSourceLabel(source: BookingBlockSource) {
  switch (source) {
    case "manual":
      return "Manual";
    case "booking.com":
      return "Booking.com";
    case "agoda":
      return "Agoda";
    case "whatsapp":
      return "WhatsApp";
    case "internal":
      return "Internal";
    case "maintenance":
      return "Maintenance";
    case "other":
      return "Other";
  }
}

export function isBookingBlocksTableMissing(error: MaybeSupabaseError) {
  if (!error) {
    return false;
  }

  const message = error.message?.toLowerCase() ?? "";

  return (
    error.code === "42P01" ||
    (error.code === "PGRST205" && message.includes("booking_blocks")) ||
    message.includes('relation "booking_blocks" does not exist') ||
    message.includes("could not find the table") ||
    message.includes("booking_blocks does not exist")
  );
}
