import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Founder · Dr. Freedom Cheteni",
  description:
    "Architect of the School of Freedom. Movement Thinking, the self-driving classroom, and the next 10 years of education.",
}

const TIMELINE = [
  {
    year: "2017",
    headline: "The Moonshot Innovation Diploma",
    body:
      "Working alongside Dr. Esther Wojcicki, the diploma — paired with the Wojcicki mastery transcript — proved a single idea: that a transcript could measure preparedness for the automation economy, not just compliance with it.",
  },
  {
    year: "2020",
    headline: "Inclusive policy as design constraint",
    body:
      "Joined UNESCO's Inclusive Policy Lab. Articulated the position that the only honest yardstick for educational reform is whether it improves the lives of the most disadvantaged 8 billion — not the most successful 8.",
  },
  {
    year: "2024",
    headline: "The VR School",
    body:
      "WASC-accredited. UC A-G approved. Reading proficiency rates above the state average. Built so a student in Harare and a student in Palo Alto sit in the same classroom.",
  },
  {
    year: "2025",
    headline: "The AI School",
    body:
      "AI-native classroom where students ship Pull Requests with Devin, draft scholarly journals with Claude, and build alongside Gemini. The first cohort graduated with public, signed artefacts.",
  },
  {
    year: "2026",
    headline: "School of Freedom",
    body:
      "The unifying gateway. Two sister schools, one philosophy, one identity per student. The movement formalises.",
  },
]

export default function FounderPage() {
  return (
    <article>
      {/* Hero — one architect, one quote, no fluff. */}
      <section className="mx-auto max-w-5xl px-4 lg:px-8 pt-16 pb-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          The Architect · No. 01
        </p>
        <h1 className="mt-6 font-serif text-5xl sm:text-6xl leading-[1.05] text-foreground">
          Dr. Freedom{" "}
          <span className="italic text-emerald-700">Cheteni</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Educator, technologist, and architect of Movement Thinking. Founder
          of The VR School, The AI School, and the unifying School of
          Freedom.
        </p>
      </section>

      {/* Manifesto block — the founder's statement, set as a quoted opener. */}
      <section className="mx-auto max-w-3xl px-4 lg:px-8 pb-12">
        <div className="rule-hairline mb-10" aria-hidden="true" />
        <blockquote className="font-serif text-2xl sm:text-3xl leading-snug text-foreground">
          <span aria-hidden="true" className="text-orange-500">“</span>
          Reinvention of societal infrastructure is the only bridge towards
          improving the quality of life for 8 billion people. Humanity is
          limited not by what we can do, but by what we{" "}
          <span className="italic text-emerald-700">think</span> we can do —
          and by a lack of willingness to fail.
          <span aria-hidden="true" className="text-orange-500">”</span>
        </blockquote>
        <p className="mt-5 text-sm text-muted-foreground">
          — Dr. Freedom Cheteni, UNESCO Inclusive Policy Lab
        </p>
      </section>

      {/* Timeline — printed-page chronology. */}
      <section className="mx-auto max-w-3xl px-4 lg:px-8 pb-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-6">
          Timeline of the movement
        </p>
        <ol className="space-y-10">
          {TIMELINE.map((entry) => (
            <li key={entry.year} className="grid grid-cols-[auto_1fr] gap-x-6 sm:gap-x-10">
              <div className="font-mono text-sm text-muted-foreground tabular-nums pt-1">
                {entry.year}
              </div>
              <div>
                <h2 className="font-serif text-2xl text-foreground">
                  {entry.headline}
                </h2>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {entry.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA pair — the architect's invitation. */}
      <section className="mx-auto max-w-3xl px-4 lg:px-8 pb-24">
        <div className="rule-hairline mb-10" aria-hidden="true" />
        <p className="font-serif text-2xl text-foreground">
          The work is open. The doors are real. Bring something to build.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/apply" className="flex items-center gap-2">
              Apply to the Movement
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/students">Meet the Pioneers</Link>
          </Button>
        </div>
      </section>
    </article>
  )
}
