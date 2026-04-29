/**
 * Canonical auth surface for the School of Freedom ecosystem.
 *
 * `ai.thevrschool.org` owns sign-in for all three sister sites
 * (sof.ai · www.thevrschool.org · ai.thevrschool.org). The other
 * sites defer to it via the SSO bridge — see
 * `app/api/auth/sso/finish/route.ts` for the gateway side and
 * `lib/sso/bridgeToken.ts` for the verification helper.
 *
 * Override with `NEXT_PUBLIC_CANONICAL_AUTH_URL` for staging.
 */

export const CANONICAL_AUTH_URL =
  process.env.NEXT_PUBLIC_CANONICAL_AUTH_URL?.replace(/\/$/, "") ||
  "https://ai.thevrschool.org"

/**
 * Build the URL the navbar's "Sign in" button should jump to. The
 * canonical handoff endpoint takes care of two cases:
 *
 *   1. User is already signed in there → mints a bridge token and
 *      302s back to `sof.ai/api/auth/sso/finish?token=…&next=…`
 *      so the local cookie is set without the user retyping anything.
 *   2. User is not signed in → AI School's /signin appears, then
 *      bounces back to the same handoff URL on success.
 *
 * `next` is a relative path on this gateway (the path the user
 * should land on after the round-trip). Defaults to "/".
 */
export function buildHandoffUrl(next: string = "/"): string {
  // Strip protocol/host if a caller accidentally hands us a full URL.
  let safeNext = next
  if (/^https?:\/\//.test(safeNext)) {
    try {
      safeNext = new URL(safeNext).pathname || "/"
    } catch {
      safeNext = "/"
    }
  }
  if (!safeNext.startsWith("/") || safeNext.startsWith("//")) {
    safeNext = "/"
  }
  // Tell the canonical side which sister site to bridge into. Today
  // we hardcode sof.ai since that's the only TLD this gateway runs
  // on; if we ever rehost on a different domain, change this here.
  const url = new URL("/api/auth/sso/handoff", CANONICAL_AUTH_URL)
  url.searchParams.set("domain", "sof.ai")
  if (safeNext !== "/") url.searchParams.set("next", safeNext)
  return url.toString()
}

/**
 * Build the URL the "Sign out" button should jump to. The full
 * fan-out chain:
 *
 *   1. /api/auth/sso/signout on this gateway clears the local cookie
 *   2. its `next` redirects to the canonical /api/auth/sso/signout
 *      which clears the .thevrschool.org cookie (covers ai. + apex)
 *   3. its `next` redirects back to sof.ai
 */
export function buildSignOutChain(next: string = "/"): string {
  const home = `https://sof.ai${next.startsWith("/") ? next : "/"}`
  const canonicalLeg = new URL(
    "/api/auth/sso/signout",
    CANONICAL_AUTH_URL,
  )
  canonicalLeg.searchParams.set("next", home)
  return `/api/auth/sso/signout?next=${encodeURIComponent(canonicalLeg.toString())}`
}
