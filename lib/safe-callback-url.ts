/**
 * Sanitise an attacker-controlled `callbackUrl` query parameter before
 * handing it to `router.replace()` or any browser navigation.
 *
 * Without this, `?callbackUrl=https://evil.com` would let the sign-in
 * page open-redirect any visitor who follows a crafted link. NextAuth
 * itself validates callbacks server-side against `NEXTAUTH_URL`, but
 * post-sign-in client-side `router.replace(callbackUrl)` calls re-open
 * the same hole — so we keep an explicit allow-list here.
 *
 * Rules:
 *   - Only same-origin paths (leading "/", not "//foo") are returned.
 *   - Absolute URLs are accepted only if their origin matches one of the
 *     trusted hosts (sof.ai today; future entries can be added here).
 *   - Anything else falls back to the supplied default ("/" by default).
 */
const TRUSTED_ORIGINS = new Set<string>(["https://sof.ai"])

export function safeCallbackUrl(
  raw: string | null | undefined,
  fallback: string = "/",
): string {
  if (!raw) return fallback
  const candidate = raw.trim()
  if (!candidate) return fallback

  // Same-origin path. Reject "//evil.com" (protocol-relative) — those
  // resolve as a different origin in the browser.
  if (candidate.startsWith("/") && !candidate.startsWith("//")) {
    return candidate
  }

  // Absolute URL — only allow if origin matches the trusted set.
  try {
    const url = new URL(candidate)
    if (TRUSTED_ORIGINS.has(url.origin)) {
      return `${url.pathname}${url.search}${url.hash}` || "/"
    }
  } catch {
    // Not a parseable URL — fall through to fallback.
  }

  return fallback
}
