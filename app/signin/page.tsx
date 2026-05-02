"use client"

import { Suspense, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { ArrowRight, Loader2, Mail, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { safeCallbackUrl } from "@/lib/safe-callback-url"
import { buildHandoffUrl } from "@/lib/sso/canonical"

const GoogleGlyph = () => (
  <svg
    viewBox="0 0 18 18"
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
  >
    <path
      d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
      fill="#4285F4"
    />
    <path
      d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.55-1.85.87-3.04.87-2.34 0-4.32-1.58-5.03-3.7H.92v2.33A9 9 0 0 0 9 18z"
      fill="#34A853"
    />
    <path
      d="M3.97 10.73A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.73V4.94H.92A9 9 0 0 0 0 9c0 1.45.35 2.82.92 4.06l3.05-2.33z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58A9 9 0 0 0 9 0 9 9 0 0 0 .92 4.94l3.05 2.33C4.68 5.16 6.66 3.58 9 3.58z"
      fill="#EA4335"
    />
  </svg>
)

export default function SigninPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center py-24 text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          Preparing the doorway…
        </div>
      }
    >
      <SigninInner />
    </Suspense>
  )
}

function SigninInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = safeCallbackUrl(searchParams.get("callbackUrl"))
  const errorCode = searchParams.get("error")

  const [email, setEmail] = useState("")
  const [emailLoading, setEmailLoading] = useState(false)
  const [guestLoading, setGuestLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailExpiresAt, setEmailExpiresAt] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [generalError, setGeneralError] = useState<string | null>(
    errorCode ? friendlyError(errorCode) : null,
  )

  async function onMagicLink(e: FormEvent) {
    e.preventDefault()
    setEmailError(null)
    setGeneralError(null)
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setEmailError("Please enter a valid email address.")
      return
    }
    setEmailLoading(true)
    try {
      const res = await fetch("/api/auth/magic-link/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        delivered?: boolean
        expiresAt?: string
        error?: string
      }
      if (!res.ok || !data.delivered) {
        setEmailError(
          data.error ?? "We couldn't send the email. Please try again.",
        )
        return
      }
      setEmailSent(true)
      if (data.expiresAt) setEmailExpiresAt(data.expiresAt)
    } catch {
      setEmailError(
        "Network problem reaching the sign-in service. Please try again.",
      )
    } finally {
      setEmailLoading(false)
    }
  }

  async function onGuest() {
    setGeneralError(null)
    setGuestLoading(true)
    try {
      const result = await signIn("guest", {
        redirect: false,
        callbackUrl,
      })
      if (result?.ok) {
        router.replace(callbackUrl)
      } else {
        setGeneralError("Guest sign-in failed. Please try again.")
      }
    } catch {
      setGeneralError("Something went wrong. Please try again.")
    } finally {
      setGuestLoading(false)
    }
  }

  // Route Google sign-in through the canonical auth surface at
  // ai.thevrschool.org so all three sister sites (sof.ai,
  // www.thevrschool.org, ai.thevrschool.org) share one identity.
  function onGoogle() {
    setGeneralError(null)
    setGoogleLoading(true)
    // buildHandoffUrl encodes the next path and stamps the domain.
    // The canonical surface checks the session and either:
    //   (a) mints a bridge token and returns to /api/auth/sso/finish, or
    //   (b) shows its /signin (with Google) then bounces back here.
    const handoffUrl = buildHandoffUrl(callbackUrl)
    window.location.href = handoffUrl
  }

  return (
    <section className="relative isolate flex flex-1 flex-col items-center justify-center px-4 py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-emerald-100/60 via-orange-50/40 to-transparent"
      />

      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center font-serif text-3xl font-semibold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="mb-8 text-center text-sm text-muted-foreground">
          Sign in to continue your journey.
        </p>

        {generalError && (
          <div
            role="alert"
            className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {generalError}
          </div>
        )}

        {/* Google — canonical SSO via ai.thevrschool.org */}
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full justify-center gap-3"
          onClick={onGoogle}
          disabled={googleLoading}
        >
          {googleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <GoogleGlyph />
          )}
          Continue with Google
        </Button>

        <div className="relative my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Magic-link email */}
        {emailSent ? (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
            <p className="font-medium">Check your inbox</p>
            <p className="mt-1 text-emerald-700">
              We sent a sign-in link to <strong>{email}</strong>.
              {emailExpiresAt && (
                <> It expires at {new Date(emailExpiresAt).toLocaleTimeString()}.</>
              )}
            </p>
          </div>
        ) : (
          <form onSubmit={onMagicLink} className="space-y-3">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={emailLoading}
                  className="w-full rounded-md border border-input bg-background py-2.5 pl-9 pr-4 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                />
              </div>
              {emailError && (
                <p role="alert" className="mt-1.5 text-xs text-destructive">
                  {emailError}
                </p>
              )}
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full justify-center gap-2"
              disabled={emailLoading}
            >
              {emailLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              )}
              Send magic link
              {!emailLoading && (
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>
          </form>
        )}

        <div className="relative my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button
          type="button"
          variant="ghost"
          size="lg"
          className="w-full justify-center"
          onClick={onGuest}
          disabled={guestLoading}
        >
          {guestLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          ) : null}
          Continue as guest
        </Button>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree to be a Pioneer in good faith. No password to
          forget — your link or account is the key.
        </p>

        <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          New here?{" "}
          <Link
            href="/apply"
            className="text-foreground underline-offset-4 hover:underline"
          >
            Apply to the movement
          </Link>
        </p>
      </div>
    </section>
  )
}

function friendlyError(code: string): string {
  switch (code) {
    case "OAuthAccountNotLinked":
      return "That email is already linked to a different sign-in method."
    case "OAuthSignin":
    case "OAuthCallback":
    case "OAuthCreateAccount":
    case "Callback":
    case "BridgeTokenInvalid":
      return "Google sign-in didn't complete. Please try again."
    case "AccessDenied":
      return "Access was denied — please try a different sign-in method."
    case "CredentialsSignin":
      return "That sign-in attempt didn't succeed. Please try again."
    case "GuestBridgeRequiresEmail":
      return "Please sign in with Google or email to continue across sites."
    default:
      return "Sign-in didn't complete. Please try again."
  }
}
