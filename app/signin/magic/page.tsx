"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Loader2 } from "lucide-react"
import { safeCallbackUrl } from "@/lib/safe-callback-url"

/**
 * Magic-link landing page. Receives ?token=… from the email link, hands
 * the token to the `magic-link` CredentialsProvider for verification +
 * sign-in, and bounces to the callbackUrl on success. Renders a
 * recoverable error card on failure (expired link, already used, etc.).
 */
export default function MagicLinkLandingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center py-24 text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          Reading your sign-in link…
        </div>
      }
    >
      <MagicLinkInner />
    </Suspense>
  )
}

function MagicLinkInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""
  // Reject attacker-controlled cross-origin callback URLs. Without this,
  // ?callbackUrl=https://evil.com would let a crafted email link open-
  // redirect anyone who clicks it after a successful sign-in.
  const callbackUrl = safeCallbackUrl(searchParams.get("callbackUrl"))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    if (!token) {
      setError("This link is missing its token. Try requesting a new one.")
      return () => undefined
    }
    void (async () => {
      try {
        const result = await signIn("magic-link", {
          token,
          redirect: false,
          callbackUrl,
        })
        if (cancelled) return
        if (!result || result.error) {
          setError(
            "This sign-in link is invalid or has expired. Please request a new one.",
          )
          return
        }
        router.replace(callbackUrl)
        router.refresh()
      } catch {
        if (!cancelled) {
          setError("Something went wrong reading your link. Please try again.")
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [token, callbackUrl, router])

  return (
    <section className="relative isolate flex flex-1 flex-col items-center justify-center px-4 py-24">
      <div className="w-full max-w-md rounded-2xl border border-border/70 bg-background/80 p-8 text-center shadow-sm backdrop-blur">
        {error ? (
          <>
            <h1 className="font-serif text-3xl text-foreground">
              That link can't be used.
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">{error}</p>
            <Link
              href="/signin"
              className="mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-700 underline-offset-4 hover:underline"
            >
              Request another sign-in link
            </Link>
          </>
        ) : (
          <>
            <Loader2
              className="mx-auto h-6 w-6 animate-spin text-emerald-700"
              aria-hidden="true"
            />
            <h1 className="mt-4 font-serif text-3xl text-foreground">
              Signing you in…
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              One moment while we verify your sign-in link.
            </p>
          </>
        )}
      </div>
    </section>
  )
}
