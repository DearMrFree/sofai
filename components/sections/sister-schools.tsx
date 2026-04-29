import { ArrowUpRight, Glasses, Sparkles } from "lucide-react"
import { SISTER_SCHOOLS } from "@/lib/utils"

/**
 * The two sister schools — high-fidelity cards. Each one carries its own
 * visual identity (VR = navy/cyan, AI = emerald/orange) so the gateway
 * doesn't flatten them into a single brand. Hover lifts the card and
 * reveals the deep-link affordance.
 */
const CARDS = [
  {
    key: "vr" as const,
    icon: Glasses,
    badge: "Pathway · Immersive",
    title: SISTER_SCHOOLS.vr.name,
    tagline: "Learn by doing. Earn by proving.",
    body:
      "WASC-accredited virtual reality high school. UC A-G approved courses, immersive labs, real artefacts in your portfolio.",
    href: SISTER_SCHOOLS.vr.href,
    accent: "from-sky-600 via-indigo-600 to-violet-600",
    glow: "from-sky-100 to-indigo-100",
    label: "Open The VR School",
  },
  {
    key: "ai" as const,
    icon: Sparkles,
    badge: "Pathway · Agentic",
    title: SISTER_SCHOOLS.ai.name,
    tagline: "Build with AI agents alongside you.",
    body:
      "An AI-native classroom where students collaborate with Devin, Claude, and Gemini on real Pull Requests, journals, and shipped products.",
    href: SISTER_SCHOOLS.ai.href,
    accent: "from-emerald-600 via-emerald-500 to-orange-500",
    glow: "from-emerald-100 to-orange-100",
    label: "Open The AI School",
  },
]

export function SisterSchools() {
  return (
    <section className="mx-auto max-w-6xl px-4 lg:px-8 py-20">
      <div className="mb-12 max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Two pathways · One movement
        </p>
        <h2 className="mt-3 font-serif text-3xl sm:text-4xl text-foreground">
          Pick the doorway that matches{" "}
          <span className="italic text-emerald-700">how you build</span>.
        </h2>
        <p className="mt-3 text-muted-foreground">
          Both are accredited members of the School of Freedom. Both use the
          same Movement Thinking philosophy. They differ in the medium of
          practice — immersive VR labs, or shipping software with AI agents.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {CARDS.map(({ key, icon: Icon, badge, title, tagline, body, href, accent, glow, label }) => (
          <a
            key={key}
            href={href}
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${glow} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
            />

            <div className="flex items-start justify-between gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-md bg-gradient-to-br ${accent}`}
                aria-hidden="true"
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <ArrowUpRight
                className="h-5 w-5 text-muted-foreground transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                aria-hidden="true"
              />
            </div>

            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {badge}
            </p>
            <h3 className="mt-2 font-serif text-3xl text-foreground">{title}</h3>
            <p className="mt-1 text-sm font-medium text-foreground">{tagline}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {body}
            </p>

            <p className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
              {label}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </p>
          </a>
        ))}
      </div>
    </section>
  )
}
