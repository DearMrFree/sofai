import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { isAdminEmail } from "@/lib/admin"
import { AdminDashboard } from "./admin-dashboard"

export const metadata: Metadata = {
  title: "Admin · School of Freedom",
  description: "Approval queue for Pioneer applications.",
  robots: { index: false, follow: false },
}

// Admin pages are session-derived — never cache.
export const dynamic = "force-dynamic"

/**
 * /admin — Pioneer approval queue.
 *
 * Three states the page can render:
 *
 *   1. Signed out         → bounce to /signin?callbackUrl=/admin
 *   2. Signed in, not on  → render a 403 "not authorised" card with a
 *      the allowlist        link to swap accounts (no leak of who is
 *                           on the allowlist)
 *   3. Signed in, on the  → render the AdminDashboard client component,
 *      allowlist            which fetches the queue itself
 *
 * The actual queue mutations all flow through
 * `/api/admin/pioneer-applications/*`, which re-checks the allowlist on
 * every request — so even if the client somehow bypassed step 2, it
 * couldn't approve anything without a verified admin session.
 */
export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/signin?callbackUrl=/admin")
  }

  const email = session.user.email
  if (!isAdminEmail(email)) {
    return (
      <section className="mx-auto max-w-2xl px-4 lg:px-8 pt-20 pb-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Restricted · Access denied
        </p>
        <h1 className="mt-6 font-serif text-4xl sm:text-5xl leading-[1.05] text-foreground">
          This room is closed to{" "}
          <span className="italic text-emerald-700">{email}</span>.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The Pioneer approval queue is reviewed by a hand-curated allowlist.
          If you believe you should be on it, ask Freedom directly. Otherwise
          there is nothing here for you.
        </p>
        <div className="rule-hairline my-12" aria-hidden="true" />
        <div className="flex flex-wrap gap-3">
          <Link
            href="/students"
            className="inline-flex items-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Visit the Pioneer directory
          </Link>
          <Link
            href={`/api/auth/signout?callbackUrl=${encodeURIComponent("/signin?callbackUrl=/admin")}`}
            className="inline-flex items-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Switch accounts
          </Link>
        </div>
      </section>
    )
  }

  return <AdminDashboard adminEmail={email} />
}
