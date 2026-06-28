import Link from "next/link";
import {
  ArrowRight,
  Bed,
  Building2,
  Car,
  CalendarDays,
  ClipboardList,
  Lock,
  MapPin,
  Droplets,
  MessageCircle,
  Snowflake,
  Tv,
  Utensils,
  Users,
  WashingMachine,
  Wifi,
} from "lucide-react";
import Footer from "@/components/Footer";
import ImageWithFallback from "@/components/ImageWithFallback";
import Navbar from "@/components/Navbar";
import UnitCard from "@/components/UnitCard";
import { homepageGalleryImages, unitImages } from "@/lib/imageConfig";
import {
  buildWhatsAppUrl,
  homepageUnits,
  SITE_LOCATION,
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

const facilityChips = [
  { label: "WiFi", icon: Wifi },
  { label: "Aircond", icon: Snowflake },
  { label: "Dapur lengkap", icon: Utensils },
  { label: "Mesin basuh", icon: WashingMachine },
  { label: "Parking percuma", icon: Car },
  { label: "Smart TV", icon: Tv },
  { label: "Tilam berkualiti", icon: Bed },
  { label: "Air panas", icon: Droplets },
];

const whyChooseUsCards = [
  {
    title: "2 Unit Bersebelahan",
    description:
      "Sesuai untuk keluarga besar atau dua keluarga yang datang bersama.",
    icon: Building2,
  },
  {
    title: "Privasi Penuh",
    description:
      "Tiada lobby sesak atau bilik berasingan. Rumah ini untuk keluarga dan kumpulan anda.",
    icon: Lock,
  },
  {
    title: "Ruang Untuk Berkumpul",
    description:
      "Boleh makan bersama, berbual, berehat dan rasa seperti di rumah sendiri.",
    icon: Users,
  },
  {
    title: "Lokasi Putatan",
    description:
      "Mudah diakses untuk urusan sekitar Putatan dan Kota Kinabalu. Lokasi homestay sekitar 7km dari Lapangan Terbang Antarabangsa Kota Kinabalu.",
    icon: MapPin,
  },
];

const bookingSteps = [
  {
    step: "Langkah 1",
    title: "Pilih unit & tarikh",
    description:
      "Tengok unit yang tersedia dan pilih tarikh menginap anda.",
    icon: CalendarDays,
  },
  {
    step: "Langkah 2",
    title: "Isi borang tempahan",
    description:
      "Masukkan nama, tarikh, bilangan tetamu dan keperluan anda. Ambil masa seminit je.",
    icon: ClipboardList,
  },
  {
    step: "Langkah 3",
    title: "WhatsApp untuk confirm",
    description:
      "Selepas borang dihantar, kami akan hubungi anda melalui WhatsApp untuk pengesahan dan bayaran.",
    icon: MessageCircle,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[color:var(--color-background)]">
      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-stone-200 bg-[linear-gradient(180deg,_#6d5337,_#2f2419)] scroll-mt-24">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(28, 21, 14, 0.82) 0%, rgba(28, 21, 14, 0.62) 45%, rgba(28, 21, 14, 0.4) 100%), linear-gradient(180deg, rgba(28, 21, 14, 0.18), rgba(28, 21, 14, 0.68)), url('/nonamanis-luar-1.webp'), url('/serimuka-1.webp')",
            }}
          />
          <div className="relative mx-auto flex min-h-[68vh] w-full max-w-6xl items-center px-4 py-12 sm:min-h-[72vh] sm:px-6 sm:py-16 lg:min-h-[80vh] lg:px-8 lg:py-24">
            <div className="max-w-3xl space-y-5 text-white sm:space-y-6">
              <div className="space-y-4 sm:space-y-5">
                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  Dua rumah. Satu kenangan.
                </h1>
                <p className="max-w-3xl text-base leading-7 text-stone-100/88 sm:text-lg sm:leading-8">
                  Dua unit bersebelahan. Bukan hotel. Ini rumah.
                  <br />
                  Untuk keluarga dan rombongan yang nak betul-betul ada{" "}
                  <span className="text-[1.08em] font-bold text-white">
                    MASA
                  </span>{" "}
                  sama-sama — makan sekali, gelak sekali, rehat pun rasa macam
                  tak ke mana-mana.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3">
                <Link
                  href="/calendar"
                  className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-accent)] px-5 py-3.5 text-sm font-semibold text-stone-950 transition hover:bg-[color:var(--color-accent-strong)] sm:px-6"
                >
                  Semak Kekosongan
                </Link>
                <Link
                  href="/booking"
                  className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/16 sm:px-6"
                >
                  Tempah Sekarang
                </Link>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
                  <a
                    href={buildWhatsAppUrl(
                      `Hi ${siteConfig.adminName}, saya berminat untuk bertanya tentang ${siteConfig.siteName}.`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white px-4 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-100 sm:px-6 sm:py-3.5"
                  >
                    WhatsApp Admin
                  </a>
                  <a
                    href={siteConfig.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-white/25 bg-transparent px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:px-6 sm:py-3.5"
                  >
                    Lihat Lokasi
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto -mt-10 w-full max-w-6xl px-4 sm:-mt-12 sm:px-6 lg:-mt-16 lg:px-8 scroll-mt-24">
          <div className="rounded-[1.75rem] border border-stone-200/90 bg-white p-5 shadow-[0_26px_90px_rgba(56,39,20,0.16)] sm:rounded-[2rem] sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end">
              <div className="flex-1">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-stone-500 uppercase sm:text-sm sm:tracking-[0.24em]">
                  Semak Kalendar Tempahan
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-stone-950 sm:text-3xl">
                  Pilih unit dan semak tarikh yang sesuai untuk keluarga anda
                </h2>
              </div>
              <form
                action="/calendar"
                method="get"
                className="grid flex-[1.4] gap-3 sm:gap-4 lg:grid-cols-[1.05fr_1fr_1fr_0.8fr_auto]"
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

        <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 scroll-mt-24">
          <div className="overflow-hidden rounded-[2rem] border border-stone-800/60 bg-[linear-gradient(135deg,_#3c2d1f,_#1f1812)] px-5 py-8 text-stone-100 shadow-[0_24px_70px_rgba(43,29,16,0.28)] sm:px-8 sm:py-10 lg:rounded-[2.25rem] lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div className="space-y-4 sm:space-y-5">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-[color:var(--color-accent)] uppercase sm:text-sm sm:tracking-[0.24em]">
                  Kenapa Pilih Kami
                </p>
                <h2 className="max-w-xl text-[1.9rem] font-semibold tracking-tight text-white sm:text-4xl">
                  Bukan sekadar tempat tidur, tapi tempat berkumpul
                </h2>
                <p className="max-w-xl text-sm leading-7 text-stone-200 sm:text-base sm:leading-8">
                  Hotel mungkin cukup untuk bermalam. Tapi bila datang bersama
                  keluarga besar atau rombongan kecil, ruang untuk berkumpul
                  lebih penting. Di Haji Saif Homestay Putatan, semua boleh
                  tinggal berdekatan dalam suasana rumah yang lebih santai.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                {whyChooseUsCards.map((card) => {
                  const Icon = card.icon;

                  return (
                  <article
                    key={card.title}
                    className="flex h-full flex-col rounded-[1.5rem] border border-white/10 bg-white/8 p-5 shadow-[0_14px_36px_rgba(15,10,7,0.22)] backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:shadow-[0_20px_42px_rgba(15,10,7,0.28)] sm:rounded-[1.75rem] sm:p-6"
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[color:var(--color-accent)]/18 bg-[color:var(--color-accent)]/14 text-[color:var(--color-accent)] shadow-[0_10px_25px_rgba(15,10,7,0.16)]">
                      <Icon size={30} strokeWidth={2} />
                    </div>
                    <div className="mt-4 flex flex-1 flex-col gap-2.5 text-center sm:mt-5 sm:gap-3">
                      <h3 className="text-lg font-semibold text-white sm:text-xl">
                        {card.title}
                      </h3>
                      <p className="text-sm leading-6 text-stone-200 sm:leading-7">
                        {card.description}
                      </p>
                    </div>
                  </article>
                );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 scroll-mt-24">
          <div className="rounded-[2rem] border border-stone-200 bg-[linear-gradient(180deg,_#fffdf8,_#f5ecdf)] px-5 py-8 shadow-[0_22px_60px_rgba(88,69,46,0.08)] sm:px-8 sm:py-10 lg:rounded-[2.25rem] lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
              <div className="space-y-4 sm:space-y-5">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-stone-500 uppercase sm:text-sm sm:tracking-[0.24em]">
                  Kemudahan / Fasiliti
                </p>
                <h2 className="max-w-xl text-[1.9rem] font-semibold tracking-tight text-stone-950 sm:text-4xl">
                  Semua yang keluarga perlukan, dah ada
                </h2>
                <p className="max-w-xl text-sm leading-7 text-stone-700 sm:text-base sm:leading-8">
                  Kami faham apa yang penting bila datang ramai-ramai. Sebab
                  itu setiap unit disediakan dengan kemudahan asas yang
                  membantu keluarga berehat, berkumpul dan bermalam dengan
                  lebih selesa.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
                {facilityChips.map((item) => {
                  const Icon = item.icon;

                  return (
                  <div
                    key={item.label}
                    className="inline-flex min-w-0 items-center gap-2 rounded-full border border-[color:var(--color-accent)]/25 bg-white/88 px-3 py-2.5 text-sm font-semibold text-stone-800 shadow-[0_10px_25px_rgba(88,69,46,0.06)] sm:px-4 sm:py-3"
                  >
                    <Icon
                      size={16}
                      strokeWidth={2}
                      className="shrink-0 text-[color:var(--color-accent-deep)]"
                    />
                    <span className="truncate sm:whitespace-nowrap">{item.label}</span>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 scroll-mt-24">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-stone-500 uppercase sm:text-sm sm:tracking-[0.24em]">
                Pilihan Unit
              </p>
              <h2 className="mt-3 text-[1.9rem] font-semibold text-stone-950 sm:text-3xl">
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

        <section className="border-y border-stone-200 bg-[color:var(--color-surface)] scroll-mt-24">
          <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <p className="text-[11px] font-semibold tracking-[0.18em] text-stone-500 uppercase sm:text-sm sm:tracking-[0.24em]">
                Galeri Haji Saif Homestay
              </p>
              <h2 className="text-[1.9rem] font-semibold text-stone-950 sm:text-3xl">
                Lihat suasana rumah, ruang tamu, bilik, dapur dan kemudahan yang disediakan.
              </h2>
              <p className="text-base leading-7 text-stone-700 sm:text-lg sm:leading-8">
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

        <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 scroll-mt-24">
          <div className="rounded-[1.75rem] border border-stone-200 bg-white p-5 shadow-[0_18px_60px_rgba(88,69,46,0.08)] sm:rounded-[2rem] sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.18em] text-stone-500 uppercase sm:text-sm sm:tracking-[0.24em]">
                  Lokasi Homestay
                </p>
                <h2 className="mt-3 text-[1.9rem] font-semibold text-stone-950 sm:text-3xl">
                  Lokasi Homestay
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-7 text-stone-700 sm:text-lg sm:leading-8">
                  Haji Saif Homestay terletak di Putatan, Sabah. Tekan butang
                  di bawah untuk buka lokasi di Google Maps. Lokasi homestay
                  sekitar ±7km dari Lapangan Terbang Antarabangsa Kota Kinabalu.
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

              <div className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-stone-50 shadow-[0_18px_50px_rgba(88,69,46,0.08)]">
                {siteConfig.mapEmbedUrl ? (
                  <iframe
                    src={siteConfig.mapEmbedUrl}
                    title="Lokasi Haji Saif Homestay Putatan"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-[320px] w-full border-0 sm:h-[360px] lg:h-[420px]"
                  />
                ) : (
                  <div className="flex h-[320px] w-full items-center justify-center bg-[linear-gradient(180deg,_#f8f1e6,_#efe3d0)] px-6 text-center text-sm font-medium text-stone-600 sm:h-[360px] lg:h-[420px]">
                    Peta Google Maps akan dikemaskini.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 scroll-mt-24">
          <div className="space-y-4">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-stone-500 uppercase sm:text-sm sm:tracking-[0.24em]">
              Cara Tempah
            </p>
            <h2 className="text-[1.9rem] font-semibold text-stone-950 sm:text-3xl">
              Isi borang, kami uruskan yang lain
            </h2>
          </div>
          <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch">
            {bookingSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div key={step.title} className="contents">
                  <div
                    className="group flex h-full flex-col rounded-[1.5rem] border border-stone-200 bg-[linear-gradient(180deg,_#fffdf8,_#fbf5eb)] p-5 shadow-[0_18px_60px_rgba(88,69,46,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(88,69,46,0.12)] sm:rounded-[2rem] sm:p-6"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--color-accent)]/14 text-[color:var(--color-accent-deep)] sm:h-12 sm:w-12">
                      <Icon size={20} strokeWidth={2} />
                    </div>
                    <p className="mt-5 text-xs font-semibold tracking-[0.18em] text-[color:var(--color-accent-deep)] uppercase">
                      {step.step}
                    </p>
                    <h3 className="mt-3 text-lg font-semibold text-stone-950 sm:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-6 text-stone-700 sm:leading-7">
                      {step.description}
                    </p>
                  </div>
                  {index < bookingSteps.length - 1 ? (
                    <div
                      aria-hidden="true"
                      className="hidden items-center justify-center md:flex"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-200 bg-white text-[color:var(--color-accent-deep)] shadow-[0_10px_24px_rgba(88,69,46,0.08)]">
                        <ArrowRight size={18} strokeWidth={2} />
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
