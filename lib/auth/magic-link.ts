/**
 * Magic-link client — proxies to the AI School FastAPI's
 * ``/auth/magic-link/{request,verify}`` routes so the database stays
 * single-owner. The mint endpoint returns a token + email + expiry; the
 * verify endpoint atomically consumes the token (single-use, expiring)
 * and returns the verified email.
 *
 * Both functions throw a tagged ``MagicLinkError`` whose ``status``
 * mirrors the FastAPI HTTP status, so callers can map 429 → friendly
 * rate-limit message, 410 → "link expired", 404/409 → "link already
 * used or invalid", etc.
 */
import { getApiBaseUrl } from "@/lib/apiBase"

export class MagicLinkError extends Error {
  status: number
  detail: string
  constructor(status: number, detail: string) {
    super(`magic-link ${status}: ${detail}`)
    this.status = status
    this.detail = detail
    this.name = "MagicLinkError"
  }
}

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (process.env.INTERNAL_API_KEY) {
    headers["X-Internal-Auth"] = process.env.INTERNAL_API_KEY
  }
  return headers
}

async function safeJson(
  res: Response,
): Promise<{ detail?: string } & Record<string, unknown>> {
  try {
    return (await res.json()) as { detail?: string } & Record<string, unknown>
  } catch {
    return {}
  }
}

export interface MagicLinkRequestResult {
  token: string
  email: string
  expiresAt: string
}

export async function requestMagicLink(
  email: string,
  meta?: { ipHash?: string; userAgent?: string },
): Promise<MagicLinkRequestResult> {
  const res = await fetch(`${getApiBaseUrl()}/auth/magic-link/request`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      email,
      ip_hash: meta?.ipHash ?? "",
      user_agent: meta?.userAgent ?? "",
    }),
    cache: "no-store",
  })
  if (!res.ok) {
    const body = await safeJson(res)
    throw new MagicLinkError(
      res.status,
      typeof body.detail === "string"
        ? body.detail
        : `request failed (${res.status})`,
    )
  }
  const json = (await res.json()) as {
    token: string
    email: string
    expires_at: string
  }
  return {
    token: json.token,
    email: json.email,
    expiresAt: json.expires_at,
  }
}

export async function verifyMagicLinkToken(token: string): Promise<string> {
  const res = await fetch(`${getApiBaseUrl()}/auth/magic-link/verify`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ token }),
    cache: "no-store",
  })
  if (!res.ok) {
    const body = await safeJson(res)
    throw new MagicLinkError(
      res.status,
      typeof body.detail === "string"
        ? body.detail
        : `verify failed (${res.status})`,
    )
  }
  const json = (await res.json()) as { email: string }
  return json.email
}
