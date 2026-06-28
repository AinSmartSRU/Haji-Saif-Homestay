"use client";

import { useEffect, useMemo, useState } from "react";
import { getBookedNightDates, normalizeDateString } from "@/lib/bookingDates";
import { type Unit } from "@/lib/site";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

type CalendarBooking = {
  id: string;
  unit_id: string;
  check_in: string;
  check_out: string;
};

type DayState = "available" | "booked";

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function toDateString(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function createMonthDate(year: number, monthIndex: number, day: number) {
  return new Date(year, monthIndex, day);
}

function getTodayString() {
  return toDateString(new Date());
}

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("ms-MY", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatWeekdayShort(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Intl.DateTimeFormat("ms-MY", { weekday: "short" }).format(
    new Date(year, month - 1, day),
  );
}

function isSameMonth(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth()
  );
}

export default function BookingCalendar() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [bookings, setBookings] = useState<CalendarBooking[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string>("");
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return createMonthDate(now.getFullYear(), now.getMonth(), 1);
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCalendarData() {
      if (!isSupabaseConfigured) {
        setError(
          "Konfigurasi Supabase belum lengkap. Sila tetapkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY.",
        );
        setLoading(false);
        return;
      }

      const [unitsResult, bookingsResult] = await Promise.all([
        supabase
          .from("units")
          .select("id, name, slug, description, bedrooms, max_guests, normal_price, promo_price, deposit, is_active")
          .eq("is_active", true)
          .order("name"),
        supabase
          .from("bookings")
          .select("id, unit_id, check_in, check_out")
          .eq("status", "confirmed"),
      ]);

      if (unitsResult.error || bookingsResult.error) {
        setError("Kalendar tempahan tidak dapat dimuatkan sekarang. Sila cuba lagi.");
        setLoading(false);
        return;
      }

      const loadedUnits = (unitsResult.data ?? []) as Unit[];
      const loadedBookings = (bookingsResult.data ?? []) as CalendarBooking[];

      setUnits(loadedUnits);
      setBookings(loadedBookings);
      setSelectedUnitId((current) => current || loadedUnits[0]?.id || "");
      setLoading(false);
    }

    void loadCalendarData();
  }, []);

  const selectedUnit = units.find((unit) => unit.id === selectedUnitId) ?? null;
  const today = getTodayString();
  const now = new Date();
  const currentMonth = createMonthDate(now.getFullYear(), now.getMonth(), 1);
  const isCurrentVisibleMonth = isSameMonth(visibleMonth, currentMonth);

  const selectedUnitBookings = useMemo(
    () => bookings.filter((booking) => booking.unit_id === selectedUnitId),
    [bookings, selectedUnitId],
  );

  const bookedDates = useMemo(() => {
    const dates = new Set<string>();

    for (const booking of selectedUnitBookings) {
      for (const date of getBookedNightDates(booking.check_in, booking.check_out)) {
        dates.add(date);
      }
    }

    return dates;
  }, [selectedUnitBookings]);

  const monthCells = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const monthIndex = visibleMonth.getMonth();
    const monthStart = createMonthDate(year, monthIndex, 1);
    const monthEnd = createMonthDate(year, monthIndex + 1, 0);
    const firstVisibleDate = isCurrentVisibleMonth
      ? normalizeDateString(today)
      : toDateString(monthStart);
    const lastVisibleDate = toDateString(monthEnd);

    const cells: Array<{
      dateString: string;
      dayNumber: number;
      weekday: string;
      isToday: boolean;
      state: DayState;
    }> = [];

    let cursor = firstVisibleDate;

    while (cursor <= lastVisibleDate) {
      const [cursorYear, cursorMonth, cursorDay] = cursor.split("-").map(Number);
      const state: DayState = bookedDates.has(cursor) ? "booked" : "available";

      cells.push({
        dateString: cursor,
        dayNumber: cursorDay,
        weekday: formatWeekdayShort(cursor),
        isToday: cursor === today,
        state,
      });

      cursor = toDateString(new Date(cursorYear, cursorMonth - 1, cursorDay + 1));
    }

    return cells;
  }, [bookedDates, isCurrentVisibleMonth, today, visibleMonth]);

  function shiftMonth(direction: -1 | 1) {
    setVisibleMonth((current) => {
      const target = createMonthDate(
        current.getFullYear(),
        current.getMonth() + direction,
        1,
      );

      if (target < currentMonth) {
        return currentMonth;
      }

      return target;
    });
  }

  function goToCurrentMonth() {
    setVisibleMonth(currentMonth);
  }

  return (
    <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(88,69,46,0.08)] sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-stone-950">
            Kalendar Tempahan
          </h2>
          <div className="flex flex-wrap gap-3">
            {units.map((unit) => {
              const isSelected = unit.id === selectedUnitId;

              return (
                <button
                  key={unit.id}
                  type="button"
                  onClick={() => setSelectedUnitId(unit.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isSelected
                      ? "bg-stone-950 text-white"
                      : "border border-stone-300 bg-white text-stone-800 hover:bg-stone-50"
                  }`}
                >
                  {unit.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <div className="rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-700">
            {formatMonthLabel(visibleMonth)}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              disabled={isCurrentVisibleMonth}
              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:border-stone-200 disabled:text-stone-400"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={goToCurrentMonth}
              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 rounded-[1.5rem] bg-stone-50 px-5 py-8 text-sm text-stone-600">
          Sedang memuatkan kalendar tempahan...
        </div>
      ) : error ? (
        <div className="mt-8 rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-8 text-sm text-red-700">
          {error}
        </div>
      ) : units.length === 0 ? (
        <div className="mt-8 rounded-[1.5rem] border border-dashed border-stone-300 px-5 py-8 text-sm text-stone-600">
          Tiada unit aktif tersedia untuk paparan kalendar.
        </div>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            {[
              { label: "Tersedia", color: "bg-white border-stone-300" },
              { label: "Ditempah", color: "bg-red-100 border-red-200" },
              { label: "Hari ini", color: "bg-stone-100 border-stone-500" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-medium text-stone-700"
              >
                <span className={`h-3 w-3 rounded-full border ${item.color}`} />
                {item.label}
              </div>
            ))}
          </div>

          {selectedUnit ? (
            <p className="mt-4 text-sm text-stone-600">
              Paparan untuk unit{" "}
              <span className="font-semibold text-stone-900">{selectedUnit.name}</span>
            </p>
          ) : null}

          <div className="mt-6 hidden grid-cols-7 gap-2 md:grid">
            {monthCells.map((cell) => {
              const stateClasses =
                cell.state === "booked"
                  ? "border-red-200 bg-red-50 text-red-800"
                  : "border-stone-200 bg-white text-stone-800";

              return (
                <div
                  key={cell.dateString}
                  className={`min-h-28 rounded-[1.25rem] border p-4 shadow-[0_8px_22px_rgba(88,69,46,0.04)] ${stateClasses} ${
                    cell.isToday
                      ? "ring-2 ring-stone-500 ring-offset-2 ring-offset-[color:var(--color-background)]"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                        {cell.weekday}
                      </p>
                      <p className="mt-2 text-3xl font-semibold">{cell.dayNumber}</p>
                    </div>
                    {cell.isToday ? (
                      <span className="rounded-full bg-stone-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-700">
                        Hari ini
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        cell.state === "booked"
                          ? "bg-red-100 text-red-700"
                          : "bg-stone-100 text-stone-700"
                      }`}
                    >
                      {cell.state === "booked" ? "Ditempah" : "Tersedia"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:hidden">
            {monthCells.map((cell) => {
              const stateClasses =
                cell.state === "booked"
                  ? "border-red-200 bg-red-50 text-red-800"
                  : "border-stone-200 bg-white text-stone-800";

              return (
                <div
                  key={cell.dateString}
                  className={`rounded-[1.25rem] border p-4 shadow-[0_8px_22px_rgba(88,69,46,0.04)] ${stateClasses} ${
                    cell.isToday
                      ? "ring-2 ring-stone-500 ring-offset-2 ring-offset-[color:var(--color-background)]"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                        {cell.weekday}
                      </p>
                      <p className="mt-2 text-3xl font-semibold">{cell.dayNumber}</p>
                    </div>
                    {cell.isToday ? (
                      <span className="rounded-full bg-stone-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-700">
                        Hari ini
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        cell.state === "booked"
                          ? "bg-red-100 text-red-700"
                          : "bg-stone-100 text-stone-700"
                      }`}
                    >
                      {cell.state === "booked" ? "Ditempah" : "Tersedia"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
