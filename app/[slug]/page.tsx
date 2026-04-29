import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  fetchPioneerBySlug,
  pathwayLabel,
  type PioneerPathway,
  type PioneerProfile,
} from "@/lib/pioneers"

/**
 * Public profile renderer.
 *
 * Reads from the FastAPI `/pioneer-applications/by-slug/<slug>` route
 * (only returns approved rows). Falls back to a hand-curated record
 * for the architect (`freedom-cheteni`) so the founder profile
 * doesn't depend on him going through the application flow.
 */

interface ArchitectProfile {
  slug: string
  name: string
  pathway: PioneerPathway
  state: "Dreaming" | "Building" | "Launching" | "Liberating"
  opener: string
  body: string
  projects: { title: string; status: "Dreaming" | "Building" | "Launching" | "Liberating"; description: string }[]
  tags: string[]
}

const ARCHITECTS: Record<string, ArchitectProfile> = {
  "freedom-cheteni": {
    slug: "freedom-cheteni",
    name: "Dr. Freedom Cheteni",
    pathway: "architect",
    state: "Liberating",
    opener:
      "Reinvention of societal infrastructure is the only bridge towards improving the quality of life for 8 billion people.",
    body:
      "Educator, technologist, and architect of Movement Thinking. Founder of The VR School (WASC-accredited, UC A-G approved), The AI School (an AI-native classroom shipping real software with Devin/Claude/Gemini), and the unifying School of Freedom.",
    projects: [
      {
        title: "The VR School",
        status: "Launching",
        description:
          "A virtual reality high school where a student in Harare and a student in Palo Alto sit in the same classroom.",
      },
      {
        title: "The AI School",
        status: "Building",
        description:
          "An AI-native classroom where students ship Pull Requests with Devin and draft scholarly journals with Claude.",
      },
      {
        title: "Moonshot Innovation Diploma",
        status: "Liberating",
        description:
          "A transcript that measures preparedness for the automation economy, not compliance with it.",
      },
    ],
    tags: ["education", "policy", "VR", "AI", "moonshot"],
  },
}

const STATE_TO_STYLE: Record<ArchitectProfile["state"], string> = {
  Dreaming: "text-emerald-700 bg-emerald-100/60 ring-emerald-200",
  Building: "text-amber-700 bg-amber-100/60 ring-amber-200",
  Launching: "text-orange-700 bg-orange-100/60 ring-orange-200",
  Liberating: "text-rose-700 bg-rose-100/60 ring-rose-200",
}

interface RenderedProfile {
  slug: string
  name: string
  pathway: PioneerPathway
  state: ArchitectProfile["state"] | null
  opener: string
  body: string
  projects: ArchitectProfile["projects"] | null
  tags: string[]
}

function fromArchitect(p: ArchitectProfile): RenderedProfile {
  return {
    slug: p.slug,
    name: p.name,
    pathway: p.pathway,
    state: p.state,
    opener: p.opener,
    body: p.body,
    projects: p.projects,
    tags: p.tags,
  }
}

function fromPioneer(p: PioneerProfile): RenderedProfile {
  return {
    slug: p.slug,
    name: p.full_name,
    pathway: p.pathway,
    state: null,
    opener: p.mission_statement,
    body: p.personal_statement,
    projects: null,
    tags: p.identity_tags,
  }
}

async function loadProfile(slug: string): Promise<RenderedProfile | null> {
  // `Object.hasOwn` (not `in`) — `in` walks the prototype chain, so
  // /constructor, /toString etc would resolve to native Object members
  // and crash the SSR with `tags: undefined`.
  if (Object.hasOwn(ARCHITECTS, slug)) return fromArchitect(ARCHITECTS[slug])
  const pioneer = await fetchPioneerBySlug(slug)
  return pioneer ? fromPioneer(pioneer) : null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const profile = await loadProfile(slug)
  if (!profile) return { title: "Not found" }
  return {
    title: profile.name,
    description: profile.opener,
    openGraph: {
      title: `${profile.name} · School of Freedom`,
      description: profile.opener,
    },
  }
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const profile = await loadProfile(slug)
  if (!profile) notFound()

  return (
    <article>
      <section className="mx-auto max-w-5xl px-4 lg:px-8 pt-16 pb-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {pathwayLabel(profile.pathway)} · sof.ai/{profile.slug}
        </p>

        <h1 className="mt-6 font-serif text-5xl sm:text-6xl leading-[1.05]">
          <span className="bg-gradient-to-br from-foreground via-emerald-700 to-orange-600 bg-clip-text text-transparent">
            {profile.name}
          </span>
        </h1>

        {profile.state ? (
          <p className="mt-3 inline-flex items-center gap-2 rounded-md ring-1 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em]">
            <span className={STATE_TO_STYLE[profile.state]}>
              <span className="px-1">{profile.state}</span>
            </span>
          </p>
        ) : null}
      </section>

      <section className="mx-auto max-w-3xl px-4 lg:px-8 pb-12">
        <div className="rule-hairline mb-10" aria-hidden="true" />
        <blockquote className="font-serif text-2xl sm:text-3xl leading-snug text-foreground">
          <span aria-hidden="true" className="text-orange-500">“</span>
          {profile.opener}
          <span aria-hidden="true" className="text-orange-500">”</span>
        </blockquote>
        <p className="mt-8 leading-relaxed text-foreground whitespace-pre-line">
          {profile.body}
        </p>
      </section>

      {profile.projects && profile.projects.length > 0 ? (
        <section className="mx-auto max-w-5xl px-4 lg:px-8 pb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-4">
            Active projects
          </p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {profile.projects.map((p) => (
              <li
                key={p.title}
                className="rounded-2xl border border-border/60 bg-background p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-md"
              >
                <p
                  className={`inline-flex font-mono text-[10px] uppercase tracking-[0.2em] rounded-md px-2 py-0.5 ring-1 ${STATE_TO_STYLE[p.status]}`}
                >
                  {p.status}
                </p>
                <h3 className="mt-3 font-serif text-xl text-foreground">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {p.description}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {profile.tags.length > 0 ? (
        <section className="mx-auto max-w-5xl px-4 lg:px-8 pb-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-4">
            Identity tags
          </p>
          <ul className="flex flex-wrap gap-2">
            {profile.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-border bg-background px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
              >
                {tag}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  )
}
