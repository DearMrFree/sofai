import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  GraduationCap,
  Landmark,
  Mail,
  UserRound,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { buildHandoffUrl } from "@/lib/sso/canonical"

type AudienceKey = "individuals" | "corporations" | "institutions"

const pages = {
  individuals: {
    eyebrow: "For individuals",
    icon: UserRound,
    title: "Create a mission profile that moves with you.",
    intro:
      "Students, founders, educators, builders, and curious learners can start with one School of AI identity, then use SofAI as their profile, application, and learning gateway.",
    primaryLabel: "Create profile",
    primaryHref: "profile",
    secondaryLabel: "Apply to a pathway",
    secondaryHref: "/apply",
    points: [
      "Claim a public sof.ai profile for your mission and work.",
      "Move into The VR School or School of AI without a separate identity.",
      "Use SofAI to ask questions about schools, lessons, and next steps.",
    ],
  },
  corporations: {
    eyebrow: "For corporations",
    icon: Building2,
    title: "Partner with a school network built around proof of work.",
    intro:
      "Companies can sponsor learners, fund challenge-based cohorts, support scholarships, and connect workforce needs to AI and VR learning environments.",
    primaryLabel: "Start corporate partnership",
    primaryHref: "https://www.thevrschool.org/corporate-giving",
    secondaryLabel: "Create profile",
    secondaryHref: "profile",
    points: [
      "Sponsor scholarships, cohorts, labs, or public learning challenges.",
      "Connect business problems to student portfolios and agentic projects.",
      "Support education while building a deeper talent and impact pipeline.",
    ],
  },
  institutions: {
    eyebrow: "For schools & entities",
    icon: Landmark,
    title: "Bring Movement Thinking into your school, district, or entity.",
    intro:
      "Schools, districts, nonprofits, foundations, and public programs can connect to accredited VR education, AI-native learning, and unified learner profiles.",
    primaryLabel: "Talk to schools team",
    primaryHref: "https://www.thevrschool.org/schools-districts",
    secondaryLabel: "Create profile",
    secondaryHref: "profile",
    points: [
      "Explore school, district, and organizational partnership models.",
      "Route learners into accredited VR pathways or AI-native build tracks.",
      "Use SofAI as the guided entry point for families, teams, and partners.",
    ],
  },
} satisfies Record<
  AudienceKey,
  {
    eyebrow: string
    icon: typeof UserRound
    title: string
    intro: string
    primaryLabel: string
    primaryHref: string
    secondaryLabel: string
    secondaryHref: string
    points: string[]
  }
>

export function AudiencePage({ audience }: { audience: AudienceKey }) {
  const config = pages[audience]
  const Icon = config.icon
  const profileHref = buildHandoffUrl("/settings")
  const primaryHref =
    config.primaryHref === "profile" ? profileHref : config.primaryHref
  const secondaryHref =
    config.secondaryHref === "profile" ? profileHref : config.secondaryHref

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 lg:px-8 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-stone-950 text-white">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="mt-6 font-mono text-[11px] uppercase text-muted-foreground">
            {config.eyebrow}
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-tight text-foreground sm:text-6xl">
            {config.title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            {config.intro}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="xl">
              <a href={primaryHref}>
                {config.primaryLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild size="xl" variant="outline">
              {secondaryHref.startsWith("http") ? (
                <a href={secondaryHref}>{config.secondaryLabel}</a>
              ) : (
                <Link href={secondaryHref}>{config.secondaryLabel}</Link>
              )}
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="grid gap-4">
            {config.points.map((point) => (
              <div key={point} className="flex gap-3">
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <p className="text-sm leading-6 text-muted-foreground">
                  {point}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <MiniMetric icon={UserRound} label="Identity" value="One profile" />
            <MiniMetric icon={GraduationCap} label="Schools" value="VR + AI" />
            <MiniMetric icon={Mail} label="Support" value="Guided" />
          </div>
        </div>
      </div>
    </section>
  )
}

function MiniMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
      <p className="mt-3 font-serif text-2xl leading-none text-foreground">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
