/**
 * Server-only client for the FastAPI users routes.
 *
 * Used by the NextAuth signIn callback to ensure a UserProfile row
 * exists in the shared Postgres for every Pioneer the moment they
 * sign in — without forcing them through the /welcome wizard first.
 * Identity is unified by email; the wizard fills in the rest later.
 */

import { fetchWithTimeout, getApiBaseUrl, internalAuthHeaders } from "@/lib/apiBase"

const TOUCH_TIMEOUT_MS = 4000

interface TouchUserInput {
  email: string
  displayName?: string | null
  source?: string
}

/**
 * Fire-and-(mostly-)forget upsert called from the signIn callback.
 *
 * The contract is "best-effort" — sign-in must NOT fail because the
 * shared identity store is briefly unreachable. Logs and swallows
 * everything below NextAuth so the user still gets through the door,
 * and the next sign-in (or the /settings editor when they reach it)
 * will retry the upsert.
 *
 * Skips guest accounts (`*@guest.sof.ai`) — those identities are
 * ephemeral and intentionally not persisted to the shared user table
 * (otherwise every random visitor would clutter the admin directory
 * and the AI School's `/u` listing).
 */
export async function touchUserProfile(input: TouchUserInput): Promise<void> {
  const email = input.email?.trim().toLowerCase()
  if (!email || !email.includes("@")) return
  if (email.endsWith("@guest.sof.ai")) return

  const body = {
    email,
    display_name: input.displayName?.trim() || "",
    source: input.source ?? "sof.ai",
  }

  try {
    const res = await fetchWithTimeout(
      `${getApiBaseUrl()}/users/touch`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...internalAuthHeaders(),
        },
        body: JSON.stringify(body),
        cache: "no-store",
      },
      TOUCH_TIMEOUT_MS,
    )
    if (!res.ok) {
      // Drain the body so the connection is reusable; do not let the
      // upstream error escape into NextAuth.
      await res.text().catch(() => "")
      console.warn(
        `[auth] /users/touch returned ${res.status} for ${email}; sign-in continues.`,
      )
    }
  } catch (err) {
    console.warn(
      `[auth] /users/touch failed for ${email}: ${
        err instanceof Error ? err.message : String(err)
      }; sign-in continues.`,
    )
  }
}
