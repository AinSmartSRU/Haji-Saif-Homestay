import Link from "next/link";
import Footer from "@/components/Footer";
import ImageWithFallback from "@/components/ImageWithFallback";
import Navbar from "@/components/Navbar";
import UnitCard from "@/components/UnitCard";
import { homepageGalleryImages, unitImages } from "@/lib/imageConfig";
import {
  bookingSteps,
  buildWhatsAppUrl,
  facilities,
  homepageUnits,
  SITE_LOCATION,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/site";
import { siteConfig } from "@/lib/siteConfig";

const quickInfo = [
  "RM195/malam promo",
  "3 bilik setiap rumah",
  "Maksimum 10 tetamu",
  "Deposit RM100",
];

const previewUnits = homepageUnits.map((unit) => ({
  id: unit.slug,
  name: unit.name,
  slug: unit.slug,
  description: unit.description,
  bedrooms: 3,
  max_guests: siteConfig.maxGuestsPerUnit,
  normal_price: siteConfig.normalPrice,
  promo_price: siteConfig.promoPrice,
  deposit: siteConfig.deposit,
}));

const facilityHighlights = [
  "3 bilik setiap rumah",
  "Ruang tamu",
  "Dapur",
  "Ruang makan",
  "Tandas",
  "Kemudahan asas lengkap",
  "Sesuai untuk keluarga",
  "Parking",
  "2 unit rumah bersebelahan",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[color:var(--color-background)]">
      <Navbar />

      <main>
        <section className="border-b border-stone-200">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-24">
            <div className="space-y-8">
              <div className="inline-flex rounded-full border border-[color:var(--color-accent)]/30 bg-[color:var(--color-accent)]/12 px-4 py-2 text-sm font-medium text-[color:var(--color-accent-deep)]">
                {SITE_LOCATION}
              </div>
              <div className="space-y-5">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl lg:text-6xl">
                  {SITE_NAME}
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-stone-700">
                  {SITE_TAGLINE}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/booking"
                  className="inline-flex items-center justify-center rounded-full bg-stone-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800"
                >
                  Semak & Tempah
                </Link>
                <a
                  href={buildWhatsAppUrl(
                    `Hi ${siteConfig.adminName}, saya berminat untuk bertanya tentang ${siteConfig.siteName}.`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-6 py-3.5 text-sm font-semibold text-stone-900 transition hover:border-stone-400 hover:bg-stone-50"
                >
                  WhatsApp Kami
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] bg-[radial-gradient(circle_at_top,_rgba(191,149,104,0.28),_rgba(255,255,255,0)_62%),linear-gradient(160deg,_#fffdf8,_#efe3d0)] p-6 shadow-[0_20px_80px_rgba(88,69,46,0.14)]">
              <div className="grid gap-4 sm:grid-cols-2">
                {quickInfo.map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.5rem] border border-white/70 bg-white/80 p-5"
                  >
                    <p className="text-sm font-medium leading-6 text-stone-700">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-[1.5rem] border border-white/70 bg-white/80 p-5">
                <p className="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
                  Sesuai Untuk
                </p>
                <p className="mt-3 text-sm leading-7 text-stone-700">
                  Tempahan keluarga, penginapan kumpulan kecil, dan pelancong
                  yang mahu dua rumah bersebelahan dalam satu lokasi yang
                  praktikal.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[0.24em] text-stone-500 uppercase">
                Pilihan Unit
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-stone-950">
                Dua rumah, satu pengalaman yang selesa
              </h2>
            </div>
            <Link
              href="/units"
              className="text-sm font-semibold text-[color:var(--color-accent-deep)] transition hover:text-stone-950"
            >
              Lihat semua unit
            </Link>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {previewUnits.map((unit) => (
              <UnitCard
                key={unit.id}
                unit={unit}
                heroImage={unitImages[unit.slug][0]}
              />
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-[color:var(--color-surface)]">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm font-semibold tracking-[0.24em] text-stone-500 uppercase">
                Galeri Haji Saif Homestay
              </p>
              <h2 className="text-3xl font-semibold text-stone-950">
                Lihat suasana rumah, ruang tamu, bilik, dapur dan kemudahan yang disediakan.
              </h2>
              <p className="text-lg leading-8 text-stone-700">
                Lihat suasana rumah, ruang tamu, bilik, dapur dan kemudahan yang disediakan.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {homepageGalleryImages.map((image, index) => (
                <ImageWithFallback
                  key={image.src}
                  src={image.src}
                  alt={image.alt}
                  label={image.label}
                  priority={index < 2}
                  aspectClassName={index === 0 ? "aspect-[16/12] md:col-span-2 md:row-span-2" : "aspect-[4/3]"}
                  sizes={index === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[color:var(--color-surface)]">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold tracking-[0.24em] text-stone-500 uppercase">
                Kemudahan
              </p>
              <h2 className="text-3xl font-semibold text-stone-950">
                Penginapan yang ringkas, kemas, dan mudah diurus
              </h2>
            </div>
            <div className="grid gap-4">
              {facilities.map((facility) => (
                <div
                  key={facility}
                  className="rounded-[1.5rem] border border-stone-200 bg-white px-5 py-4 text-sm leading-7 text-stone-700"
                >
                  {facility}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <p className="text-sm font-semibold tracking-[0.24em] text-stone-500 uppercase">
              Kemudahan Utama
            </p>
            <h2 className="text-3xl font-semibold text-stone-950">
              Sesuai untuk keluarga dan kumpulan yang perlukan ruang praktikal
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {facilityHighlights.map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-stone-200 bg-white px-5 py-5 text-sm font-medium text-stone-700 shadow-[0_18px_50px_rgba(88,69,46,0.06)]"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <p className="text-sm font-semibold tracking-[0.24em] text-stone-500 uppercase">
              Cara Tempah
            </p>
            <h2 className="text-3xl font-semibold text-stone-950">
              Tempahan dalam beberapa langkah mudah
            </h2>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {bookingSteps.map((step, index) => (
              <div
                key={step}
                className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(88,69,46,0.08)]"
              >
                <p className="text-sm font-semibold text-[color:var(--color-accent-deep)]">
                  Langkah {index + 1}
                </p>
                <p className="mt-3 text-sm leading-7 text-stone-700">{step}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
