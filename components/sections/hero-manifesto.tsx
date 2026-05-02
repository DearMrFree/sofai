import Link from "next/link"
  import Image from "next/image"
  import { ArrowDown, ArrowRight, BadgeCheck, Globe2, Sparkles, UserRound } from "lucide-react"
  import { Button } from "@/components/ui/button"
  import { AskSofAI } from "@/components/agent/ask-sofai"
  import { buildHandoffUrl } from "@/lib/sso/canonical"
  import { SITE } from "@/lib/site-config"

  const heroStats = [
    { label: "Unified profile", value: SITE.stats.pioneers.replace("+","") === SITE.stats.pioneers ? SITE.stats.pioneers : "1", icon: UserRound },
    { label: "Global learners", value: SITE.stats.pioneers, icon: Globe2 },
    { label: "Countries", value: SITE.stats.countries, icon: Sparkles },
    { label: "WASC pathway", value: SITE.stats.accreditation, icon: BadgeCheck },
  ]

  const audienceLinks = [
    { href: "/individuals", label: "Individuals" },
    { href: "/corporations", label: "Corporations" },
    { href: "/institutions", label: "Schools & entities" },
  ]

  export function HeroManifesto() {
    const profileHref = buildHandoffUrl("/settings")

    return (
      <section className="relative isolate overflow-hidden bg-stone-950 text-white">
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Samuel-zeller-158996-unsplash.jpg/1920px-Samuel-zeller-158996-unsplash.jpg"
          alt="Student using a virtual reality headset"
          fill priority sizes="100vw"
          className="-z-20 object-cover object-[50%_42%]"
        />
        <div aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(12,10,9,0.94)_0%,rgba(12,10,9,0.78)_48%,rgba(12,10,9,0.42)_100%)]" />
        <div aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-[linear-gradient(0deg,rgba(255,250,240,1)_0%,rgba(255,250,240,0)_100%)]" />

        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-24 lg:px-8 lg:py-28">
          <p className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-1.5 font-mono text-[11px] uppercase text-white/80 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
            Education reimagined
          </p>

          <h1 className="mt-6 max-w-3xl font-serif text-5xl leading-[1.02] text-white sm:text-6xl md:text-7xl">
            {SITE.name}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/78 sm:text-xl">
            {SITE.description}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="xl" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <a href={profileHref}>
                Create your profile <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild size="xl" variant="outline"
              className="border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white">
              <Link href="/apply">
                Apply as a Pioneer
              </Link>
            </Button>
          </div>

          {/* Contextual chat link */}
          <div className="mt-6">
            <AskSofAI
              prompt="I just landed on sof.ai. Give me a 30-second overview of what School of Freedom is and how I can get started."
              label="Not sure where to start? Ask SofAI"
              variant="ghost"
              className="text-white/70 hover:text-white"
            />
          </div>

          {/* Stats */}
          <div className="mt-10 grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Unified profile", value: "1", icon: UserRound },
              { label: "Global learners", value: SITE.stats.pioneers, icon: Globe2 },
              { label: "Countries", value: SITE.stats.countries, icon: Sparkles },
              { label: "WASC pathway", value: SITE.stats.accreditation, icon: BadgeCheck },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-lg border border-white/15 bg-white/8 px-3 py-2.5 backdrop-blur">
                <Icon className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                <p className="mt-1.5 font-serif text-xl text-white">{value}</p>
                <p className="text-[11px] text-white/60">{label}</p>
              </div>
            ))}
          </div>

          {/* Audience tabs */}
          <div className="mt-8 flex flex-wrap gap-2">
            {audienceLinks.map(({ href, label }) => (
              <Link key={href} href={href}
                className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white/80 backdrop-blur transition hover:bg-white/20 hover:text-white">
                {label}
              </Link>
            ))}
          </div>

          {/* Scroll hint */}
          <div className="mt-14 flex items-center gap-2 text-white/40">
            <ArrowDown className="h-4 w-4 animate-bounce" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-widest">Scroll to explore</span>
          </div>
        </div>
      </section>
    )
  }
  