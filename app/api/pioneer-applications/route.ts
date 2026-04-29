import { NextResponse } from "next/server"
import { fetchWithTimeout, getApiBaseUrl } from "@/lib/apiBase"

/**
 * Public submission proxy for the multi-step manifesto form.
 *
 * Forwards a Pioneer application to the AI School FastAPI's
 * `/pioneer-applications` route (which writes to the shared Postgres so
 * the applicant's identity is unified across sof.ai +
 * ai.thevrschool.org + thevrschool.org once approved). The route is
 * thin on purpose — we re-validate on the server side of FastAPI, not
 * here, so the gateway never trusts client input but also never
 * duplicates the validation logic in two places.
 *
 * The 409 conflict cases (slug already claimed, email already on
 * file) are surfaced verbatim from FastAPI so the form can render a
 * useful error to the visitor without inventing its own taxonomy.
 */

interface SubmitPayload {
  full_name?: unknown
  email?: unknown
  slug?: unknown
  pathway?: unknown
  mission_statement?: unknown
  personal_statement?: unknown
  identity_tags?: unknown
}

const VALID_PATHWAYS = new Set(["architect", "vr", "ai"])

function isString(v: unknown): v is string {
  return typeof v === "string"
}

function asTags(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((t): t is string => typeof t === "string").slice(0, 8)
}

export async function POST(req: Request) {
  let body: SubmitPayload
  try {
    body = (await req.json()) as SubmitPayload
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  if (
    !isString(body.full_name) ||
    !isString(body.email) ||
    !isString(body.slug) ||
    !isString(body.pathway) ||
    !isString(body.mission_statement) ||
    !isString(body.personal_statement)
  ) {
    return NextResponse.json(
      { error: "Missing or malformed required fields." },
      { status: 400 },
    )
  }

  if (!VALID_PATHWAYS.has(body.pathway)) {
    return NextResponse.json(
      { error: "Pathway must be one of: architect, vr, ai." },
      { status: 400 },
    )
  }

  // 8s timeout — POST is more expensive than the SSR reads (writes
  // hit the DB + may upsert UserProfile on approve) but still under
  // Vercel's 10s budget so a hung Fly upstream surfaces as a clean
  // 502 the form can render.
  const upstream = await fetchWithTimeout(
    `${getApiBaseUrl()}/pioneer-applications`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        full_name: body.full_name.trim(),
        email: body.email.trim(),
        slug: body.slug.trim(),
        pathway: body.pathway,
        mission_statement: body.mission_statement.trim(),
        personal_statement: body.personal_statement.trim(),
        identity_tags: asTags(body.identity_tags),
      }),
      // Don't cache on edge — every submission must hit the origin.
      cache: "no-store",
    },
    8000,
  ).catch((err) => {
    return new Response(
      JSON.stringify({
        error: `Could not reach the application service. ${
          err instanceof Error ? err.message : "Unknown network error."
        }`,
      }),
      { status: 502, headers: { "content-type": "application/json" } },
    )
  })

  // Pass through the upstream status + body. FastAPI returns
  // {"detail": "..."} on 4xx/5xx; we normalise to {"error": "..."}
  // so the form has a single shape to render.
  const text = await upstream.text()
  if (!upstream.ok) {
    let detail = "The application could not be saved."
    try {
      const parsed = JSON.parse(text) as { detail?: string; error?: string }
      detail = parsed.detail ?? parsed.error ?? detail
    } catch {
      // fall through with default detail
    }
    return NextResponse.json({ error: detail }, { status: upstream.status })
  }

  // 201 Created from FastAPI; pass through.
  return new Response(text, {
    status: upstream.status,
    headers: { "content-type": "application/json" },
  })
}
