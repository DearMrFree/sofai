import { BadgeCheck, Fingerprint, Rocket, Waypoints } from "lucide-react"
  import { AskSofAI } from "@/components/agent/ask-sofai"
  import { SITE } from "@/lib/site-config"

  const PILLAR_ICONS = [Fingerprint, Waypoints, Rocket, BadgeCheck]

  export function MovementThinking() {
    const { pillars, tagline, description } = SITE.movementThinking
    return (
      <section className="bg-stone-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="font-mono text-[11px] uppercase text-emerald-300">Movement Thinking</p>
              <h2 className="mt-3 max-w-xl font-serif text-4xl leading-tight sm:text-5xl">{tagline}</h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-white/66">{description}</p>

              <div className="mt-6">
                <AskSofAI
                  prompt="Explain Movement Thinking — what are its four pillars and why does this philosophy matter for education?"
                  label="Ask SofAI about Movement Thinking"
                  variant="ghost"
                  className="text-emerald-300 hover:text-emerald-100"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {pillars.map(({ name, description: body }, i) => {
                const Icon = PILLAR_ICONS[i]!
                return (
                  <article key={name} className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
                    <Icon className="h-5 w-5 text-orange-300" aria-hidden="true" />
                    <h3 className="mt-4 font-sans text-base font-semibold text-white">{name}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/62">{body}</p>
                    <div className="mt-3">
                      <AskSofAI
                        prompt={`Tell me more about the "${name}" pillar in Movement Thinking.`}
                        label={`Ask about ${name}`}
                        variant="ghost"
                        className="text-white/40 hover:text-emerald-300 text-[11px]"
                      />
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    )
  }
  