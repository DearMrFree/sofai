/**
 * GET /api/auth/sso/finish
 *
 * Cross-TLD SSO bridge — gateway side.
 *
 * The canonical auth surface (``ai.thevrschool.org``) sends visitors
 * here with a short-lived signed bridge token after they've been
 * authenticated there. We:
 *
 *   1. Verify the token (signature, expiry, audience = our host).
 *   2. Mint a fresh NextAuth-compatible JWT and set it as the local
 *      session cookie on this domain (``sof.ai``).
 *   3. Best-effort upsert the shared ``UserProfile`` row via FastAPI
 *      so identity is mirrored across all three sites.
 *   4. 302 to the (relative) ``next`` path on this gateway.
 *
 * The token is single-use in practice (it expires in 60s and the
 * canonical side mints a fresh ``jti`` each call) — we don't bother
 * tracking consumed jtis since the audience binding + expiry already
 * make replay against this host trivially limited.
 */
import { NextResponse, type NextRequest } from "next/server"
import { encode } from "next-auth/jwt"

import { verifyBridgeToken } from "@/lib/sso/bridgeToken"
import { touchUserProfile } from "@/lib/users"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// 30 days, matching NextAuth's default ``maxAge`` for JWT sessions.
const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60

function safeRelativeNext(raw: string | null): string {
  if (!raw) return "/"
  // Reject ``//`` (protocol-relative) AND ``/\`` — WHATWG URL parser
  // normalises backslashes to forward slashes for http/https, so
  // ``/\\evil.com`` resolves to ``https://evil.com/`` (open redirect).
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return "/"
  if (/[\u0000-\u001f]/.test(raw)) return "/"
  return raw
}

function expectedAudHost(req: NextRequest): string {
  // Honour NEXTAUTH_URL when set so we accept tokens minted with our
  // canonical hostname (``sof.ai``) even on Vercel preview domains
  // that have a different request host.
  const fromEnv = process.env.NEXTAUTH_URL
  if (fromEnv) {
    try {
      return new URL(fromEnv).host.toLowerCase()
    } catch {
      /* fall through */
    }
  }
  return new URL(req.url).host.toLowerCase()
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const token = url.searchParams.get("token") ?? ""
  const next = safeRelativeNext(url.searchParams.get("next"))

  const aud = expectedAudHost(req)
  const verified = verifyBridgeToken(token, aud)
  if (!verified.ok) {
    // Bounce to /signin with a generic error so a tampered/expired
    // link doesn't leak why it failed (timing/audience/signature).
    const signin = new URL("/signin", req.url)
    signin.searchParams.set("error", "BridgeTokenInvalid")
    return NextResponse.redirect(signin)
  }
  const { payload } = verified

  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: "NEXTAUTH_SECRET unset on gateway" },
      { status: 500 },
    )
  }

  // Mint a NextAuth-compatible JWT. The shape mirrors what NextAuth
  // would write itself for a magic-link login on this gateway: ``id``
  // is ``email:<address>``, plus the standard claims.
  const id = `email:${payload.sub}`
  const sessionJwt = await encode({
    secret,
    token: {
      // Default NextAuth claims:
      sub: id,
      name: payload.name,
      email: payload.sub,
      picture: payload.image ?? null,
      // Mirror the gateway's existing ``jwt`` callback so client-side
      // ``session.user.id`` keeps working.
      id,
    },
    maxAge: SESSION_MAX_AGE_SECONDS,
  })

  // Best-effort: ensure the shared row exists for this email so
  // ``sof.ai/<handle>`` and the AI School ``/u/<handle>`` page light
  // up immediately. Failures are swallowed inside the helper.
  await touchUserProfile({
    email: payload.sub,
    displayName: payload.name,
    source: "sof.ai-sso-bridge",
  })

  const useSecure =
    (process.env.NEXTAUTH_URL ?? "").startsWith("https://") ||
    process.env.NODE_ENV === "production"
  const cookieName = useSecure
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token"

  const res = NextResponse.redirect(new URL(next, req.url))
  res.cookies.set(cookieName, sessionJwt, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: useSecure,
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
  return res
}
