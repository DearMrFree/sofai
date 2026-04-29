import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Founder section — a quiet, oversized quote panel. The gateway is rooted
 * in a person, and the page commits to that. No "team" grid; one architect,
 * one signed line, one link to the deeper /founder page.
 */
export function FounderCard() {
  return (
    <section className="mx-auto max-w-5xl px-4 lg:px-8 py-20 sm:py-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        The Architect
      </p>

      <figure className="mt-6 grid gap-10 md:grid-cols-[auto_1fr] items-start">
        {/* Initial-monogram avatar — gold + emerald, since the brief asks
            for stylish initials placeholders for missing photos. The
            actual /founder page can swap this for a portrait when ready. */}
        <div
          className="relative h-32 w-32 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-500 to-orange-400 flex items-center justify-center text-white shadow-xl"
          aria-hidden="true"
        >
          <span className="font-serif text-5xl leading-none">FC</span>
          <span
            className="absolute -bottom-2 -right-2 rounded-md bg-background px-2 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground border border-border"
            aria-hidden="true"
          >
            est.
          </span>
        </div>

        <blockquote className="md:pt-2">
          <p className="font-serif text-3xl sm:text-4xl leading-snug text-foreground">
            <span aria-hidden="true" className="text-orange-500">“</span>
            We are not building a school. We are building a movement that
            decided, one quiet day, to{" "}
            <span className="italic text-emerald-700">also</span> be a
            school.
            <span aria-hidden="true" className="text-orange-500">”</span>
          </p>
          <figcaption className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="font-medium text-foreground">
              Dr. Freedom Cheteni
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Architect · Founder
            </span>
          </figcaption>

          <div className="mt-8">
            <Button asChild variant="outline">
              <Link href="/founder" className="flex items-center gap-2">
                Read the founder
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </blockquote>
      </figure>
    </section>
  )
}
