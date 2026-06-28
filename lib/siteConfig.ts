export const siteConfig = {
  siteName: "Haji Saif Homestay Putatan",
  location: "Putatan, Sabah",
  adminName: "Pn Zarina",
  whatsappDisplay: "012-886 2408",
  whatsappNumber: "60128862408",
  mapUrl: "https://maps.app.goo.gl/PsAgNW342m4i1QHv6",
  promoPrice: 195,
  normalPrice: 250,
  deposit: 100,
  maxGuestsPerUnit: 10,
} as const;

export function createWhatsAppLink(message: string): string {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
