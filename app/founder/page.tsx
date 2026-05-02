import type { Metadata } from "next"
  import Link from "next/link"
  import { ArrowRight } from "lucide-react"
  import { Button } from "@/components/ui/button"
  import { AskSofAI } from "@/components/agent/ask-sofai"
  import { SITE } from "@/lib/site-config"

  export const metadata: Metadata = {
    title: "Founder · Dr. Freedom Cheteni",
    description: "Architect of the School of Freedom. Movement Thinking, the self-driving classroom, and the next 10 years of education.",
  }

  export default function FounderPage() {
    const { founder, timeline } = SITE
    return (
      <article>
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-4 lg:px-8 pt-16 pb-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Founder · Architect</p>
          <h1 className="mt-6 font-serif text-5xl sm:text-6xl leading-[1.05] text-foreground">{founder.name}</h1>
          <blockquote className="mt-8 border-l-2 border-primary pl-5 font-serif text-2xl italic leading-snug text-foreground sm:text-3xl max-w-3xl">
            "{founder.quote}"
          </blockquote>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/apply">
                Apply as a Pioneer <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <AskSofAI
              prompt={`Tell me about Dr. Freedom Cheteni — his background, what drives him, and why he built School of Freedom.`}
              label="Ask SofAI about Dr. Cheteni"
              variant="ghost"
            />
          </div>
        </section>

        {/* Timeline */}
        <section className="mx-auto max-w-5xl px-4 lg:px-8 py-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-10">Timeline</p>
          <ol className="relative border-l border-border space-y-10 pl-8">
            {timeline.map(({ year, headline, body }) => (
              <li key={year} className="relative">
                <span className="absolute -left-[2.15rem] flex size-8 items-center justify-center rounded-full border border-border bg-background font-mono text-[11px] text-muted-foreground">
                  {year.slice(2)}
                </span>
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{year}</p>
                <h2 className="mt-2 font-serif text-2xl text-foreground">{headline}</h2>
                <p className="mt-2 text-base leading-7 text-muted-foreground max-w-2xl">{body}</p>
                <div className="mt-3">
                  <AskSofAI
                    prompt={`Tell me more about "${headline}" and its significance to School of Freedom.`}
                    label={`Ask SofAI about ${headline}`}
                    variant="ghost"
                    className="text-xs"
                  />
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Footer CTA */}
        <section className="mx-auto max-w-5xl px-4 lg:px-8 pb-20">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <p className="font-mono text-[11px] uppercase text-muted-foreground">Join the movement</p>
              <p className="mt-2 font-serif text-2xl text-foreground max-w-xl">"{SITE.tagline}"</p>
            </div>
            <div className="mt-6 flex flex-col gap-3 md:mt-0 md:shrink-0">
              <Button asChild>
                <Link href="/apply">Apply as a Pioneer <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <AskSofAI prompt="I just read about Dr. Freedom Cheteni. How do I join School of Freedom and what should I do first?" label="Ask SofAI how to start" variant="ghost" />
            </div>
          </div>
        </section>
      </article>
    )
  }
  