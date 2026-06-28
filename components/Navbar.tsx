import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

const links = [
  { href: "/", label: "Utama" },
  { href: "/units", label: "Unit" },
  { href: "/booking", label: "Tempahan" },
  { href: "/admin", label: "Admin" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-[color:var(--color-surface)]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="max-w-[13rem] text-sm font-semibold tracking-[0.16em] text-stone-900 uppercase sm:max-w-none">
          {SITE_NAME}
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-2 text-sm text-stone-700 sm:gap-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 transition hover:bg-stone-200/70 hover:text-stone-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
