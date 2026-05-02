import Link from "next/link"
import {
  ArrowRight,
  Building2,
  GraduationCap,
  Landmark,
  UserRound,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { buildHandoffUrl } from "@/lib/sso/canonical"

const pathways = [
  {
    id: "individuals",
    href: "/individuals",
    icon: UserRound,
    eyebrow: "For individuals",
    title: "Declare a mission and build a public profile.",
    body:
      "Students, founders, educators, and builders can create one identity that travels across SofAI, The VR School, and School of AI.",
    action: "View individual path",
  },
  {
    id: "corporations",
    href: "/corporations",
    icon: Building2,
    eyebrow: "For corporations",
    title: "Sponsor learning, talent, and applied AI work.",
    body:
      "Companies can support students, fund cohorts, create challenge briefs, and connect real work to a school built around proof.",
    action: "View corporate path",
  },
  {
    id: "institutions",
    href: "/institutions",
    icon: Landmark,
    eyebrow: "For schools & entities",
    title: "Bring Movement Thinking into your organization.",
    body:
      "Schools, districts, nonprofits, foundations, and public programs can connect to accredited VR pathways and AI-native learning.",
    action: "View entity path",
  },
]

export function AudiencePathways() {
  const profileHref = buildHandoffUrl("/settings")

  return (
    <section id="pathways" className="border-y border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase text-muted-foreground">
              Choose your doorway
            </p>
            <h2 className="mt-3 max-w-xl pr-12 font-serif text-4xl leading-tight text-foreground sm:pr-0 sm:text-5xl">
              A different path for every kind of learner, team, and partner.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground lg:ml-auto">
            The landing page now routes visitors by intent. Individuals can
            sign up immediately. Companies and institutions get a clear
            business path without losing the shared School of AI profile layer.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {pathways.map(({ id, href, icon: Icon, eyebrow, title, body, action }) => (
            <article
              id={id}
              key={id}
              className="rounded-lg border border-border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-900">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="mt-5 font-mono text-[11px] uppercase text-muted-foreground">
                {eyebrow}
              </p>
              <h3 className="mt-2 font-serif text-2xl leading-snug text-foreground">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {body}
              </p>
              <Link
                href={href}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary/80"
              >
                {action}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-50 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div className="flex gap-3">
            <GraduationCap className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
              <h3 className="font-sans text-base font-semibold">
                One sign-up works across the ecosystem.
              </h3>
              <p className="mt-1 text-sm leading-6 text-emerald-900/75 dark:text-emerald-50/75">
                Use the School of AI identity layer to create or edit your
                SofAI profile, then move between sister schools without a new
                account ritual.
              </p>
            </div>
          </div>
          <Button asChild className="mt-4 shrink-0 sm:mt-0">
            <a href={profileHref}>
              Sign up
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
