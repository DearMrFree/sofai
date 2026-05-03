/**
 * GET /api/auth/sso/handoff
 *
 * Cross-TLD SSO handoff — canonical auth side (ai.thevrschool.org).
 *
 * Sister sites (sof.ai, iTeachXR, www.thevrschool.org) redirect
 * unauthenticated visitors here with a `domain` param. We:
 *
 *   1. Validate the requesting domain against the ecosystem allow-list.
 *   2. Check for an active NextAuth session on this domain.
 *   3. If none → redirect to /signin with this URL as callbackUrl so
 *      the user lands back here after Google / magic-link auth.
 *   4. If session exists → mint a 60-second bridge token bound to the
 *      requesting domain, then 302 to that domain's finish endpoint.
 *
 * Query params:
 *   domain  — e.g. "iteachxr.com"  (required)
 *   next    — relative path on the target site, default "/"
 *
 * Environment:
 *   ITEACHXR_URL  — override the iTeachXR deployment base URL
 *                   (defaults to https://iteachxr.com); set this in
 *                   your Fly.io / Vercel env to the Railway URL.
 */

import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

import { authOptions } from "@/lib/auth"
import { mintBridgeToken, isAllowedDomain } from "@/lib/sso/bridgeToken.server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** Resolve the base URL for a given domain. */
function siteBase(domain: string): string {
  const d = domain.toLowerCase()
  if (d === "iteachxr.com" || d.endsWith(".iteachxr.com")) {
    return (process.env.ITEACHXR_URL ?? "https://iteachxr.com").replace(/\/$/, "")
  }
  if (d === "sof.ai") return "https://sof.ai"
  if (d === "thevrschool.org" || d === "www.thevrschool.org") return "https://www.thevrschool.org"
  return `https://${d}`
}

function safeNext(raw: string | null): string {
  if (!raw) return "/"
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return "/"
  if (/[\u0000-\u001f]/.test(raw)) return "/"
  return raw
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const domain = (searchParams.get("domain") ?? "").trim().toLowerCase()
  const next = safeNext(searchParams.get("next"))

  // ── 1. Validate domain ────────────────────────────────────────────────────
  if (!domain || !isAllowedDomain(domain)) {
    return NextResponse.json(
      { error: `Domain "${domain}" is not in the School of Freedom ecosystem allow-list.` },
      { status: 400 },
    )
  }

  // ── 2. Check session ──────────────────────────────────────────────────────
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    // Not signed in — bounce to /signin, then back here so the user
    // lands in the right sister site after authenticating once.
    const signinUrl = new URL("/signin", req.url)
    signinUrl.searchParams.set("callbackUrl", req.url)
    return NextResponse.redirect(signinUrl)
  }

  // ── 3. Mint bridge token ──────────────────────────────────────────────────
  let token: string
  try {
    token = mintBridgeToken({
      sub: session.user.email,
      name: session.user.name ?? session.user.email.split("@")[0],
      image: session.user.image ?? null,
      aud: domain,
      ttlSeconds: 60,
    })
  } catch (err) {
    console.error("[sso/handoff] mint error:", err)
    return NextResponse.json({ error: "Failed to mint bridge token" }, { status: 500 })
  }

  // ── 4. Redirect to target site's finish endpoint ──────────────────────────
  const base = siteBase(domain)
  const finish = new URL("/api/auth/sso/finish", base)
  finish.searchParams.set("token", token)
  if (next !== "/") finish.searchParams.set("next", next)

  return NextResponse.redirect(finish)
}
