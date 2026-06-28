import Link from "next/link";
import { formatCurrency, type Unit } from "@/lib/site";

type UnitCardProps = {
  unit: Unit;
  compact?: boolean;
};

export default function UnitCard({ unit, compact = false }: UnitCardProps) {
  return (
    <article className="flex h-full flex-col rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(88,69,46,0.08)]">
      <div className="space-y-3">
        <p className="text-xs font-semibold tracking-[0.24em] text-stone-500 uppercase">
          Unit Homestay
        </p>
        <h3 className="text-2xl font-semibold text-stone-900">{unit.name}</h3>
        <p className="text-sm leading-7 text-stone-600">
          {unit.description || "Maklumat unit akan dikemas kini tidak lama lagi."}
        </p>
      </div>

      <div className="mt-6 grid gap-3 rounded-[1.5rem] bg-stone-50 p-4 text-sm text-stone-700 sm:grid-cols-2">
        <div>
          <p className="text-stone-500">Bilik tidur</p>
          <p className="mt-1 font-semibold text-stone-900">
            {unit.bedrooms ?? "-"} bilik
          </p>
        </div>
        <div>
          <p className="text-stone-500">Tetamu maksimum</p>
          <p className="mt-1 font-semibold text-stone-900">
            {unit.max_guests ?? "-"} orang
          </p>
        </div>
        <div>
          <p className="text-stone-500">Harga promosi</p>
          <p className="mt-1 font-semibold text-[color:var(--color-accent-deep)]">
            {formatCurrency(unit.promo_price)} / malam
          </p>
        </div>
        <div>
          <p className="text-stone-500">Harga biasa</p>
          <p className="mt-1 font-semibold text-stone-900 line-through decoration-stone-300">
            {formatCurrency(unit.normal_price)}
          </p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-stone-500">Deposit</p>
          <p className="mt-1 font-semibold text-stone-900">
            {formatCurrency(unit.deposit)} / unit
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-1 items-end">
        <Link
          href={`/booking?unit=${unit.slug}`}
          className={`inline-flex items-center justify-center rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 ${
            compact ? "w-full" : ""
          }`}
        >
          Tempah Unit Ini
        </Link>
      </div>
    </article>
  );
}
