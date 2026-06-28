import Link from "next/link";
import { buildWhatsAppUrl, SITE_LOCATION, SITE_NAME } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-950 text-stone-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-lg font-semibold">{SITE_NAME}</p>
          <p className="max-w-xl text-sm leading-6 text-stone-300">
            Homestay moden dan selesa di {SITE_LOCATION} untuk keluarga,
            kumpulan, dan pelancong yang mahukan penginapan praktikal.
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <Link
            href="/booking"
            className="rounded-full bg-[color:var(--color-accent)] px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-[color:var(--color-accent-strong)]"
          >
            Semak & Tempah
          </Link>
          <a
            href={buildWhatsAppUrl(
              "Hi, saya berminat untuk membuat tempahan di Haji Saif Homestay Putatan.",
            )}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-100 transition hover:border-stone-500 hover:bg-stone-900"
          >
            WhatsApp Kami
          </a>
        </div>
      </div>
    </footer>
  );
}
