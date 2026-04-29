import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { patchUserProfile } from "@/lib/userProfile"
import type { ProfileEditPayload } from "@/lib/userProfile"

/**
 * /api/users/profile — self-edit proxy for the signed-in Pioneer.
 *
 * Authority model:
 *   1. NextAuth session must exist (gateway gate).
 *   2. The body's `email`, if present, MUST match the session email.
 *      We never use the body's email; we use the session's. This stops
 *      a signed-in attacker from swapping the email in the request to
 *      edit someone else's row.
 *   3. FastAPI re-checks `X-Internal-Auth` (server-only secret) to
 *      reject any request that didn't come through this proxy.
 *
 * Guests (`*@guest.sof.ai`) are blocked: their identity is intentionally
 * ephemeral, so persisting edits would clutter the directory.
 */

const ALLOWED_FIELDS: (keyof ProfileEditPayload)[] = [
  "handle",
  "display_name",
  "user_type",
  "tagline",
  "location",
  "goals",
  "strengths",
  "first_project",
  "twin_name",
  "twin_emoji",
  "twin_persona_seed",
  "devin_session_url",
  "photo_url",
]

function pickEditable(input: unknown): ProfileEditPayload {
  if (!input || typeof input !== "object") return {}
  const src = input as Record<string, unknown>
  const out: ProfileEditPayload = {}
  for (const field of ALLOWED_FIELDS) {
    if (!(field in src)) continue
    const value = src[field]
    if (value === undefined) continue
    if (field === "goals" || field === "strengths") {
      if (Array.isArray(value)) {
        out[field] = value
          .map((v) => (typeof v === "string" ? v : String(v)))
          .filter((s) => s.trim().length > 0)
      }
      continue
    }
    if (typeof value === "string") {
      out[field] = value
    } else if (value === null) {
      out[field] = ""
    }
  }
  return out
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email
  if (!email) {
    return NextResponse.json(
      { error: "Sign in required." },
      { status: 401 },
    )
  }
  if (email.endsWith("@guest.sof.ai")) {
    return NextResponse.json(
      {
        error:
          "Guest identities can't be edited. Sign in with a real email to claim a profile.",
      },
      { status: 403 },
    )
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json(
      { error: "Body must be JSON." },
      { status: 400 },
    )
  }

  const payload = pickEditable(raw)

  const result = await patchUserProfile(email, payload)
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    )
  }
  return NextResponse.json(result.record)
}
