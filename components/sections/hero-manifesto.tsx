import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Hero — full-bleed editorial manifesto. The visual language deliberately
 * borrows from the printed page (paper cream, hairline rule, mono caption
 * + serif headline + sans body) so the gateway sets a different register
 * from either sister school landing page. Quiet, declarative, signed.
 */
export function HeroManifesto() {
  return (
    <section className="relative overflow-hidden">
      {/* Soft warm halo behind the headline — drifts slowly so the page feels
          alive without ever pulling focus from the text. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[520px] w-[820px] rounded-full bg-gradient-to-br from-emerald-200/40 via-amber-100/40 to-orange-200/30 blur-3xl animate-drift" />
      </div>

      <div className="mx-auto max-w-5xl px-4 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          A manifesto · No. 01
        </p>

        <h1 className="mt-6 font-serif text-5xl leading-[1.04] sm:text-6xl md:text-7xl text-foreground">
          School,{" "}
          <span className="italic text-emerald-700">re-imagined</span>
          <span className="text-orange-500">.</span>
          <br />
          Built for the people who refuse to wait for permission.
        </h1>

        <p className="mt-8 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
          The School of Freedom is the unifying home of{" "}
          <span className="text-foreground">Movement Thinking</span>: a
          philosophy that the classroom should drive itself, that students
          should be named members of an idea, and that learning is
          something you{" "}
          <span className="text-foreground">do</span>, not something you
          receive.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button asChild size="xl">
            <Link href="/apply" className="flex items-center gap-2">
              Apply to the Movement
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="xl">
            <Link href="/founder">Read the founder</Link>
          </Button>
        </div>

        {/* Hairline + signature — the page closes its opening like a letter. */}
        <div className="mt-16 max-w-2xl rule-hairline" aria-hidden="true" />
        <p className="mt-4 max-w-2xl flex items-center gap-3 text-sm text-muted-foreground">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
            Signed
          </span>
          <span className="font-serif italic text-foreground">
            Dr. Freedom Cheteni
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            · Architect
          </span>
        </p>
      </div>
    </section>
  )
}
