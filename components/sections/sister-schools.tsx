import { ArrowUpRight, BrainCircuit, Glasses, ShieldCheck } from "lucide-react"
import { SISTER_SCHOOLS } from "@/lib/utils"

const cards = [
  {
    key: "vr" as const,
    icon: Glasses,
    badge: "Accredited VR pathway",
    title: SISTER_SCHOOLS.vr.name,
    tagline: "Learn by doing. Earn by proving.",
    body:
      "WASC-accredited virtual reality education with immersive labs, UC A-G approved courses, and business-ready proof of learning.",
    href: SISTER_SCHOOLS.vr.href,
    label: "Open The VR School",
  },
  {
    key: "ai" as const,
    icon: BrainCircuit,
    badge: "Agentic learning pathway",
    title: SISTER_SCHOOLS.ai.name,
    tagline: "Build with AI agents alongside you.",
    body:
      "An AI-native school where humans work with agents on real software, journals, reviews, and public learning artifacts.",
    href: SISTER_SCHOOLS.ai.href,
    label: "Open School of AI",
  },
]

export function SisterSchools() {
  return (
    <section id="schools" className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
      <div className="mb-12 max-w-2xl">
        <p className="font-mono text-[11px] uppercase text-muted-foreground">
          Two schools · One identity
        </p>
        <h2 className="mt-3 font-serif text-4xl leading-tight text-foreground sm:text-5xl">
          The gateway should make the next click obvious.
        </h2>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          The School of Freedom brand points visitors into the school that best
          fits their goal while keeping identity, profile, and mission aligned.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {cards.map(({ key, icon: Icon, badge, title, tagline, body, href, label }) => (
          <a
            key={key}
            href={href}
            className="group overflow-hidden rounded-lg border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <div className="flex h-36 items-center justify-center border-b border-border bg-muted/40 px-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-stone-950 text-white dark:bg-white dark:text-stone-950">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-serif text-3xl text-foreground">
                  {title}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <p className="font-mono text-[11px] uppercase text-muted-foreground">
                  {badge}
                </p>
                <ArrowUpRight
                  className="h-5 w-5 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                  aria-hidden="true"
                />
              </div>
              <h3 className="mt-3 font-serif text-3xl text-foreground">
                {title}
              </h3>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {tagline}
              </p>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {body}
              </p>

              <p className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                {label}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </p>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
          <p>
            Profiles, sign-in, and student identity stay connected through the
            School of AI SSO bridge.
          </p>
        </div>
        <a
          href={SISTER_SCHOOLS.ai.href}
          className="font-semibold text-primary transition hover:text-primary/80"
        >
          Manage identity
        </a>
      </div>
    </section>
  )
}
