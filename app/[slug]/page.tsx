import type { Metadata } from "next"
import { notFound } from "next/navigation"

interface PioneerProfile {
  slug: string
  name: string
  pathway: "Architect" | "VR" | "AI"
  state: "Dreaming" | "Building" | "Launching" | "Liberating"
  opener: string
  body: string
  projects: { title: string; status: "Dreaming" | "Building" | "Launching" | "Liberating"; description: string }[]
  tags: string[]
}

/**
 * Static profile data — until the /apply flow lands in the shared
 * Postgres, the only public profile is the founder. The shape of this
 * record matches the future Postgres `profiles` row exactly so swapping
 * the source is one line in this file.
 */
const PROFILES: Record<string, PioneerProfile> = {
  "freedom-cheteni": {
    slug: "freedom-cheteni",
    name: "Dr. Freedom Cheteni",
    pathway: "Architect",
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

const STATE_TO_STYLE: Record<PioneerProfile["state"], string> = {
  Dreaming: "text-emerald-700 bg-emerald-100/60 ring-emerald-200",
  Building: "text-amber-700 bg-amber-100/60 ring-amber-200",
  Launching: "text-orange-700 bg-orange-100/60 ring-orange-200",
  Liberating: "text-rose-700 bg-rose-100/60 ring-rose-200",
}

const PATHWAY_LABEL: Record<PioneerProfile["pathway"], string> = {
  Architect: "Architect",
  VR: "Pioneer · The VR School",
  AI: "Pioneer · The AI School",
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const profile = PROFILES[params.slug]
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

export default function ProfilePage({ params }: { params: { slug: string } }) {
  const profile = PROFILES[params.slug]
  if (!profile) notFound()

  return (
    <article>
      <section className="mx-auto max-w-5xl px-4 lg:px-8 pt-16 pb-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {PATHWAY_LABEL[profile.pathway]} · sof.ai/{profile.slug}
        </p>

        <h1 className="mt-6 font-serif text-5xl sm:text-6xl leading-[1.05]">
          <span className="bg-gradient-to-br from-foreground via-emerald-700 to-orange-600 bg-clip-text text-transparent">
            {profile.name}
          </span>
        </h1>

        <p className="mt-3 inline-flex items-center gap-2 rounded-md ring-1 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em]">
          <span className={STATE_TO_STYLE[profile.state]}>
            <span className="px-1">{profile.state}</span>
          </span>
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 lg:px-8 pb-12">
        <div className="rule-hairline mb-10" aria-hidden="true" />
        <blockquote className="font-serif text-2xl sm:text-3xl leading-snug text-foreground">
          <span aria-hidden="true" className="text-orange-500">“</span>
          {profile.opener}
          <span aria-hidden="true" className="text-orange-500">”</span>
        </blockquote>
        <p className="mt-8 leading-relaxed text-foreground">{profile.body}</p>
      </section>

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
    </article>
  )
}
