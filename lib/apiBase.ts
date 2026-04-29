/**
 * API base URL for the AI School FastAPI (sof-ai-repo backend on Fly).
 *
 * The new sof.ai gateway shares the same Postgres + magic-link
 * infrastructure as the AI School app, so we proxy server-side calls
 * (magic-link mint, future application persistence) into that backend
 * via this base URL. Override per-deploy with NEXT_PUBLIC_API_BASE_URL
 * (public, also exposed to the browser) or API_BASE_URL (server-only).
 */
export function getApiBaseUrl(): string {
  return (
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "https://sof-ai-api-zaushktv.fly.dev"
  )
}
