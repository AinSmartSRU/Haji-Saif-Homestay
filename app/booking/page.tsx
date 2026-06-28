import BookingForm from "@/components/BookingForm";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { siteConfig } from "@/lib/siteConfig";
import Link from "next/link";

type BookingPageProps = {
  searchParams: Promise<{
    unit?: string | string[];
  }>;
};

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const resolvedSearchParams = await searchParams;
  const unitValue = resolvedSearchParams.unit;
  const unitSlug = Array.isArray(unitValue) ? unitValue[0] : unitValue;

  return (
    <div className="min-h-screen bg-[color:var(--color-background)]">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <section className="overflow-hidden rounded-[2.25rem] border border-stone-800/55 bg-[linear-gradient(135deg,_#3b2d22,_#201914)] px-6 py-8 text-stone-100 shadow-[0_24px_80px_rgba(48,33,18,0.22)] sm:px-8 lg:px-10 lg:py-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
              <div className="space-y-5">
                <p className="text-sm font-semibold tracking-[0.24em] text-[color:var(--color-accent)] uppercase">
                  Tempahan
                </p>
                <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Selamatkan tarikh anda sebelum orang lain ambil
                </h1>
                <p className="max-w-2xl text-base leading-8 text-stone-200">
                  Hanya dua unit je, dan tarikh cuti sekolah selalu cepat
                  penuh. Isi borang di bawah, kami WhatsApp anda untuk sahkan
                  tempahan.
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-white/8 p-5 shadow-[0_16px_40px_rgba(12,9,7,0.18)] backdrop-blur-sm">
                <p className="text-sm font-semibold tracking-[0.2em] text-stone-300 uppercase">
                  Ringkasan tempahan
                </p>
                <div className="mt-4 divide-y divide-white/10 text-sm">
                  <div className="flex items-start justify-between gap-4 py-3">
                    <span className="text-stone-300">Harga promosi</span>
                    <span className="font-semibold text-[color:var(--color-accent)]">
                      RM{siteConfig.promoPrice} / malam
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4 py-3">
                    <span className="text-stone-400">Harga biasa</span>
                    <span className="text-stone-300 line-through decoration-stone-500">
                      RM{siteConfig.normalPrice}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4 py-3">
                    <span className="text-stone-300">Deposit</span>
                    <span className="font-semibold text-white">
                      RM{siteConfig.deposit} / unit
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4 py-3">
                    <span className="text-stone-300">Kapasiti</span>
                    <span className="font-semibold text-white">
                      Sehingga {siteConfig.maxGuestsPerUnit} orang / unit
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-stone-300">
                  Setiap rumah mempunyai 3 bilik dan sesuai untuk keluarga
                  atau kumpulan kecil.
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    href="/calendar"
                    className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-accent)]/30 bg-[color:var(--color-accent)]/12 px-4 py-2.5 text-sm font-semibold text-[color:var(--color-accent)] transition hover:bg-[color:var(--color-accent)]/18"
                  >
                    Semak kalendar tempahan
                  </Link>
                  <a
                    href={siteConfig.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/8 px-4 py-2.5 text-sm font-semibold text-stone-100 transition hover:bg-white/12"
                  >
                    Lihat lokasi homestay di Google Maps
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-stone-200 bg-white/88 p-1 shadow-[0_20px_70px_rgba(88,69,46,0.08)]">
            <BookingForm initialUnitSlug={unitSlug} />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
