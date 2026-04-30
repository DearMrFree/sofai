/**
 * Cross-TLD SSO bridge tokens (gateway-side verifier).
 *
 * Mirrors the helper on `ai.thevrschool.org` (the canonical auth
 * surface). Both sides share the same NEXTAUTH_SECRET, so a token
 * minted on the canonical side can be verified here without any
 * additional round-trip to a key endpoint.
 *
 * Format (NOT a real JWT, no header / `alg` field):
 *
 *   <base64url(JSON payload)>.<base64url(HMAC-SHA256(payload, secret))>
 *
 * Payload fields:
 *   iss     — issuer URL (the canonical auth surface)
 *   aud     — audience host (must equal this gateway's host)
 *   sub     — email of the authenticated user
 *   name    — display name (best-effort)
 *   image   — optional avatar URL
 *   iat/exp — issue + expiry timestamps (seconds since epoch)
 *   jti     — random per-token id
 */

import { createHmac, timingSafeEqual } from "node:crypto"

export interface BridgePayload {
  iss: string
  aud: string
  sub: string
  name: string
  image: string | null
  iat: number
  exp: number
  jti: string
}

function b64urlDecode(s: string): Buffer {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4))
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64")
}

function getSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is required to verify SSO bridge tokens")
  }
  return secret
}

export type VerifyBridgeResult =
  | { ok: true; payload: BridgePayload }
  | { ok: false; error: string }

/**
 * Verify a bridge token: signature, expiry, audience.
 *
 * `expectedAud` must match the host attribute the canonical side
 * stamped — that is, this gateway's host. Comparison is
 * case-insensitive.
 */
export function verifyBridgeToken(
  token: string,
  expectedAud: string,
): VerifyBridgeResult {
  if (!token || token.indexOf(".") < 0) {
    return { ok: false, error: "malformed token" }
  }
  const [payloadB64, sigB64] = token.split(".", 2)
  if (!payloadB64 || !sigB64) {
    return { ok: false, error: "malformed token" }
  }

  let secret: string
  try {
    secret = getSecret()
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }

  const expected = createHmac("sha256", secret).update(payloadB64).digest()
  let actual: Buffer
  try {
    actual = b64urlDecode(sigB64)
  } catch {
    return { ok: false, error: "malformed signature" }
  }
  if (
    actual.length !== expected.length ||
    !timingSafeEqual(actual, expected)
  ) {
    return { ok: false, error: "bad signature" }
  }

  let payload: BridgePayload
  try {
    payload = JSON.parse(b64urlDecode(payloadB64).toString("utf8"))
  } catch {
    return { ok: false, error: "malformed payload" }
  }

  const now = Math.floor(Date.now() / 1000)
  if (typeof payload.exp !== "number" || payload.exp < now) {
    return { ok: false, error: "token expired" }
  }
  if (
    typeof payload.aud !== "string" ||
    payload.aud.toLowerCase() !== expectedAud.toLowerCase()
  ) {
    return { ok: false, error: "audience mismatch" }
  }
  if (typeof payload.sub !== "string" || !payload.sub.includes("@")) {
    return { ok: false, error: "invalid subject" }
  }
  return { ok: true, payload }
}
