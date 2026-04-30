/**
 * GET /api/auth/sso/signout
 *
 * Sign-out fan-out for the gateway. The canonical auth surface
 * (``ai.thevrschool.org``) redirects users here after clearing its
 * own ``.thevrschool.org`` cookie so signing out anywhere clears the
 * session everywhere.
 *
 * Query string:
 *   ?next=https://ai.thevrschool.org/   (optional; absolute URL or
 *                                         relative path on this site)
 *
 * Why GET, not POST:
 *   This is reachable from a sister-domain redirect chain and has to
 *   work with a plain browser navigation. NextAuth's built-in
 *   ``/api/auth/signout`` is POST + CSRF — fine for in-app, awkward
 *   for cross-TLD chains. We just delete the cookie ourselves.
 */
import { NextResponse, type NextRequest } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Only sister sites are allowed as ``next`` targets so a tampered
// link can't redirect users to a phishing page after signing them out.
const TRUSTED_NEXT_HOSTS = new Set([
  "sof.ai",
  "www.sof.ai",
  "ai.thevrschool.org",
  "www.thevrschool.org",
  "thevrschool.org",
  "localhost:3000",
  "localhost:3001",
])

function resolveNext(raw: string | null, requestUrl: string): string {
  if (!raw) return new URL("/", requestUrl).toString()
  // Reject ``//`` (protocol-relative) AND ``/\`` — WHATWG URL parser
  // normalises backslashes to forward slashes for http/https, so
  // ``/\\evil.com`` resolves to ``https://evil.com/`` (open redirect).
  if (raw.startsWith("/") && !raw.startsWith("//") && !raw.startsWith("/\\")) {
    // Strip control chars + CR/LF that could be smuggled into the
    // ``Location`` header. Without this, ``?next=/%0d%0aSet-Cookie:…``
    // could either crash Node's HTTP layer (preventing cookie clear)
    // or smuggle headers into the redirect response.
    if (/[\u0000-\u001f]/.test(raw)) return new URL("/", requestUrl).toString()
    return new URL(raw, requestUrl).toString()
  }
  try {
    const u = new URL(raw)
    // Reject non-HTTP(S) schemes. ``new URL('javascript://sof.ai/…').host``
    // evaluates to ``sof.ai`` so the trusted-host check alone would let
    // ``javascript:``/``data:``/``file:`` URLs through.
    if (u.protocol !== "https:" && u.protocol !== "http:") {
      return new URL("/", requestUrl).toString()
    }
    if (TRUSTED_NEXT_HOSTS.has(u.host.toLowerCase())) {
      return u.toString()
    }
  } catch {
    /* fall through */
  }
  return new URL("/", requestUrl).toString()
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const next = resolveNext(url.searchParams.get("next"), req.url)

  const useSecure =
    (process.env.NEXTAUTH_URL ?? "").startsWith("https://") ||
    process.env.NODE_ENV === "production"
  const cookieName = useSecure
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token"

  const res = NextResponse.redirect(next)
  // No domain attribute on this gateway (host-only cookie). Match
  // the same options NextAuth wrote it with so the browser actually
  // accepts the deletion.
  res.cookies.set(cookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: useSecure,
    maxAge: 0,
  })
  for (const suffix of [".0", ".1", ".2"]) {
    res.cookies.set(cookieName + suffix, "", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: useSecure,
      maxAge: 0,
    })
  }
  return res
}
