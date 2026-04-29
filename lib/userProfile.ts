/**
 * Read + write helpers for the shared UserProfile (FastAPI side).
 *
 * The shape mirrors `UserProfileOut` from `sof-ai-repo`'s users router.
 * Touched on first sign-in (via `lib/users.ts`), edited from `/settings`,
 * and read by `sof.ai/{slug}` and the AI School `/u/{handle}`.
 */

import {
  fetchWithTimeout,
  getApiBaseUrl,
  internalAuthHeaders,
} from "@/lib/apiBase"

export interface UserProfileRecord {
  id: number
  email: string
  handle: string
  display_name: string
  user_type: string
  tagline: string
  location: string
  goals: string[]
  strengths: string[]
  first_project: string
  twin_name: string
  twin_emoji: string
  twin_persona_seed: string
  devin_session_url: string
  photo_url: string
  created_at: string
  updated_at: string
}

export interface ProfileEditPayload {
  handle?: string
  display_name?: string
  user_type?: string
  tagline?: string
  location?: string
  goals?: string[]
  strengths?: string[]
  first_project?: string
  twin_name?: string
  twin_emoji?: string
  twin_persona_seed?: string
  devin_session_url?: string
  photo_url?: string
}

/**
 * Fetch the profile keyed on email. Returns null on 404 / network
 * failure so callers can render a clean "no row yet" state.
 */
export async function fetchUserProfileByEmail(
  email: string,
): Promise<UserProfileRecord | null> {
  const e = email.trim().toLowerCase()
  if (!e || !e.includes("@")) return null
  try {
    const r = await fetchWithTimeout(
      `${getApiBaseUrl()}/users/${encodeURIComponent(e)}`,
      { headers: internalAuthHeaders(), cache: "no-store" },
    )
    if (!r.ok) return null
    return (await r.json()) as UserProfileRecord
  } catch {
    return null
  }
}

/**
 * Patch the profile keyed on email. The caller (the gateway proxy
 * route) must have already verified the session belongs to this
 * email — FastAPI trusts X-Internal-Auth as proof of that.
 *
 * Returns the updated row on success, or `{ error, status }` on
 * upstream failure so the proxy can forward a meaningful response.
 */
export async function patchUserProfile(
  email: string,
  payload: ProfileEditPayload,
): Promise<
  | { ok: true; record: UserProfileRecord }
  | { ok: false; status: number; error: string }
> {
  const e = email.trim().toLowerCase()
  if (!e || !e.includes("@")) {
    return { ok: false, status: 400, error: "invalid email" }
  }
  try {
    const r = await fetchWithTimeout(
      `${getApiBaseUrl()}/users/profile`,
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          ...internalAuthHeaders(),
        },
        // Spread payload FIRST so the trusted, session-derived email
        // always wins. The current proxy strips email via pickEditable
        // before we get here, but `patchUserProfile` is a public export
        // — making the function itself immune to override is defence
        // in depth against a future caller that forwards an
        // un-sanitised body.
        body: JSON.stringify({ ...payload, email: e }),
        cache: "no-store",
      },
    )
    if (!r.ok) {
      let detail: string
      try {
        const body = (await r.json()) as { detail?: unknown }
        detail =
          typeof body?.detail === "string"
            ? body.detail
            : `upstream returned ${r.status}`
      } catch {
        detail = `upstream returned ${r.status}`
      }
      return { ok: false, status: r.status, error: detail }
    }
    const record = (await r.json()) as UserProfileRecord
    return { ok: true, record }
  } catch (err) {
    return {
      ok: false,
      status: 502,
      error: err instanceof Error ? err.message : "network error",
    }
  }
}
