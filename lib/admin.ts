import { getServerSession, type Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { isAdminEmail } from "@/lib/admin-allowlist"

export { getAdminEmails, isAdminEmail } from "@/lib/admin-allowlist"

/**
 * Server-side guard for admin routes. Reads the NextAuth session and
 * returns the verified admin email; throws otherwise. Use from server
 * components and route handlers — not from client components (the
 * client can't be trusted with this check).
 */
export async function requireAdminEmail(): Promise<string> {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email
  if (!email || !isAdminEmail(email)) {
    throw new AdminAuthError("Admin access required.")
  }
  return email.toLowerCase()
}

export function isAdminSession(session: Session | null): boolean {
  return isAdminEmail(session?.user?.email ?? null)
}

export class AdminAuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "AdminAuthError"
  }
}
