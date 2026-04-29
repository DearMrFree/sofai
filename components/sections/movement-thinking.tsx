import { Compass, Hammer, Rocket, Sprout } from "lucide-react"

/**
 * "Movement Thinking" — the philosophical engine of the school. Four named
 * states (Dreaming → Building → Launching → Liberating) that visually
 * function as a horizontal manifesto, NOT a feature grid. Each tile carries
 * a verb, a quoted line, and an icon. Read like a four-stanza poem.
 */
const STATES = [
  {
    icon: Sprout,
    verb: "Dreaming",
    line:
      "Permission to be unsure. The first state of the movement is the willingness to be wrong out loud.",
    accent: "text-emerald-700",
    halo: "from-emerald-100 to-emerald-50",
  },
  {
    icon: Hammer,
    verb: "Building",
    line:
      "Where the manifesto becomes a Pull Request. We turn the lecture into a labour and the labour into a portfolio.",
    accent: "text-amber-700",
    halo: "from-amber-100 to-amber-50",
  },
  {
    icon: Rocket,
    verb: "Launching",
    line:
      "Ship before you are ready. The movement only exists when other people are using what you made.",
    accent: "text-orange-600",
    halo: "from-orange-100 to-orange-50",
  },
  {
    icon: Compass,
    verb: "Liberating",
    line:
      "Pass the torch. A school of freedom finishes its job when the student has out-grown the school.",
    accent: "text-rose-600",
    halo: "from-rose-100 to-rose-50",
  },
]

export function MovementThinking() {
  return (
    <section className="border-y border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 lg:px-8 py-16 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Movement Thinking
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl text-foreground max-w-2xl">
              Four states a learner moves through. Not levels. Not grades.{" "}
              <span className="italic text-emerald-700">States of being.</span>
            </h2>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATES.map(({ icon: Icon, verb, line, accent, halo }) => (
            <article
              key={verb}
              className="group relative rounded-2xl border border-border/60 bg-background p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br ${halo} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
              />
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg bg-background ring-1 ring-border ${accent}`}
                aria-hidden="true"
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3
                className={`mt-5 font-serif text-2xl ${accent} flex items-baseline gap-2`}
              >
                {verb}
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
                  aria-hidden="true"
                >
                  · state
                </span>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {line}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
