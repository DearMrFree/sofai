import { ArrowUpRight, BookOpenCheck, BrainCircuit, Glasses, ShieldCheck } from "lucide-react"
import { AskSofAI } from "@/components/agent/ask-sofai"
import { SITE } from "@/lib/site-config"

const cards = [
  {
    key: "vr" as const,
    icon: Glasses,
    school: SITE.schools.vr,
    prompt: "Tell me about The VR School — what can I learn there, how do I enroll, and what makes it different?",
  },
  {
    key: "ai" as const,
    icon: BrainCircuit,
    school: SITE.schools.ai,
    prompt: "Tell me about School of AI — how does AI-native learning work and how do I get started?",
  },
  {
    key: "lms" as const,
    icon: BookOpenCheck,
    school: SITE.schools.lms,
    prompt:
      "Tell me about iTeachXR — how do the dashboards, transcripts, and proof-of-learning records fit into the School of Freedom ecosystem?",
  },
]

export function SisterSchools() {
  return (
    <section id="schools" className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
      <div className="mb-12 max-w-2xl">
        <p className="font-mono text-[11px] uppercase text-muted-foreground">
          One campus · Three connected systems
        </p>
        <h2 className="mt-3 font-serif text-4xl leading-tight text-foreground sm:text-5xl">
          The gateway should make the next click obvious.
        </h2>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          The School of Freedom brand inspires the journey, School of AI
          personalizes it, The VR School explains and enrolls, and iTeachXR
          proves the learning happened.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {cards.map(({ key, icon: Icon, school, prompt }) => (
          <div
            key={key}
            className="group overflow-hidden rounded-lg border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <a
              href={school.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-36 items-center justify-center border-b border-border bg-muted/40 px-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-stone-950 text-white dark:bg-white dark:text-stone-950">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-serif text-3xl text-foreground">{school.name}</span>
              </div>
            </a>

            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <p className="font-mono text-[11px] uppercase text-muted-foreground">{school.badge}</p>
                <a
                  href={school.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-muted-foreground transition hover:text-foreground"
                  aria-label={`Open ${school.name}`}
                >
                  <ArrowUpRight className="h-5 w-5" />
                </a>
              </div>
              <p className="mt-3 font-serif text-xl text-foreground">{school.tagline}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{school.description}</p>

              <div className="mt-4 border-t border-border pt-4">
                <AskSofAI prompt={prompt} label={`Ask SofAI about ${school.name}`} variant="ghost" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
          <p>
            Profiles, sign-in, and student identity stay connected through the
            School of AI SSO bridge, while iTeachXR carries the academic record.
          </p>
        </div>
        <a
          href={SITE.auth.canonical}
          className="font-semibold text-primary transition hover:text-primary/80"
        >
          Manage identity
        </a>
      </div>
    </section>
  )
}
