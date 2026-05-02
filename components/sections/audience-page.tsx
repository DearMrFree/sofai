import Link from "next/link"
  import { ArrowRight, Building2, Landmark, UserRound } from "lucide-react"
  import { Button } from "@/components/ui/button"
  import { AskSofAI } from "@/components/agent/ask-sofai"
  import { buildHandoffUrl } from "@/lib/sso/canonical"
  import { SITE } from "@/lib/site-config"

  type AudienceKey = "individuals" | "corporations" | "institutions"

  const ICONS = { individuals: UserRound, corporations: Building2, institutions: Landmark }

  export function AudiencePage({ audience }: { audience: AudienceKey }) {
    const cfg = SITE.paths[audience]
    const Icon = ICONS[audience]
    const profileHref = buildHandoffUrl("/settings")

    const primaryHref = cfg.cta.primary.href.startsWith("http")
      ? cfg.cta.primary.href
      : cfg.cta.primary.href === "/signin"
      ? profileHref
      : cfg.cta.primary.href

    const secondaryHref = cfg.cta.secondary.href.startsWith("http")
      ? cfg.cta.secondary.href
      : cfg.cta.secondary.href === "/apply"
      ? "/apply"
      : profileHref

    return (
      <section className="mx-auto max-w-6xl px-4 py-14 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">

          {/* Left — headline + CTAs */}
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-stone-950 text-white">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="mt-6 font-mono text-[11px] uppercase text-muted-foreground">{cfg.eyebrow}</p>
            <h1 className="mt-4 font-serif text-5xl leading-tight text-foreground sm:text-6xl">{cfg.title}</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">{cfg.description}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="xl">
                <a href={primaryHref}>
                  {cfg.cta.primary.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild size="xl" variant="outline">
                {secondaryHref.startsWith("http")
                  ? <a href={secondaryHref}>{cfg.cta.secondary.label}</a>
                  : <Link href={secondaryHref}>{cfg.cta.secondary.label}</Link>
                }
              </Button>
            </div>
          </div>

          {/* Right — contextual SofAI panel (replaces static FAQ bullets) */}
          <div className="flex flex-col gap-4">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: SITE.stats.pioneers, label: "Pioneers" },
                { val: SITE.stats.countries, label: "Countries" },
                { val: SITE.stats.accreditation, label: "Accredited" },
              ].map(({ val, label }) => (
                <div key={label} className="rounded-lg border border-border bg-card py-3 text-center shadow-sm">
                  <p className="font-serif text-xl text-foreground">{val}</p>
                  <p className="text-[11px] text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>

            {/* Quick questions */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Common questions</p>
              <div className="flex flex-wrap gap-2">
                {cfg.quickPrompts.map(prompt => (
                  <AskSofAI key={prompt} prompt={prompt} label={prompt} variant="pill" />
                ))}
              </div>
            </div>

            {/* Banner CTA */}
            <AskSofAI
              prompt={`Tell me everything about the ${cfg.eyebrow.toLowerCase()} path on School of Freedom.`}
              label="Ask SofAI anything about this path"
              variant="banner"
            />
          </div>
        </div>
      </section>
    )
  }
  