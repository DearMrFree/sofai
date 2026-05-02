import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { buildHandoffUrl } from "@/lib/sso/canonical"

export function LandingCta() {
  const profileHref = buildHandoffUrl("/settings")

  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
        <div className="rounded-lg bg-stone-950 p-6 text-white shadow-xl sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div>
            <p className="font-mono text-[11px] uppercase text-emerald-300">
              Start here
            </p>
            <h2 className="mt-3 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
              Create one profile. Move through every school.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/68 sm:text-base">
              Sign up with the same identity used by School of AI, then choose
              the path that fits: individual learner, corporate partner, school,
              district, foundation, or public entity.
            </p>
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:shrink-0">
            <Button asChild size="xl" className="bg-white text-stone-950 hover:bg-white/90">
              <a href={profileHref}>
                Sign up
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="xl"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/apply">Apply</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
