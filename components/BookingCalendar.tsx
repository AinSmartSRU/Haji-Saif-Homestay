"use client";

import { useEffect, useMemo, useState } from "react";
import { type BookingBlockUnit } from "@/lib/bookingBlocks";
import { getBookedNightDates, normalizeDateString } from "@/lib/bookingDates";
import { type Unit } from "@/lib/site";

type CalendarBooking = {
  id: string;
  unit_id: string;
  check_in: string;
  check_out: string;
};

type CalendarBlock = {
  check_in: string;
  check_out: string;
  unit: BookingBlockUnit;
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

function getMondayFirstIndex(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return (date.getDay() + 6) % 7;
}

const weekdayLabels = ["ISN", "SEL", "RAB", "KHA", "JUM", "SAB", "AHD"];

export default function BookingCalendar() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [bookings, setBookings] = useState<CalendarBooking[]>([]);
  const [blocks, setBlocks] = useState<CalendarBlock[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string>("");
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return createMonthDate(now.getFullYear(), now.getMonth(), 1);
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCalendarData() {
      const response = await fetch("/api/availability", {
        cache: "no-store",
      });
      const result = (await response.json()) as {
        bookings?: CalendarBooking[];
        blocks?: CalendarBlock[];
        error?: string;
        units?: Unit[];
      };

      if (!response.ok) {
        setError("Kalendar tempahan tidak dapat dimuatkan sekarang. Sila cuba lagi.");
        setLoading(false);
        return;
      }

      const loadedUnits = result.units ?? [];
      const loadedBookings = result.bookings ?? [];
      const loadedBlocks = result.blocks ?? [];

      setUnits(loadedUnits);
      setBookings(loadedBookings);
      setBlocks(loadedBlocks);
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

  const selectedUnitBlocks = useMemo(() => {
    const selectedUnitName = units.find((unit) => unit.id === selectedUnitId)?.name;

    if (!selectedUnitName) {
      return [];
    }

    return blocks.filter((block) => block.unit === selectedUnitName);
  }, [blocks, selectedUnitId, units]);

  const bookedDates = useMemo(() => {
    const dates = new Set<string>();

    for (const booking of selectedUnitBookings) {
      for (const date of getBookedNightDates(booking.check_in, booking.check_out)) {
        dates.add(date);
      }
    }

    for (const block of selectedUnitBlocks) {
      for (const date of getBookedNightDates(block.check_in, block.check_out)) {
        dates.add(date);
      }
    }

    return dates;
  }, [selectedUnitBlocks, selectedUnitBookings]);

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

  const leadingSpacerCount = useMemo(() => {
    if (monthCells.length === 0) {
      return 0;
    }

    return getMondayFirstIndex(monthCells[0].dateString);
  }, [monthCells]);

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
    <section className="rounded-[1.75rem] border border-stone-200 bg-white p-4 shadow-[0_18px_60px_rgba(88,69,46,0.08)] sm:p-6 md:rounded-[2rem] md:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-stone-950 sm:text-2xl">
            Kalendar Tempahan
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
            {units.map((unit) => {
              const isSelected = unit.id === selectedUnitId;

              return (
                <button
                  key={unit.id}
                  type="button"
                  onClick={() => setSelectedUnitId(unit.id)}
                  className={`rounded-full px-3 py-2 text-sm font-semibold transition sm:px-4 ${
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
          <div className="rounded-full bg-stone-100 px-3 py-2 text-center text-sm font-semibold text-stone-700 sm:px-4">
            {formatMonthLabel(visibleMonth)}
          </div>
          <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-3">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              disabled={isCurrentVisibleMonth}
              className="rounded-full border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-800 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:border-stone-200 disabled:text-stone-400 sm:px-4"
            >
              <span className="sm:hidden">&lt;</span>
              <span className="hidden sm:inline">Previous</span>
            </button>
            <button
              type="button"
              onClick={goToCurrentMonth}
              className="rounded-full border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-800 transition hover:bg-stone-50 sm:px-4"
            >
              <span className="sm:hidden">Hari ini</span>
              <span className="hidden sm:inline">Today</span>
            </button>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              className="rounded-full border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-800 transition hover:bg-stone-50 sm:px-4"
            >
              <span className="sm:hidden">&gt;</span>
              <span className="hidden sm:inline">Next</span>
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
          <div className="mt-5 flex flex-wrap gap-2 text-sm sm:mt-6 sm:gap-3">
            {[
              { label: "Tersedia", color: "bg-white border-stone-300" },
              { label: "Ditempah", color: "bg-red-100 border-red-200" },
              { label: "Hari ini", color: "bg-stone-100 border-stone-500" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-[11px] font-medium text-stone-700 sm:gap-2 sm:px-3 sm:py-2 sm:text-xs"
              >
                <span className={`h-2.5 w-2.5 rounded-full border sm:h-3 sm:w-3 ${item.color}`} />
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

          <div className="mt-6 hidden md:block">
            <div className="grid grid-cols-7 gap-2">
              {weekdayLabels.map((label) => (
                <div
                  key={label}
                  className="px-2 py-3 text-center text-xs font-semibold tracking-[0.18em] text-stone-500 uppercase"
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="mt-2 grid grid-cols-7 gap-2">
              {Array.from({ length: leadingSpacerCount }).map((_, index) => (
                <div
                  key={`spacer-${index}`}
                  aria-hidden="true"
                  className="min-h-28 rounded-[1.25rem] border border-transparent"
                />
              ))}

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
          </div>

          <div className="mt-5 md:hidden">
            <div className="grid grid-cols-7 gap-1.5">
              {weekdayLabels.map((label) => (
                <div
                  key={`mobile-${label}`}
                  className="py-1 text-center text-[10px] font-semibold tracking-[0.12em] text-stone-500 uppercase"
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="mt-1.5 grid grid-cols-7 gap-1.5">
              {Array.from({ length: leadingSpacerCount }).map((_, index) => (
                <div
                  key={`mobile-spacer-${index}`}
                  aria-hidden="true"
                  className="aspect-square rounded-xl border border-transparent"
                />
              ))}

              {monthCells.map((cell) => {
              const stateClasses =
                cell.state === "booked"
                  ? "border-red-200 bg-red-50 text-red-800"
                  : "border-stone-200 bg-white text-stone-800";

              return (
                <div
                  key={cell.dateString}
                  className={`aspect-square rounded-xl border px-1.5 py-1.5 shadow-[0_6px_16px_rgba(88,69,46,0.04)] ${stateClasses} ${
                    cell.isToday
                      ? "ring-2 ring-stone-500 ring-offset-1 ring-offset-[color:var(--color-background)]"
                      : ""
                  }`}
                >
                  <div className="flex h-full flex-col justify-between">
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-sm font-semibold">{cell.dayNumber}</p>
                      {cell.isToday ? (
                        <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-stone-700">
                          Hari ini
                        </span>
                      ) : null}
                    </div>
                    <div className="flex items-end justify-between gap-1">
                      {cell.state === "booked" ? (
                        <span className="text-[9px] font-semibold text-red-700">
                          Book
                        </span>
                      ) : (
                        <span className="h-2 w-2 rounded-full border border-stone-300 bg-white" />
                      )}
                      <span
                        className={`h-2 w-2 rounded-full ${
                          cell.state === "booked" ? "bg-red-500" : "bg-stone-300"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
