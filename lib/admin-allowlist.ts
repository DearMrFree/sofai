/**
 * Pure email-allowlist check, intentionally free of NextAuth or
 * other heavy imports so it can be reused from auth callbacks
 * without creating a `lib/auth ↔ lib/admin` import cycle.
 */

const DEFAULT_ADMIN_EMAILS = ["freedom@thevrschool.org"]

export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS?.trim()
  if (!raw) return DEFAULT_ADMIN_EMAILS
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return getAdminEmails().includes(email.toLowerCase())
}
