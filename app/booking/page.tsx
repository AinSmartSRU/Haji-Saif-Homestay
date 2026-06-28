import BookingForm from "@/components/BookingForm";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

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
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="rounded-[2rem] bg-[linear-gradient(160deg,_#f6efe1,_#fffdf8)] p-8 shadow-[0_20px_80px_rgba(88,69,46,0.12)]">
            <p className="text-sm font-semibold tracking-[0.24em] text-stone-500 uppercase">
              Tempahan
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-950">
              Hantar permintaan booking anda
            </h1>
            <p className="mt-4 text-base leading-8 text-stone-700">
              Isi borang untuk memilih unit, tarikh check-in, dan jumlah
              tetamu. Selepas borang dihantar, anda boleh terus sambung ke
              WhatsApp untuk mempercepatkan pengesahan.
            </p>

            <div className="mt-8 space-y-4 rounded-[1.5rem] border border-white/70 bg-white/75 p-5 text-sm leading-7 text-stone-700">
              <p>Harga promosi: RM200 semalam</p>
              <p>Harga biasa: RM250 semalam</p>
              <p>Deposit: RM150 setiap unit</p>
              <p>Setiap unit mempunyai 3 bilik dan muat sehingga 10 tetamu.</p>
            </div>
          </section>

          <BookingForm initialUnitSlug={unitSlug} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
