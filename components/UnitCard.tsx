import Link from "next/link";
import { formatCurrency, type Unit } from "@/lib/site";
import { siteConfig } from "@/lib/siteConfig";
import type { GalleryImage } from "@/lib/imageConfig";
import ImageWithFallback from "@/components/ImageWithFallback";

type UnitCardProps = {
  unit: Unit;
  compact?: boolean;
  heroImage?: GalleryImage;
  galleryImages?: GalleryImage[];
  showGallery?: boolean;
};

export default function UnitCard({
  unit,
  compact = false,
  heroImage,
  galleryImages = [],
  showGallery = false,
}: UnitCardProps) {
  const resolvedBedrooms = unit.bedrooms ?? 3;
  const resolvedGuests = unit.max_guests ?? siteConfig.maxGuestsPerUnit;
  const resolvedPromoPrice = unit.promo_price ?? siteConfig.promoPrice;
  const resolvedNormalPrice = unit.normal_price ?? siteConfig.normalPrice;
  const resolvedDeposit = unit.deposit ?? siteConfig.deposit;

  return (
    <article className="flex h-full flex-col rounded-[1.75rem] border border-stone-200 bg-white p-4 shadow-[0_18px_60px_rgba(88,69,46,0.08)] sm:rounded-[2rem] sm:p-6">
      {heroImage ? (
        <div className="mb-5 sm:mb-6">
          <ImageWithFallback
            src={heroImage.src}
            alt={heroImage.alt}
            label={heroImage.label}
            aspectClassName="aspect-[16/11]"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
        </div>
      ) : null}

      <div className="space-y-2.5 sm:space-y-3">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-stone-500 uppercase sm:text-xs sm:tracking-[0.24em]">
          Unit Homestay
        </p>
        <h3 className="text-xl font-semibold text-stone-900 sm:text-2xl">{unit.name}</h3>
        <p className="text-sm leading-6 text-stone-600 sm:leading-7">
          {unit.description || "Maklumat unit akan dikemas kini tidak lama lagi."}
        </p>
      </div>

      <div className="mt-5 grid gap-3 rounded-[1.35rem] bg-stone-50 p-3.5 text-sm text-stone-700 sm:mt-6 sm:rounded-[1.5rem] sm:p-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-stone-500 sm:text-sm">Bilik tidur</p>
          <p className="mt-1 font-semibold text-stone-900">
            {resolvedBedrooms} bilik
          </p>
        </div>
        <div>
          <p className="text-xs text-stone-500 sm:text-sm">Kapasiti</p>
          <p className="mt-1 font-semibold text-stone-900">
            Maksimum {resolvedGuests} tetamu
          </p>
        </div>
        <div>
          <p className="text-xs text-stone-500 sm:text-sm">Harga promosi</p>
          <p className="mt-1 font-semibold text-[color:var(--color-accent-deep)]">
            {formatCurrency(resolvedPromoPrice)} / malam
          </p>
        </div>
        <div>
          <p className="text-xs text-stone-500 sm:text-sm">Harga biasa</p>
          <p className="mt-1 font-semibold text-stone-500 line-through decoration-stone-300">
            {formatCurrency(resolvedNormalPrice)}
          </p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-xs text-stone-500 sm:text-sm">Deposit</p>
          <p className="mt-1 font-semibold text-stone-900">
            {formatCurrency(resolvedDeposit)} deposit
          </p>
        </div>
      </div>

      {showGallery && galleryImages.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {galleryImages.slice(0, 8).map((image) => (
            <ImageWithFallback
              key={`${unit.slug}-${image.src}`}
              src={image.src}
              alt={image.alt}
              label={image.label}
              aspectClassName="aspect-[4/3]"
              sizes="(min-width: 768px) 20vw, 50vw"
              className="rounded-[1.25rem]"
            />
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex flex-1 items-end sm:mt-6">
        <div className={`flex w-full flex-col gap-3 ${compact ? "" : "sm:flex-row"}`}>
          <Link
            href={`/booking?unit=${unit.slug}`}
            className={`inline-flex items-center justify-center rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 ${
              compact ? "w-full" : "sm:flex-1"
            }`}
          >
            Tempah Unit Ini
          </Link>
          <Link
            href="/units"
            className={`inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-50 ${
              compact ? "w-full" : "sm:flex-1"
            }`}
          >
            Lihat Galeri Unit
          </Link>
        </div>
      </div>
    </article>
  );
}
