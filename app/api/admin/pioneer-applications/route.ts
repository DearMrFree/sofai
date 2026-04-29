import { NextResponse } from "next/server"
import {
  fetchWithTimeout,
  getApiBaseUrl,
  internalAuthHeaders,
} from "@/lib/apiBase"
import { AdminAuthError, requireAdminEmail } from "@/lib/admin"

/**
 * Admin list proxy — GET /api/admin/pioneer-applications.
 *
 * Forwards to the internal-auth FastAPI route after verifying the
 * NextAuth session belongs to a Freedom-allowlisted email. Two layers
 * of defence: the gateway refuses the request without an admin
 * cookie, and the FastAPI backend refuses anything missing the
 * X-Internal-Auth shared secret. Either failing is enough.
 *
 * Status filter defaults to "pending" because that's the only useful
 * default for the dashboard. Limit/offset pass through.
 */

const VALID_STATUSES = new Set(["pending", "approved", "declined", "all"])

export async function GET(req: Request) {
  let adminEmail: string
  try {
    adminEmail = await requireAdminEmail()
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: 403 })
    }
    throw err
  }

  const url = new URL(req.url)
  const status = (url.searchParams.get("status") ?? "pending").toLowerCase()
  if (!VALID_STATUSES.has(status)) {
    return NextResponse.json(
      { error: "status must be one of: pending, approved, declined, all" },
      { status: 400 },
    )
  }
  const limit = url.searchParams.get("limit") ?? "50"
  const offset = url.searchParams.get("offset") ?? "0"

  // FastAPI exposes `?status=…` (no value = all). We collapse our
  // sentinel "all" to the empty filter for forwarding.
  const upstreamParams = new URLSearchParams({ limit, offset })
  if (status !== "all") upstreamParams.set("status", status)

  const upstream = await fetchWithTimeout(
    `${getApiBaseUrl()}/pioneer-applications?${upstreamParams.toString()}`,
    { headers: internalAuthHeaders(), cache: "no-store" },
  ).catch((err: unknown) => {
    return new Response(
      JSON.stringify({
        error: `Could not reach the application service. ${
          err instanceof Error ? err.message : "Unknown network error."
        }`,
      }),
      { status: 502, headers: { "content-type": "application/json" } },
    )
  })

  // Audit hint: forward who's reading. The FastAPI list route doesn't
  // currently log this, but a future audit table can pick it up
  // without changing the proxy's contract.
  void adminEmail

  const text = await upstream.text()
  return new Response(text, {
    status: upstream.status,
    headers: { "content-type": "application/json" },
  })
}
