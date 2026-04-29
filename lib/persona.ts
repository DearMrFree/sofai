/**
 * Tiny persona generator for one-click guest entry on the gateway. The
 * AI School app has a richer 29K-name pool; here we only need enough
 * variety for a Pioneer to walk through `/apply` without typing anything,
 * then decide to commit a real slug if their application is approved.
 *
 * Format: "<adjective>-<noun>-<3 digits>" → 7K * 6K * 1K = ~42M.
 * Display name is the title-cased pair, e.g. "Curious Architect".
 */
const ADJECTIVES = [
  "curious",
  "patient",
  "restless",
  "quiet",
  "bold",
  "reflective",
  "resolute",
  "tender",
  "fierce",
  "kind",
  "lucid",
  "warm",
  "honest",
  "deliberate",
  "wandering",
]

const NOUNS = [
  "architect",
  "scribe",
  "wayfarer",
  "builder",
  "gardener",
  "navigator",
  "weaver",
  "smith",
  "potter",
  "tinkerer",
  "rambler",
  "diplomat",
  "scholar",
  "dreamer",
  "planter",
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T
}

const titleCase = (s: string): string =>
  s
    .split("-")
    .map((p) => (p.length > 0 ? p[0]!.toUpperCase() + p.slice(1) : p))
    .join(" ")

export function generatePersona(): { handle: string; displayName: string } {
  const adj = pick(ADJECTIVES)
  const noun = pick(NOUNS)
  const n = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  const handle = `${adj}-${noun}-${n}`
  return { handle, displayName: `${titleCase(adj)} ${titleCase(noun)}` }
}

/** Best-effort display name from an email when the user hasn't set one. */
export function displayNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? ""
  return titleCase(local.replace(/[._]+/g, "-"))
}
