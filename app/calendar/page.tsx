import BookingCalendar from "@/components/BookingCalendar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-[color:var(--color-background)]">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-4xl space-y-4">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-stone-500 uppercase sm:text-sm sm:tracking-[0.24em]">
            Semak Tarikh
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Bila unit pilihan anda masih kosong?
          </h1>
          <p className="text-base leading-7 text-stone-700 sm:text-lg sm:leading-8">
            Tengok tarikh mana yang dah ada orang book untuk unit Nonamanis dan
            Serimuka.
          </p>
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-[color:var(--color-accent)]/30 bg-[color:var(--color-accent)]/10 p-4 text-sm leading-6 text-stone-700 sm:rounded-[2rem] sm:p-5 sm:leading-7">
          Tarikh yang bertanda dah ada orang book. Yang kosong masih boleh
          ditempah — kami akan confirm bila kami WhatsApp anda.
          <br />
          <br />
          Tip: Tarikh checkout orang lain boleh jadi tarikh check-in anda.
          Contoh: orang keluar 29 Jun, anda boleh masuk 29 Jun tu juga.
        </div>

        <div className="mt-8">
          <BookingCalendar />
        </div>
      </main>
      <Footer />
    </div>
  );
}
