const fallbackAdminEmails = ["drafifisaif@gmail.com"];

function parseAdminEmails(value: string | undefined) {
  return (value ?? fallbackAdminEmails.join(","))
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function getAdminEmails() {
  return parseAdminEmails(process.env.ADMIN_EMAILS);
}

export function isAllowedAdminEmail(email: string | null | undefined) {
  if (!email) {
    return false;
  }

  return getAdminEmails().includes(email.trim().toLowerCase());
}
