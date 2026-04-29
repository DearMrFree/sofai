"use client"

import { Suspense, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { ArrowRight, Loader2, Mail, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  const callbackUrl = searchParams.get("callbackUrl") || "/"
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
        // Surface the recoverable error rather than rendering a fake
        // "Check your inbox" — same false-positive avoidance pattern as
        // sof-ai-repo PR #48.
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
      if (result?.error) {
        setGeneralError("Couldn't start your guest session. Please try again.")
        return
      }
      router.replace(callbackUrl)
      router.refresh()
    } finally {
      setGuestLoading(false)
    }
  }

  async function onGoogle() {
    setGeneralError(null)
    setGoogleLoading(true)
    try {
      await signIn("google", { callbackUrl })
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <section className="relative isolate flex flex-1 flex-col items-center justify-center px-4 py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-emerald-100/60 via-orange-50/40 to-transparent blur-2xl"
      />
      <div className="w-full max-w-md rounded-2xl border border-border/70 bg-background/80 p-8 shadow-sm backdrop-blur">
        <header className="mb-8 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            School of Freedom
          </span>
          <h1 className="mt-4 font-serif text-3xl text-foreground">
            Step inside the movement.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            One identity, three sites. Sign in once and your work travels with you.
          </p>
        </header>

        {generalError ? (
          <div className="mb-5 rounded-md border border-rose-200/70 bg-rose-50/70 px-3 py-2 text-sm text-rose-800">
            {generalError}
          </div>
        ) : null}

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

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-border/70" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            or
          </span>
          <span className="h-px flex-1 bg-border/70" />
        </div>

        {emailSent ? (
          <div className="rounded-lg border border-emerald-200/70 bg-emerald-50/60 p-4 text-sm text-emerald-900">
            <p className="flex items-center gap-2 font-medium">
              <Mail className="h-4 w-4" aria-hidden="true" />
              Check {email.trim().toLowerCase()}
            </p>
            <p className="mt-1.5 text-emerald-900/80">
              We sent a one-time sign-in link.
              {emailExpiresAt
                ? ` It expires shortly — open the email and click the button.`
                : null}
            </p>
            <button
              type="button"
              className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.16em] text-emerald-800 hover:text-emerald-700"
              onClick={() => {
                setEmailSent(false)
                setEmail("")
              }}
            >
              Use a different email <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <form onSubmit={onMagicLink} className="space-y-3">
            <label className="block">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Email magic link
              </span>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@school.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={emailLoading}
                required
                className="mt-1.5 block w-full rounded-md border border-border/70 bg-background px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </label>
            {emailError ? (
              <p className="text-sm text-rose-700">{emailError}</p>
            ) : null}
            <Button
              type="submit"
              size="lg"
              className="w-full justify-center gap-2"
              disabled={emailLoading}
            >
              {emailLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Mail className="h-4 w-4" aria-hidden="true" />
              )}
              Email me a sign-in link
            </Button>
          </form>
        )}

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-border/70" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            or
          </span>
          <span className="h-px flex-1 bg-border/70" />
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
      return "Google sign-in didn't complete. Please try again."
    case "AccessDenied":
      return "Access was denied — please try a different sign-in method."
    case "CredentialsSignin":
      return "That sign-in attempt didn't succeed. Please try again."
    default:
      return "Sign-in didn't complete. Please try again."
  }
}
