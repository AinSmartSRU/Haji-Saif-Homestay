"use client";

import { useEffect, useMemo, useState } from "react";
import {
  formatDateMY,
  getBookedNightDates,
  normalizeDateString,
} from "@/lib/bookingDates";
import { type BookingStatus, type Unit } from "@/lib/site";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

type CalendarBooking = {
  id: string;
  unit_id: string;
  check_in: string;
  check_out: string;
  status: BookingStatus;
};

type DayState = "available" | "booked" | "pending" | "past";

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
    month: "long",
    year: "numeric",
  }).format(date);
}

const weekdayLabels = ["Isn", "Sel", "Rab", "Kha", "Jum", "Sab", "Aha"];

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
          .select("id, unit_id, check_in, check_out, status")
          .in("status", ["confirmed", "pending"]),
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

  const selectedUnitBookings = useMemo(
    () => bookings.filter((booking) => booking.unit_id === selectedUnitId),
    [bookings, selectedUnitId],
  );

  const statusByDate = useMemo(() => {
    const dateMap = new Map<string, "booked" | "pending">();

    for (const booking of selectedUnitBookings) {
      const bookedDates = getBookedNightDates(booking.check_in, booking.check_out);

      for (const date of bookedDates) {
        if (booking.status === "confirmed") {
          dateMap.set(date, "booked");
        } else if (!dateMap.has(date)) {
          dateMap.set(date, "pending");
        }
      }
    }

    return dateMap;
  }, [selectedUnitBookings]);

  const monthCells = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const monthIndex = visibleMonth.getMonth();
    const firstDay = createMonthDate(year, monthIndex, 1);
    const offset = (firstDay.getDay() + 6) % 7;
    const gridStart = createMonthDate(year, monthIndex, 1 - offset);

    return Array.from({ length: 42 }, (_, index) => {
      const cellDate = createMonthDate(
        gridStart.getFullYear(),
        gridStart.getMonth(),
        gridStart.getDate() + index,
      );
      const dateString = toDateString(cellDate);
      const monthMatch = cellDate.getMonth() === monthIndex;
      const bookingState = statusByDate.get(dateString);
      let state: DayState = "available";

      if (dateString < today) {
        state = "past";
      }

      if (bookingState === "booked") {
        state = "booked";
      } else if (bookingState === "pending" && state !== "past") {
        state = "pending";
      }

      return {
        dateString,
        dayNumber: cellDate.getDate(),
        isCurrentMonth: monthMatch,
        isToday: normalizeDateString(dateString) === today,
        state,
      };
    });
  }, [statusByDate, today, visibleMonth]);

  function shiftMonth(direction: -1 | 1) {
    setVisibleMonth((current) =>
      createMonthDate(current.getFullYear(), current.getMonth() + direction, 1),
    );
  }

  function goToCurrentMonth() {
    const now = new Date();
    setVisibleMonth(createMonthDate(now.getFullYear(), now.getMonth(), 1));
  }

  return (
    <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(88,69,46,0.08)] sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-stone-950">
            Kalendar Tempahan
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-600">
            Paparan ini menggunakan logik checkout eksklusif. Tarikh checkout
            tidak ditanda sebagai malam yang ditempah.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
          >
            Previous month
          </button>
          <button
            type="button"
            onClick={goToCurrentMonth}
            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
          >
            This month
          </button>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
          >
            Next month
          </button>
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
          <div className="mt-8 flex flex-wrap gap-3">
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

          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-stone-100 px-4 py-2 font-semibold text-stone-700">
              {formatMonthLabel(visibleMonth)}
            </span>
            {selectedUnit ? (
              <span className="text-stone-600">
                Paparan untuk unit <span className="font-semibold text-stone-900">{selectedUnit.name}</span>
              </span>
            ) : null}
          </div>

          <div className="mt-6 grid grid-cols-4 gap-3 text-sm sm:flex sm:flex-wrap">
            {[
              { label: "Available", color: "bg-white border-stone-300" },
              { label: "Booked", color: "bg-red-100 border-red-200" },
              { label: "Pending", color: "bg-amber-100 border-amber-200" },
              { label: "Today", color: "bg-stone-100 border-stone-500" },
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

          <div className="mt-6 grid grid-cols-7 gap-2">
            {weekdayLabels.map((label) => (
              <div
                key={label}
                className="px-2 py-3 text-center text-xs font-semibold tracking-[0.18em] text-stone-500 uppercase"
              >
                {label}
              </div>
            ))}

            {monthCells.map((cell) => {
              const stateClasses =
                cell.state === "booked"
                  ? "border-red-200 bg-red-50 text-red-800"
                  : cell.state === "pending"
                    ? "border-amber-200 bg-amber-50 text-amber-800"
                    : cell.state === "past"
                      ? "border-stone-200 bg-stone-50 text-stone-400"
                      : "border-stone-200 bg-white text-stone-800";

              return (
                <div
                  key={cell.dateString}
                  className={`min-h-24 rounded-[1.25rem] border p-3 shadow-[0_8px_22px_rgba(88,69,46,0.04)] ${stateClasses} ${
                    cell.isCurrentMonth ? "" : "opacity-55"
                  } ${cell.isToday ? "ring-2 ring-stone-500 ring-offset-2 ring-offset-[color:var(--color-background)]" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold">{cell.dayNumber}</span>
                    {cell.state === "booked" ? (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-red-700">
                        Booked
                      </span>
                    ) : cell.state === "pending" ? (
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700">
                        Pending
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-xs leading-5">
                    {cell.state === "booked"
                      ? "Sudah ditempah"
                      : cell.state === "pending"
                        ? "Permintaan sedang disemak"
                        : cell.state === "past"
                          ? "Tarikh lepas"
                          : "Masih tersedia"}
                  </p>
                  <p className="mt-2 text-[11px] leading-5 opacity-80">
                    {formatDateMY(cell.dateString)}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
