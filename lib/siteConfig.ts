export const siteConfig = {
  siteName: "Haji Saif Homestay Putatan",
  location: "Putatan, Sabah",
  adminName: "Pn Zarina",
  whatsappDisplay: "012-886 2408",
  whatsappNumber: "60128862408",
  promoPrice: 200,
  normalPrice: 250,
  deposit: 150,
  maxGuestsPerUnit: 10,
} as const;

export function createWhatsAppLink(message: string): string {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
