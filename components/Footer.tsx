import Link from "next/link";
import { buildWhatsAppUrl, SITE_LOCATION, SITE_NAME } from "@/lib/site";
import { siteConfig } from "@/lib/siteConfig";

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
          <div className="space-y-1 pt-2 text-sm text-stone-300">
            <p>Admin: {siteConfig.adminName}</p>
            <p>
              WhatsApp:{" "}
              <a
                href={buildWhatsAppUrl(
                  `Hi ${siteConfig.adminName}, saya ingin bertanya tentang ${siteConfig.siteName}.`,
                )}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-[color:var(--color-accent)]"
              >
                {siteConfig.whatsappDisplay}
              </a>
            </p>
            <p>Lokasi: {siteConfig.location}</p>
            <p>
              <a
                href={siteConfig.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-[color:var(--color-accent)]"
              >
                Buka Google Maps
              </a>
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Link
            href="/booking"
            className="rounded-full bg-[color:var(--color-accent)] px-5 py-3 text-center text-sm font-semibold text-stone-950 transition hover:bg-[color:var(--color-accent-strong)]"
          >
            Semak & Tempah
          </Link>
          <a
            href={buildWhatsAppUrl(
              `Hi ${siteConfig.adminName}, saya ingin bertanya tentang ${siteConfig.siteName}.`,
            )}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-stone-700 px-5 py-3 text-center text-sm font-semibold text-stone-100 transition hover:border-stone-500 hover:bg-stone-900"
          >
            WhatsApp Kami
          </a>
        </div>
      </div>
    </footer>
  );
}
