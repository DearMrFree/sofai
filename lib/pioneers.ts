import { fetchWithTimeout, getApiBaseUrl } from "./apiBase"

/**
 * Read-side helpers for approved Pioneers.
 *
 * The FastAPI backend exposes two public read routes — `/pioneer-
 * applications/by-slug/<slug>` for a single profile and `/pioneer-
 * applications/approved` for the directory. Both return a public-safe
 * projection (no email, no review fields). These helpers wrap them
 * with sane defaults (no-store cache so approvals show up on the
 * gateway without a redeploy) and a friendly TS shape.
 *
 * The static "freedom-cheteni" record is rendered alongside the
 * database results — Freedom is the architect; he's not a Pioneer
 * applicant. Until he applies through the same flow (which would
 * defeat the point), keep him as a hand-curated record.
 */

export type PioneerPathway = "architect" | "vr" | "ai"

export interface PioneerProfile {
  full_name: string
  slug: string
  pathway: PioneerPathway
  mission_statement: string
  personal_statement: string
  identity_tags: string[]
  approved_at: string
}

const DEFAULT_LIMIT = 50

/**
 * Fetch a single approved Pioneer by slug. Returns null if not
 * approved, doesn't exist, or the upstream is unreachable.
 */
export async function fetchPioneerBySlug(
  slug: string,
): Promise<PioneerProfile | null> {
  try {
    const r = await fetchWithTimeout(
      `${getApiBaseUrl()}/pioneer-applications/by-slug/${encodeURIComponent(slug)}`,
      { cache: "no-store" },
    )
    if (!r.ok) return null
    return (await r.json()) as PioneerProfile
  } catch {
    return null
  }
}

/**
 * Fetch the directory of approved Pioneers. Returns an empty list
 * if the upstream is unreachable so the page still renders.
 */
export async function fetchApprovedPioneers(
  limit: number = DEFAULT_LIMIT,
): Promise<PioneerProfile[]> {
  try {
    const r = await fetchWithTimeout(
      `${getApiBaseUrl()}/pioneer-applications/approved?limit=${limit}`,
      { cache: "no-store" },
    )
    if (!r.ok) return []
    const data = (await r.json()) as PioneerProfile[]
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

/**
 * Convert a backend pathway code into the human-readable label
 * rendered on the directory cards and profile pages.
 */
export function pathwayLabel(pathway: PioneerPathway): string {
  switch (pathway) {
    case "architect":
      return "Architect"
    case "vr":
      return "Pioneer · The VR School"
    case "ai":
      return "Pioneer · The AI School"
  }
}

/**
 * Short tag form for the directory card chip.
 */
export function pathwayTag(pathway: PioneerPathway): string {
  switch (pathway) {
    case "architect":
      return "Architect"
    case "vr":
      return "VR"
    case "ai":
      return "AI"
  }
}
