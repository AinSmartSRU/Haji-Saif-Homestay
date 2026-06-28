import "server-only";

import { Resend } from "resend";
import { siteConfig } from "@/lib/siteConfig";

type BookingNotificationPayload = {
  createdAt: string;
  guestName: string;
  phone: string;
  unitName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  notes: string | null;
  status: string;
};

export async function sendBookingNotification(
  payload: BookingNotificationPayload,
) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured.");
    return { ok: false as const, skipped: true as const };
  }

  const resend = new Resend(apiKey);
  const to =
    process.env.BOOKING_NOTIFICATION_EMAIL ||
    siteConfig.bookingNotificationEmail;
  const adminUrl = process.env.ADMIN_DASHBOARD_URL;

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #2f2419; line-height: 1.6;">
      <h2 style="margin-bottom: 8px;">Tempahan Baru Diterima</h2>
      <p style="margin-top: 0;">Ada permintaan tempahan baru untuk Haji Saif Homestay Putatan.</p>
      <table style="border-collapse: collapse; width: 100%; max-width: 640px;">
        <tbody>
          <tr><td style="padding: 6px 0; font-weight: 600;">Nama:</td><td style="padding: 6px 0;">${payload.guestName}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600;">Telefon:</td><td style="padding: 6px 0;">${payload.phone}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600;">Unit:</td><td style="padding: 6px 0;">${payload.unitName}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600;">Check-in:</td><td style="padding: 6px 0;">${payload.checkIn}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600;">Check-out:</td><td style="padding: 6px 0;">${payload.checkOut}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600;">Jumlah tetamu:</td><td style="padding: 6px 0;">${payload.guests}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600;">Nota:</td><td style="padding: 6px 0;">${payload.notes || "-"}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600;">Status:</td><td style="padding: 6px 0;">${payload.status}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600;">Dicipta:</td><td style="padding: 6px 0;">${payload.createdAt}</td></tr>
        </tbody>
      </table>
      <p style="margin-top: 20px;">Sila semak di Admin Dashboard untuk approve, confirm, atau cancel tempahan ini.</p>
      ${
        adminUrl
          ? `<p><a href="${adminUrl}" style="color: #8d6037; font-weight: 600;">Buka Admin Dashboard</a></p>`
          : ""
      }
    </div>
  `;

  try {
    await resend.emails.send({
      from: "Haji Saif Homestay <onboarding@resend.dev>",
      to,
      subject: "Tempahan Baru Haji Saif Homestay",
      html,
    });

    return { ok: true as const };
  } catch (error) {
    console.error("Failed to send booking notification email:", error);
    return { ok: false as const, skipped: false as const };
  }
}
