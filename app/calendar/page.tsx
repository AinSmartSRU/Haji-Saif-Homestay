import BookingCalendar from "@/components/BookingCalendar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-[color:var(--color-background)]">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl space-y-4">
          <p className="text-sm font-semibold tracking-[0.24em] text-stone-500 uppercase">
            Kalendar Tempahan
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-stone-950">
            Kalendar Tempahan
          </h1>
          <p className="text-lg leading-8 text-stone-700">
            Semak tarikh yang telah ditempah untuk unit Nonamanis dan Serimuka.
          </p>
        </div>

        <div className="mt-8 rounded-[2rem] border border-[color:var(--color-accent)]/30 bg-[color:var(--color-accent)]/10 p-5 text-sm leading-7 text-stone-700">
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
