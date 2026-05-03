/**
 * Bridge token MINTER — canonical auth side (ai.thevrschool.org).
 *
 * The VERIFIER lives in lib/sso/bridgeToken.ts (sof.ai gateway side)
 * and in each sister site (e.g. iTeachXR /api/auth/sso/finish.php).
 * All sides share the same NEXTAUTH_SECRET and identical token format:
 *
 *   <base64url(JSON payload)>.<base64url(HMAC-SHA256(payload, secret))>
 *
 * This module is server-only (imports node:crypto) — never import it
 * from a client component.
 */

import { createHmac, randomUUID } from "node:crypto"

/** Every host that may request a bridge token from the handoff. */
const ALLOWED_DOMAINS = new Set([
  "sof.ai",
  "thevrschool.org",
  "www.thevrschool.org",
  "ai.thevrschool.org",
  "iteachxr.com",
])

function b64urlEncode(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
}

export interface MintOptions {
  /** Authenticated user's email address. */
  sub: string
  /** Display name — best-effort, never empty. */
  name: string
  /** Avatar URL (optional). */
  image?: string | null
  /** Target host the token is bound to (must be in ALLOWED_DOMAINS). */
  aud: string
  /** Token lifetime in seconds. Defaults to 60 — enough for one redirect. */
  ttlSeconds?: number
}

/**
 * Mint a signed bridge token for a sister site.
 *
 * The target site verifies it at its own /api/auth/sso/finish endpoint.
 * The token is intentionally short-lived (60s) to limit replay risk;
 * the audience binding makes cross-site replay impossible.
 */
export function mintBridgeToken(opts: MintOptions): string {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) throw new Error("NEXTAUTH_SECRET is required to mint SSO bridge tokens")

  const { sub, name, image = null, aud, ttlSeconds = 60 } = opts
  const now = Math.floor(Date.now() / 1000)

  const payload = {
    iss: process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://ai.thevrschool.org",
    aud,
    sub,
    name,
    image,
    iat: now,
    exp: now + ttlSeconds,
    jti: randomUUID(),
  }

  const payloadB64 = b64urlEncode(Buffer.from(JSON.stringify(payload)))
  const sig = createHmac("sha256", secret).update(payloadB64).digest()
  return `${payloadB64}.${b64urlEncode(sig)}`
}

/**
 * Guard used by the handoff route to reject unknown requesting domains.
 *
 * In addition to the static allow-list, we also trust the hostname of
 * ITEACHXR_URL (set in Fly.io env) so any Railway / custom deployment
 * URL works without code changes.
 */
export function isAllowedDomain(domain: string): boolean {
  const d = domain.toLowerCase()

  // Static allow-list
  if (ALLOWED_DOMAINS.has(d)) return true

  // Dynamic: trust whatever ITEACHXR_URL is pointed at (Railway, custom domain, etc.)
  const iteachxrUrl = process.env.ITEACHXR_URL
  if (iteachxrUrl) {
    try {
      const host = new URL(iteachxrUrl).hostname.toLowerCase()
      if (d === host) return true
    } catch {
      // Malformed URL — skip
    }
  }

  return false
}
