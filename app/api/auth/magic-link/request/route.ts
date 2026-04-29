import { NextResponse } from "next/server"
import { createHash } from "node:crypto"
import { MagicLinkError, requestMagicLink } from "@/lib/auth/magic-link"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * POST /api/auth/magic-link/request
 *
 * Body: { email }
 * Response: { delivered: boolean, expiresAt?: string, error?: string }
 *
 * Flow:
 *   1. Validate the email shape.
 *   2. Mint a token via the AI School FastAPI (single-source-of-truth so
 *      a token issued here is verifiable by `ai.thevrschool.org` too).
 *   3. Send the magic-link email via Resend with a /signin/magic?token=…
 *      URL that lands the verifier on this site.
 *
 * The response always returns 200 *unless* delivery fails — the client
 * surfaces a "Check your inbox" success card only when delivered=true,
 * matching the false-positive fix shipped on sof-ai-repo PR #48.
 */
export async function POST(req: Request) {
  let payload: { email?: unknown }
  try {
    payload = (await req.json()) as { email?: unknown }
  } catch {
    return NextResponse.json(
      { delivered: false, error: "Invalid JSON body." },
      { status: 400 },
    )
  }

  const email =
    typeof payload.email === "string" ? payload.email.trim().toLowerCase() : ""
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json(
      { delivered: false, error: "Please provide a valid email address." },
      { status: 400 },
    )
  }

  const ipHash = ipHashFromHeaders(req.headers)
  const userAgent = req.headers.get("user-agent") ?? ""

  try {
    const minted = await requestMagicLink(email, { ipHash, userAgent })

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      // Without Resend configured we can't deliver — surface honestly so
      // the client renders the recoverable-error path, not a fake
      // "Check your inbox".
      return NextResponse.json(
        {
          delivered: false,
          error:
            "Email delivery isn't configured for this environment yet. Please use the guest sign-in for now.",
        },
        { status: 502 },
      )
    }

    const from =
      process.env.EMAIL_FROM ?? "School of Freedom <onboarding@resend.dev>"
    const link = `https://sof.ai/signin/magic?token=${encodeURIComponent(
      minted.token,
    )}`

    // Resend HTTPS API — no SDK dep, just fetch. Avoids long-lived SMTP
    // connections (Vercel functions are short-lived) and keeps the
    // dependency surface tight.
    const sent = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: email,
        subject: "Your sign-in link · School of Freedom",
        html: renderEmail(link),
      }),
      cache: "no-store",
    })
    if (!sent.ok) {
      return NextResponse.json(
        {
          delivered: false,
          error: "We couldn't send the email. Please try again in a moment.",
        },
        { status: 502 },
      )
    }
    return NextResponse.json({ delivered: true, expiresAt: minted.expiresAt })
  } catch (err) {
    if (err instanceof MagicLinkError) {
      const status = err.status >= 400 && err.status < 600 ? err.status : 502
      return NextResponse.json(
        { delivered: false, error: err.detail },
        { status },
      )
    }
    return NextResponse.json(
      { delivered: false, error: "Something went wrong. Please try again." },
      { status: 502 },
    )
  }
}

function ipHashFromHeaders(headers: Headers): string {
  // Best-effort IP — Vercel forwards via x-forwarded-for. Hash so we
  // never persist a raw IP through the FastAPI rate-limiter.
  const fwd = headers.get("x-forwarded-for") ?? ""
  const first = fwd.split(",")[0]?.trim() ?? ""
  if (!first) return ""
  return createHash("sha256").update(first).digest("hex")
}

function renderEmail(link: string): string {
  return `<!doctype html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#fffaf0;padding:32px;color:#18181b">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e7e0d2;border-radius:14px;padding:32px">
    <p style="font-family:'Instrument Serif',Georgia,serif;font-size:32px;line-height:1.1;margin:0 0 16px;color:#18181b">
      Welcome to the<br/>School of Freedom
    </p>
    <p style="margin:0 0 24px;color:#57534e;line-height:1.6">
      Click the link below to sign in. It works once and expires shortly.
    </p>
    <p style="margin:0 0 28px">
      <a href="${link}" style="display:inline-block;background:#047857;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:600">
        Sign in to sof.ai
      </a>
    </p>
    <p style="margin:0 0 8px;color:#57534e;font-size:13px">
      Or paste this link into your browser:
    </p>
    <p style="margin:0;color:#57534e;font-size:13px;word-break:break-all">
      <a href="${link}" style="color:#047857">${link}</a>
    </p>
    <hr style="border:none;border-top:1px solid #e7e0d2;margin:28px 0"/>
    <p style="margin:0;color:#a8a29e;font-size:12px;letter-spacing:0.18em;text-transform:uppercase">
      School of Freedom · Movement Thinking
    </p>
  </div>
</body></html>`
}
