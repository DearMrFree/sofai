/**
 * API base URL for the shared FastAPI (sof-ai-repo backend on Fly).
 *
 * The canonical Fly host is `sofai.fly.dev` — that's where the
 * Pioneer / agent / journal / wallet routes are actually deployed.
 * The previous `sof-ai-api-zaushktv.fly.dev` host was an early
 * orphaned alias that no longer points at the live app and times
 * out under load (FUNCTION_INVOCATION_TIMEOUT on Vercel).
 *
 * Override per-deploy with `API_BASE_URL` (server-only) or
 * `NEXT_PUBLIC_API_BASE_URL` (browser-exposed).
 */
export function getApiBaseUrl(): string {
  return (
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "https://sofai.fly.dev"
  )
}

/**
 * Default per-request timeout for SSR fetches against the FastAPI
 * backend. Vercel functions have a ~10s budget; we keep below that
 * so a slow/dead upstream surfaces as a clean 404 (notFound) or a
 * skipped directory rather than a FUNCTION_INVOCATION_TIMEOUT 504.
 */
export const API_FETCH_TIMEOUT_MS = 4000

/**
 * Fetch wrapper that aborts after `API_FETCH_TIMEOUT_MS`. Use for
 * any SSR call to the FastAPI backend. Returns the upstream Response
 * on success; throws on timeout/network failure (callers should
 * catch and degrade gracefully).
 */
export async function fetchWithTimeout(
  url: string,
  init?: RequestInit,
  timeoutMs: number = API_FETCH_TIMEOUT_MS,
): Promise<Response> {
  const ctl = new AbortController()
  const timer = setTimeout(() => ctl.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: ctl.signal })
  } finally {
    clearTimeout(timer)
  }
}
