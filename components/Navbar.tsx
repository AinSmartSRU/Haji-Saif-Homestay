"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SITE_NAME } from "@/lib/site";

const links = [
  { href: "/", label: "Utama" },
  { href: "/units", label: "Unit" },
  { href: "/calendar", label: "Kalendar" },
  { href: "/booking", label: "Tempahan" },
  { href: "/admin", label: "Admin" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[color:var(--color-surface)]/95 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 md:py-4">
          <Link
            href="/"
            onClick={closeMenu}
            className="max-w-[11.5rem] text-[11px] font-semibold tracking-[0.13em] text-stone-900 uppercase sm:max-w-none sm:text-sm sm:tracking-[0.16em]"
          >
            {SITE_NAME}
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-stone-800 transition hover:bg-stone-50 md:hidden"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
          >
            {isOpen ? <X size={17} /> : <Menu size={17} />}
            Menu
          </button>

          <nav className="hidden flex-wrap items-center justify-end gap-2 text-sm text-stone-700 md:flex md:gap-3">
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

        {isOpen ? (
          <nav className="border-t border-stone-200/80 py-3 md:hidden">
            <div className="grid gap-2 rounded-[1.5rem] border border-stone-200 bg-white p-3 shadow-[0_14px_34px_rgba(88,69,46,0.08)]">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-stone-800 transition hover:bg-stone-100 hover:text-stone-950"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
