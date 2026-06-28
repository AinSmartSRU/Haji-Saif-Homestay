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
} from "@/lib/site";
import { siteConfig } from "@/lib/siteConfig";

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

const heroValuePoints = [
  "Sesuai untuk family trip",
  "Rumah bersebelahan",
  "Ruang tamu & dapur",
  "Parking disediakan",
  "RM195/malam promo",
  "Lokasi Putatan, Sabah",
];

const heroStats = [
  "2 Unit",
  "3 Bilik",
  "10 Tetamu/unit",
  "RM195 Promo",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[color:var(--color-background)]">
      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-stone-200 bg-[linear-gradient(180deg,_#6d5337,_#2f2419)]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(28, 21, 14, 0.82) 0%, rgba(28, 21, 14, 0.62) 45%, rgba(28, 21, 14, 0.4) 100%), linear-gradient(180deg, rgba(28, 21, 14, 0.18), rgba(28, 21, 14, 0.68)), url('/nonamanis-luar-1.webp'), url('/serimuka-1.webp')",
            }}
          />
          <div className="relative mx-auto flex min-h-[80vh] w-full max-w-6xl items-center px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="max-w-3xl space-y-8 text-white">
              <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                Rasa macam balik kampung, tapi tetap selesa
              </div>
              <div className="space-y-5">
                <p className="text-sm font-semibold tracking-[0.24em] text-stone-200 uppercase">
                  {SITE_NAME}
                </p>
                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  Bawa keluarga menginap bersama dalam suasana rumah yang tenang
                </h1>
                <p className="max-w-3xl text-lg leading-8 text-stone-100/90">
                  Haji Saif Homestay Putatan menyediakan 2 unit rumah
                  bersebelahan untuk keluarga dan kumpulan kecil. Lebih
                  privasi, lebih ruang, dan lebih mudah untuk berkumpul
                  berbanding tinggal berasingan di hotel.
                </p>
              </div>
              <div className="grid gap-3 text-sm text-stone-100 sm:grid-cols-2 lg:grid-cols-3">
                {heroValuePoints.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3 backdrop-blur-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/calendar"
                  className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-accent)] px-6 py-3.5 text-sm font-semibold text-stone-950 transition hover:bg-[color:var(--color-accent-strong)]"
                >
                  Semak Ketersediaan
                </Link>
                <Link
                  href="/booking"
                  className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/16"
                >
                  Tempah Sekarang
                </Link>
                <a
                  href={buildWhatsAppUrl(
                    `Hi ${siteConfig.adminName}, saya berminat untuk bertanya tentang ${siteConfig.siteName}.`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white px-6 py-3.5 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
                >
                  WhatsApp Admin
                </a>
                <a
                  href={siteConfig.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-white/25 bg-transparent px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Lihat Lokasi
                </a>
              </div>
              <div className="grid max-w-2xl grid-cols-2 gap-3 pt-2 sm:grid-cols-4">
                {heroStats.map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.5rem] border border-white/14 bg-white/10 px-4 py-4 text-center backdrop-blur-sm"
                  >
                    <p className="text-sm font-semibold text-white">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto -mt-16 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-stone-200/90 bg-white p-6 shadow-[0_26px_90px_rgba(56,39,20,0.16)] sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end">
              <div className="flex-1">
                <p className="text-sm font-semibold tracking-[0.24em] text-stone-500 uppercase">
                  Semak Kalendar Tempahan
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-stone-950">
                  Pilih unit dan semak tarikh yang sesuai untuk keluarga anda
                </h2>
              </div>
              <form
                action="/calendar"
                method="get"
                className="grid flex-[1.4] gap-4 lg:grid-cols-[1.05fr_1fr_1fr_0.8fr_auto]"
              >
                <label className="space-y-2 text-sm font-medium text-stone-700">
                  Unit
                  <select
                    name="unit"
                    className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-400 focus:bg-white"
                    defaultValue="nonamanis"
                  >
                    <option value="nonamanis">Nonamanis</option>
                    <option value="serimuka">Serimuka</option>
                  </select>
                </label>
                <label className="space-y-2 text-sm font-medium text-stone-700">
                  Check-in
                  <input
                    type="date"
                    name="checkIn"
                    className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-400 focus:bg-white"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-stone-700">
                  Check-out
                  <input
                    type="date"
                    name="checkOut"
                    className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-400 focus:bg-white"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-stone-700">
                  Tetamu
                  <select
                    name="guests"
                    className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-400 focus:bg-white"
                    defaultValue="4"
                  >
                    {Array.from({ length: siteConfig.maxGuestsPerUnit }, (_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1} tetamu
                      </option>
                    ))}
                  </select>
                </label>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-full bg-[color:var(--color-accent)] px-5 py-3.5 text-sm font-semibold text-stone-950 transition hover:bg-[color:var(--color-accent-strong)]"
                  >
                    Semak Kalendar
                  </button>
                </div>
              </form>
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
          <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_18px_60px_rgba(88,69,46,0.08)]">
            <p className="text-sm font-semibold tracking-[0.24em] text-stone-500 uppercase">
              Lokasi Homestay
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-stone-950">
              Lokasi Homestay
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-stone-700">
              Haji Saif Homestay terletak di Putatan, Sabah. Tekan butang di
              bawah untuk buka lokasi di Google Maps.
            </p>
            <a
              href={siteConfig.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-stone-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800"
            >
              Buka Google Maps
            </a>
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
