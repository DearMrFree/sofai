/**
 * Admin-side type for a full Pioneer application row, including the
 * fields the public projection strips (email, review metadata).
 *
 * The FastAPI backend serializes review fields as empty strings rather
 * than null so the response shape is uniform across pending /
 * approved / declined rows; we mirror that here.
 */

import type { PioneerPathway } from "./pioneers"

export type PioneerStatus = "pending" | "approved" | "declined"

export interface PioneerApplicationRecord {
  id: number
  full_name: string
  email: string
  slug: string
  pathway: PioneerPathway
  mission_statement: string
  personal_statement: string
  identity_tags: string[]
  status: PioneerStatus
  review_note: string
  reviewed_by_email: string
  reviewed_at: string | null
  created_at: string
  updated_at: string
}
