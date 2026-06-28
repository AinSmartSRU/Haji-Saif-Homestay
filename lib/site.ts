import { siteConfig, createWhatsAppLink } from "@/lib/siteConfig";

export const SITE_NAME = siteConfig.siteName;
export const SITE_LOCATION = siteConfig.location;
export const SITE_TAGLINE =
  "2 unit rumah homestay bersebelahan, sesuai untuk keluarga dan kumpulan.";

export const homepageUnits = [
  {
    name: "Nonamanis",
    slug: "nonamanis",
    description:
      "Rumah 3 bilik yang selesa untuk keluarga besar, rombongan kecil, dan penginapan santai di Putatan.",
  },
  {
    name: "Serimuka",
    slug: "serimuka",
    description:
      "Unit bersebelahan dengan susun atur praktikal, sesuai untuk kumpulan yang mahu menginap dekat antara satu sama lain.",
  },
] as const;

export const facilities = [
  "2 unit homestay bersebelahan untuk tempahan berkumpulan",
  "3 bilik tidur bagi setiap rumah",
  `Ruang sesuai untuk sehingga ${siteConfig.maxGuestsPerUnit} tetamu setiap unit`,
  `Harga promosi RM${siteConfig.promoPrice} semalam`,
  `Deposit hanya RM${siteConfig.deposit} bagi setiap unit`,
  "Lokasi mudah diakses untuk keluarga, pelancong, dan urusan kerja",
];

export const bookingSteps = [
  "Pilih unit yang sesuai dan semak maklumat penginapan.",
  "Isi borang tempahan dengan tarikh, jumlah tetamu, dan keperluan anda.",
  "Hantar permintaan tempahan dan terus hubungi kami melalui WhatsApp untuk pengesahan.",
];

export type Unit = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  bedrooms: number | null;
  max_guests: number | null;
  normal_price: number | string | null;
  promo_price: number | string | null;
  deposit: number | string | null;
  is_active?: boolean | null;
  created_at?: string | null;
};

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type Booking = {
  id: string;
  unit_id: string;
  guest_name: string;
  phone: string;
  check_in: string;
  check_out: string;
  guests: number;
  notes: string | null;
  status: BookingStatus;
  created_at: string;
};

export type BookingWithUnit = Booking & {
  units: {
    name: string;
    slug: string;
  } | null;
};

export type BookingWithUnitRow = Booking & {
  units:
    | {
        name: string;
        slug: string;
      }[]
    | {
        name: string;
        slug: string;
      }
    | null;
};

export function formatCurrency(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("ms-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function buildWhatsAppUrl(message: string) {
  return createWhatsAppLink(message);
}

export function normalizeMalaysianWhatsAppNumber(phone: string) {
  const cleaned = phone.replace(/[\s\-+()]/g, "");

  if (cleaned.startsWith("60") && cleaned.length >= 10) {
    return cleaned;
  }

  if (cleaned.startsWith("0") && cleaned.length >= 10) {
    return `60${cleaned.slice(1)}`;
  }

  return null;
}
