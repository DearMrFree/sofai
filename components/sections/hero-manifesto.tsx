import Link from "next/link"
import Image from "next/image"
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  Globe2,
  Sparkles,
  UserRound,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { buildHandoffUrl } from "@/lib/sso/canonical"

const heroStats = [
  { label: "Unified profile", value: "1", icon: UserRound },
  { label: "Global learners", value: "402+", icon: Globe2 },
  { label: "Countries", value: "20+", icon: Sparkles },
  { label: "WASC pathway", value: "Accredited", icon: BadgeCheck },
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
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[50%_42%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(12,10,9,0.94)_0%,rgba(12,10,9,0.78)_48%,rgba(12,10,9,0.42)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-[linear-gradient(0deg,rgba(255,250,240,1)_0%,rgba(255,250,240,0)_100%)]"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-24 lg:px-8 lg:py-28">
        <p className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-1.5 font-mono text-[11px] uppercase text-white/80 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
          Education reimagined
        </p>

        <h1 className="mt-6 max-w-3xl font-serif text-5xl leading-[1.02] text-white sm:text-6xl md:text-7xl">
          School of Freedom
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/78 sm:text-xl">
          A clean gateway into The VR School, School of AI, and Movement
          Thinking. Individuals, companies, schools, and partner entities can
          start with one profile and move across the whole ecosystem.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="xl" className="bg-white text-stone-950 hover:bg-white/90">
            <a href={profileHref} className="flex items-center gap-2">
              Create your profile
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="xl"
            className="border-white/30 bg-white/5 text-white hover:bg-white/12 hover:text-white"
          >
            <Link href="#pathways" className="flex items-center gap-2">
              Choose your path
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          {heroStats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-lg border border-white/16 bg-white/10 p-4 backdrop-blur"
            >
              <Icon className="h-4 w-4 text-emerald-300" aria-hidden="true" />
              <p className="mt-3 font-serif text-2xl leading-none text-white">
                {value}
              </p>
              <p className="mt-1 text-xs leading-5 text-white/64">{label}</p>
            </div>
          ))}
        </div>

        <nav
          aria-label="Audience pathways"
          className="mt-8 flex max-w-3xl flex-wrap gap-2"
        >
          {audienceLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md border border-white/16 bg-white/10 px-3 py-2 text-sm font-medium text-white/82 backdrop-blur transition hover:bg-white/16 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <a
        href="https://commons.wikimedia.org/wiki/File:Samuel-zeller-158996-unsplash.jpg"
        className="absolute bottom-3 right-3 hidden rounded bg-stone-950/70 px-2 py-1 text-[10px] text-white/60 backdrop-blur transition hover:text-white sm:block"
      >
        Photo: Samuel Zeller / CC BY-SA 4.0
      </a>
    </section>
  )
}
