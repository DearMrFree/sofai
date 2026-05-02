import { BadgeCheck, Fingerprint, Rocket, Waypoints } from "lucide-react"

const pillars = [
  {
    icon: Fingerprint,
    title: "Identity",
    body:
      "Every learner begins with a named mission and an editable public profile.",
  },
  {
    icon: Waypoints,
    title: "Pathway",
    body:
      "The gateway routes people to the right school, program, or partnership track.",
  },
  {
    icon: Rocket,
    title: "Practice",
    body:
      "Learning becomes visible through VR labs, agentic projects, journals, and shipped work.",
  },
  {
    icon: BadgeCheck,
    title: "Proof",
    body:
      "Profiles, portfolios, approvals, and accredited pathways give the movement a credible business edge.",
  },
]

export function MovementThinking() {
  return (
    <section className="bg-stone-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="font-mono text-[11px] uppercase text-emerald-300">
              Movement Thinking
            </p>
            <h2 className="mt-3 max-w-xl font-serif text-4xl leading-tight sm:text-5xl">
              A philosophy that can sell, teach, and scale.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/66">
              School of Freedom should feel like the front door to a serious
              educational company: poetic enough to be memorable, structured
              enough for families, sponsors, districts, and partners to act.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {pillars.map(({ icon: Icon, title, body }) => (
              <article
                key={title}
                className="rounded-lg border border-white/10 bg-white/[0.06] p-5"
              >
                <Icon className="h-5 w-5 text-orange-300" aria-hidden="true" />
                <h3 className="mt-4 font-sans text-base font-semibold text-white">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/62">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
