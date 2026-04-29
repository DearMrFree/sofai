import { NextResponse } from "next/server"
import {
  fetchWithTimeout,
  getApiBaseUrl,
  internalAuthHeaders,
} from "@/lib/apiBase"
import { AdminAuthError, requireAdminEmail } from "@/lib/admin"

/**
 * Admin detail + review proxy.
 *
 *   GET    /api/admin/pioneer-applications/<id>   → full record
 *   PATCH  /api/admin/pioneer-applications/<id>   → flip status,
 *                                                   attach note,
 *                                                   fix typos
 *
 * The PATCH handler stamps `reviewed_by_email` from the verified
 * NextAuth session — the client never gets to set who approved
 * something. We deliberately drop any client-supplied
 * `reviewed_by_email` field on the floor for this reason.
 */

const VALID_STATUSES = new Set(["pending", "approved", "declined"])
const REVIEW_NOTE_MAX = 1000
const FULL_NAME_MAX = 200
const MISSION_MAX = 600
const STATEMENT_MAX = 4000
const TAGS_MAX = 8

interface PatchPayload {
  status?: unknown
  review_note?: unknown
  full_name?: unknown
  mission_statement?: unknown
  personal_statement?: unknown
  identity_tags?: unknown
}

function isString(v: unknown): v is string {
  return typeof v === "string"
}

function asTags(raw: unknown): string[] | null {
  if (!Array.isArray(raw)) return null
  const out: string[] = []
  for (const t of raw) {
    if (typeof t !== "string") continue
    const s = t.trim()
    if (!s) continue
    if (s.length > 32) {
      throw new ProxyValidationError(
        "Identity tags must be 32 characters or fewer.",
      )
    }
    out.push(s)
  }
  if (out.length > TAGS_MAX) {
    throw new ProxyValidationError(
      `At most ${TAGS_MAX} identity tags are allowed.`,
    )
  }
  return out
}

class ProxyValidationError extends Error {}

async function resolveAdminOr403(): Promise<
  { ok: true; email: string } | { ok: false; response: NextResponse }
> {
  try {
    const email = await requireAdminEmail()
    return { ok: true, email }
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return {
        ok: false,
        response: NextResponse.json({ error: err.message }, { status: 403 }),
      }
    }
    throw err
  }
}

function isValidId(raw: string): boolean {
  // Application IDs are positive integers from the FastAPI ledger.
  // Guard so we never forward `…/pioneer-applications/0` or
  // `/pioneer-applications/abc` to the upstream.
  return /^[1-9][0-9]*$/.test(raw)
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await resolveAdminOr403()
  if (!auth.ok) return auth.response

  const { id } = await ctx.params
  if (!isValidId(id)) {
    return NextResponse.json(
      { error: "Invalid application id." },
      { status: 400 },
    )
  }

  const upstream = await fetchWithTimeout(
    `${getApiBaseUrl()}/pioneer-applications/${id}`,
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

  const text = await upstream.text()
  return new Response(text, {
    status: upstream.status,
    headers: { "content-type": "application/json" },
  })
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await resolveAdminOr403()
  if (!auth.ok) return auth.response

  const { id } = await ctx.params
  if (!isValidId(id)) {
    return NextResponse.json(
      { error: "Invalid application id." },
      { status: 400 },
    )
  }

  let body: PatchPayload
  try {
    body = (await req.json()) as PatchPayload
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  // Build a forward payload from only the fields we accept. Anything
  // extra (including a client-supplied reviewed_by_email) is dropped.
  const forward: Record<string, unknown> = {}

  if (body.status !== undefined) {
    if (!isString(body.status) || !VALID_STATUSES.has(body.status)) {
      return NextResponse.json(
        { error: "status must be one of: pending, approved, declined" },
        { status: 400 },
      )
    }
    forward.status = body.status
  }

  if (body.review_note !== undefined) {
    if (!isString(body.review_note)) {
      return NextResponse.json(
        { error: "review_note must be a string." },
        { status: 400 },
      )
    }
    if (body.review_note.length > REVIEW_NOTE_MAX) {
      return NextResponse.json(
        { error: `review_note must be ≤ ${REVIEW_NOTE_MAX} characters.` },
        { status: 400 },
      )
    }
    forward.review_note = body.review_note
  }

  if (body.full_name !== undefined) {
    if (!isString(body.full_name) || body.full_name.trim().length === 0) {
      return NextResponse.json(
        { error: "full_name must be a non-empty string." },
        { status: 400 },
      )
    }
    if (body.full_name.length > FULL_NAME_MAX) {
      return NextResponse.json(
        { error: `full_name must be ≤ ${FULL_NAME_MAX} characters.` },
        { status: 400 },
      )
    }
    forward.full_name = body.full_name.trim()
  }

  if (body.mission_statement !== undefined) {
    if (!isString(body.mission_statement)) {
      return NextResponse.json(
        { error: "mission_statement must be a string." },
        { status: 400 },
      )
    }
    if (body.mission_statement.length > MISSION_MAX) {
      return NextResponse.json(
        { error: `mission_statement must be ≤ ${MISSION_MAX} characters.` },
        { status: 400 },
      )
    }
    forward.mission_statement = body.mission_statement.trim()
  }

  if (body.personal_statement !== undefined) {
    if (!isString(body.personal_statement)) {
      return NextResponse.json(
        { error: "personal_statement must be a string." },
        { status: 400 },
      )
    }
    if (body.personal_statement.length > STATEMENT_MAX) {
      return NextResponse.json(
        { error: `personal_statement must be ≤ ${STATEMENT_MAX} characters.` },
        { status: 400 },
      )
    }
    forward.personal_statement = body.personal_statement.trim()
  }

  if (body.identity_tags !== undefined) {
    try {
      const tags = asTags(body.identity_tags)
      if (tags === null) {
        return NextResponse.json(
          { error: "identity_tags must be an array of strings." },
          { status: 400 },
        )
      }
      forward.identity_tags = tags
    } catch (err) {
      if (err instanceof ProxyValidationError) {
        return NextResponse.json({ error: err.message }, { status: 400 })
      }
      throw err
    }
  }

  // Stamp the reviewer from the verified session — never the client.
  forward.reviewed_by_email = auth.email

  const upstream = await fetchWithTimeout(
    `${getApiBaseUrl()}/pioneer-applications/${id}`,
    {
      method: "PATCH",
      headers: {
        ...internalAuthHeaders(),
        "content-type": "application/json",
      },
      body: JSON.stringify(forward),
      cache: "no-store",
    },
    8000,
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

  const text = await upstream.text()
  if (!upstream.ok) {
    let detail = "Could not update the application."
    try {
      const parsed = JSON.parse(text) as { detail?: string; error?: string }
      detail = parsed.detail ?? parsed.error ?? detail
    } catch {
      // fall through with default detail
    }
    return NextResponse.json({ error: detail }, { status: upstream.status })
  }

  return new Response(text, {
    status: upstream.status,
    headers: { "content-type": "application/json" },
  })
}
