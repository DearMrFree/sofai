import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import {
  fetchApprovedPioneers,
  pathwayTag,
  type PioneerPathway,
} from "@/lib/pioneers"

export const metadata: Metadata = {
  title: "Students",
  description: "Meet the Pioneers of the School of Freedom.",
}

/**
 * The architect (Freedom) is hand-curated — he's the founder, not an
 * applicant. Approved Pioneers come from the FastAPI backend; we
 * concatenate Freedom on top so he's always at the head of the
 * directory regardless of the row count below.
 */
interface DirectoryCard {
  slug: string
  name: string
  pathway: PioneerPathway
  opener: string
}

const ARCHITECT: DirectoryCard = {
  slug: "freedom-cheteni",
  name: "Dr. Freedom Cheteni",
  pathway: "architect",
  opener:
    "Reinvention of societal infrastructure is the only bridge towards improving the quality of life for 8 billion people.",
}

const PATHWAY_TO_STYLE: Record<PioneerPathway, { tag: string; halo: string }> = {
  architect: {
    tag: "text-amber-700 bg-amber-100/60",
    halo: "from-amber-100 to-orange-100",
  },
  vr: {
    tag: "text-indigo-700 bg-indigo-100/60",
    halo: "from-indigo-100 to-sky-100",
  },
  ai: {
    tag: "text-emerald-700 bg-emerald-100/60",
    halo: "from-emerald-100 to-orange-100",
  },
}

export default async function StudentsPage() {
  const approved = await fetchApprovedPioneers()
  const directory: DirectoryCard[] = [
    ARCHITECT,
    ...approved
      .filter((p) => p.slug !== ARCHITECT.slug)
      .map((p) => ({
        slug: p.slug,
        name: p.full_name,
        pathway: p.pathway,
        opener: p.mission_statement,
      })),
  ]

  return (
    <section className="mx-auto max-w-5xl px-4 lg:px-8 pt-12 pb-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        Pioneers · Directory
      </p>
      <h1 className="mt-6 font-serif text-5xl sm:text-6xl leading-[1.05] text-foreground">
        The named members of the{" "}
        <span className="italic text-emerald-700">movement</span>.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Every pioneer carries a slug, a pathway, and a manifesto. Each
        profile is editable by its owner. Click any card to read.
      </p>

      <div className="rule-hairline my-12" aria-hidden="true" />

      <ul className="grid gap-6 sm:grid-cols-2">
        {directory.map((p) => {
          const style = PATHWAY_TO_STYLE[p.pathway]
          return (
            <li key={p.slug}>
              <Link
                href={`/${p.slug}`}
                className="group relative block overflow-hidden rounded-2xl border border-border/60 bg-background p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${style.halo} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                />
                <div className="flex items-start gap-4">
                  <div
                    className="h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br from-emerald-700 via-emerald-500 to-orange-400 text-white flex items-center justify-center font-serif text-xl shadow-md"
                    aria-hidden="true"
                  >
                    {p.name
                      .split(/\s+/)
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-serif text-2xl text-foreground truncate">
                      {p.name}
                    </h2>
                    <p className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em]">
                      <span
                        className={`rounded-md px-2 py-0.5 ${style.tag}`}
                      >
                        {pathwayTag(p.pathway)}
                      </span>
                      <span className="text-muted-foreground">
                        · sof.ai/{p.slug}
                      </span>
                    </p>
                  </div>
                </div>
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  “{p.opener}”
                </p>
                <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                  Read profile
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </p>
              </Link>
            </li>
          )
        })}

        {/* Coming-soon placeholder — encourages the apply path. */}
        <li>
          <Link
            href="/apply"
            className="group block h-full rounded-2xl border border-dashed border-border/80 p-6 transition-colors hover:border-foreground/40"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Empty seat
            </p>
            <p className="mt-2 font-serif text-2xl text-foreground">
              Yours, if you're willing.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              The directory grows when someone applies, gets reviewed, and
              ships their first artefact.
            </p>
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
              Apply to claim it
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </p>
          </Link>
        </li>
      </ul>
    </section>
  )
}
