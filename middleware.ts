import { NextRequest, NextResponse } from "next/server"

/**
 * Subdomain → student portfolio routing.
 *
 * [name].thevrschool.org  →  rewrite to /students/[name]
 *
 * Reserved subdomains (ai, www, api, …) are passed through untouched
 * so the canonical SSO surface at ai.thevrschool.org is never affected.
 */
const RESERVED = new Set(["www", "ai", "api", "mail", "smtp", "app", "admin", "dev"])

export function middleware(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase()
  const match = host.match(/^([a-z0-9-]+)\.thevrschool\.org$/)

  if (match) {
    const sub = match[1]
    if (!RESERVED.has(sub)) {
      const url = request.nextUrl.clone()
      const path = url.pathname
      const prefix = `/students/${sub}`
      // Only rewrite if we are not already routed to the right prefix
      if (!path.startsWith(prefix)) {
        url.pathname = prefix + (path === "/" ? "" : path)
        return NextResponse.rewrite(url)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\.ico).*)"],
}
