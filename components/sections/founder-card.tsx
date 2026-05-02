import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FounderCard() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
      <figure className="rounded-lg border border-border bg-card p-6 shadow-sm md:grid md:grid-cols-[0.7fr_1.3fr] md:gap-8 md:p-8">
        <div>
          <p className="font-mono text-[11px] uppercase text-muted-foreground">
            Founder signal
          </p>
          <div
            className="mt-6 flex h-28 w-28 items-center justify-center rounded-lg bg-stone-950 text-white shadow-sm"
            aria-hidden="true"
          >
            <span className="font-serif text-5xl leading-none">FC</span>
          </div>
        </div>

        <blockquote className="mt-8 md:mt-0">
          <p className="font-serif text-3xl leading-snug text-foreground sm:text-4xl">
            "We are not building a school. We are building a movement that
            decided to become a school."
          </p>
          <figcaption className="mt-5 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              Dr. Freedom Cheteni
            </span>{" "}
            · Founder and architect of the School of Freedom ecosystem
          </figcaption>

          <div className="mt-7">
            <Button asChild variant="outline">
              <Link href="/founder" className="flex items-center gap-2">
                Read founder story
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </blockquote>
      </figure>
    </section>
  )
}
