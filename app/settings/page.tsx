import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { buildHandoffUrl, buildUpgradeSignInUrl } from "@/lib/sso/canonical"
import { fetchUserProfileByEmail } from "@/lib/userProfile"
import { SettingsForm } from "./settings-form"

export const metadata: Metadata = {
  title: "Settings · School of Freedom",
  description: "Edit your Pioneer profile and upload an avatar.",
  robots: { index: false, follow: false },
}

// Settings is session-derived — never cache.
export const dynamic = "force-dynamic"

/**
 * /settings — self-edit your Pioneer profile.
 *
 * Three states the page can render:
 *
 *   1. Signed out         → bounce to /signin?callbackUrl=/settings
 *   2. Signed in as guest → render an "upgrade" card explaining that
 *                            ephemeral guests can't claim a profile
 *                            (sign in with a real email instead)
 *   3. Signed in for real → fetch the UserProfile row and render the
 *                            editable form. If no row exists yet (e.g.
 *                            FastAPI was unreachable when the signIn
 *                            callback fired), seed the form with sane
 *                            defaults derived from the session.
 */
export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect(buildHandoffUrl("/settings"))
  }

  const email = session.user.email
  if (email.endsWith("@guest.sof.ai")) {
    return (
      <section className="mx-auto max-w-2xl px-4 lg:px-8 pt-20 pb-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Guest · No profile
        </p>
        <h1 className="mt-6 font-serif text-4xl sm:text-5xl leading-[1.05] text-foreground">
          Guests can{" "}
          <span className="italic text-emerald-700">visit</span>, but only
          named members hold a profile.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Sign in with a real email — magic-link or Google — and your row
          appears across all three sister schools the moment the cookie
          lands.
        </p>
        <div className="rule-hairline my-12" aria-hidden="true" />
        <div className="flex flex-wrap gap-3">
          <Link
            href={buildUpgradeSignInUrl("/settings")}
            className="inline-flex items-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90"
          >
            Switch to a real account
          </Link>
          <Link
            href="/students"
            className="inline-flex items-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Visit the directory
          </Link>
        </div>
      </section>
    )
  }

  const profile = await fetchUserProfileByEmail(email)

  return (
    <section className="mx-auto max-w-3xl px-4 lg:px-8 pt-12 pb-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        Settings · {email}
      </p>
      <h1 className="mt-6 font-serif text-5xl sm:text-6xl leading-[1.05] text-foreground">
        Tell us how you want to{" "}
        <span className="italic text-emerald-700">show up</span>.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Your profile renders at <code className="font-mono">sof.ai/{profile?.handle ?? "your-handle"}</code>{" "}
        and on the AI School directory. Edit anything below; nothing is
        public until you save.
      </p>

      <div className="rule-hairline my-12" aria-hidden="true" />

      <SettingsForm
        email={email}
        initialProfile={profile}
        sessionDisplayName={session.user.name ?? ""}
      />
    </section>
  )
}
