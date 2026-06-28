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
            Kalendar Tempahan
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Kalendar Tempahan
          </h1>
          <p className="text-base leading-7 text-stone-700 sm:text-lg sm:leading-8">
            Semak tarikh yang telah ditempah untuk unit Nonamanis dan Serimuka.
          </p>
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-[color:var(--color-accent)]/30 bg-[color:var(--color-accent)]/10 p-4 text-sm leading-7 text-stone-700 sm:rounded-[2rem] sm:p-5">
          Nota: Kalendar hanya menunjukkan tempahan yang telah disahkan.
          Permintaan yang masih pending belum mengunci tarikh. Tarikh checkout
          tidak dikira sebagai malam ditempah. Contoh: tempahan 27 hingga 29
          Jun bermaksud malam 27 dan 28 Jun sahaja ditempah. 29 Jun masih boleh
          dipilih untuk check-in baharu.
        </div>

        <div className="mt-8">
          <BookingCalendar />
        </div>
      </main>
      <Footer />
    </div>
  );
}
