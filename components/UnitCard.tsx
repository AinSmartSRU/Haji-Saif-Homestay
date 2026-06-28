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
    <article className="flex h-full flex-col rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(88,69,46,0.08)]">
      {heroImage ? (
        <div className="mb-6">
          <ImageWithFallback
            src={heroImage.src}
            alt={heroImage.alt}
            label={heroImage.label}
            aspectClassName="aspect-[16/11]"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
        </div>
      ) : null}

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
            {resolvedBedrooms} bilik
          </p>
        </div>
        <div>
          <p className="text-stone-500">Tetamu maksimum</p>
          <p className="mt-1 font-semibold text-stone-900">
            maksimum {resolvedGuests} tetamu
          </p>
        </div>
        <div>
          <p className="text-stone-500">Harga promosi</p>
          <p className="mt-1 font-semibold text-[color:var(--color-accent-deep)]">
            {formatCurrency(resolvedPromoPrice)} / malam
          </p>
        </div>
        <div>
          <p className="text-stone-500">Harga biasa</p>
          <p className="mt-1 font-semibold text-stone-900 line-through decoration-stone-300">
            harga biasa {formatCurrency(resolvedNormalPrice)} / malam
          </p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-stone-500">Deposit</p>
          <p className="mt-1 font-semibold text-stone-900">
            deposit {formatCurrency(resolvedDeposit)}
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

      <div className="mt-6 flex flex-1 items-end">
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
