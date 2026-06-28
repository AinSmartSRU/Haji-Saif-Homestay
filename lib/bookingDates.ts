function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function parseDateParts(date: string) {
  const normalized = normalizeDateString(date);
  const [year, month, day] = normalized.split("-").map(Number);

  return { year, month, day };
}

function addDays(date: string, days: number) {
  const { year, month, day } = parseDateParts(date);
  const nextDate = new Date(year, month - 1, day + days);

  return `${nextDate.getFullYear()}-${pad(nextDate.getMonth() + 1)}-${pad(
    nextDate.getDate(),
  )}`;
}

export function normalizeDateString(date: string): string {
  const trimmed = date.trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    throw new Error(`Tarikh tidak sah: ${date}`);
  }

  return trimmed;
}

export function getBookedNightDates(checkIn: string, checkOut: string): string[] {
  const start = normalizeDateString(checkIn);
  const end = normalizeDateString(checkOut);
  const dates: string[] = [];
  let current = start;

  while (current < end) {
    dates.push(current);
    current = addDays(current, 1);
  }

  return dates;
}

export function rangesOverlap(
  existingCheckIn: string,
  existingCheckOut: string,
  requestedCheckIn: string,
  requestedCheckOut: string,
): boolean {
  const existingStart = normalizeDateString(existingCheckIn);
  const existingEnd = normalizeDateString(existingCheckOut);
  const requestedStart = normalizeDateString(requestedCheckIn);
  const requestedEnd = normalizeDateString(requestedCheckOut);

  return existingStart < requestedEnd && existingEnd > requestedStart;
}

export function isDateBooked(
  date: string,
  checkIn: string,
  checkOut: string,
): boolean {
  const target = normalizeDateString(date);
  const start = normalizeDateString(checkIn);
  const end = normalizeDateString(checkOut);

  return start <= target && target < end;
}

export function formatDateMY(date: string): string {
  const { year, month, day } = parseDateParts(date);

  return new Intl.DateTimeFormat("ms-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

/*
Dev validation notes for exclusive checkout logic:
- getBookedNightDates("2026-06-27", "2026-06-29") => ["2026-06-27", "2026-06-28"]
- 2026-06-29 is available because checkout is exclusive
- rangesOverlap("2026-06-27", "2026-06-29", "2026-06-29", "2026-06-30") => false
- rangesOverlap("2026-06-27", "2026-06-29", "2026-06-28", "2026-06-29") => true
- rangesOverlap("2026-06-27", "2026-06-29", "2026-06-26", "2026-06-27") => false
*/
