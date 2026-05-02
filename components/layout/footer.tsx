import Link from "next/link"
import { SISTER_SCHOOLS } from "@/lib/utils"
import { buildHandoffUrl } from "@/lib/sso/canonical"

export function Footer() {
  const year = new Date().getFullYear()
  const profileHref = buildHandoffUrl("/settings")

  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 lg:px-8 py-12 grid gap-10 md:grid-cols-5 text-sm">
        <div className="md:col-span-2">
          <p className="font-serif text-2xl text-foreground leading-tight">
            School of Freedom
          </p>
          <p className="mt-3 text-muted-foreground max-w-sm">
            The digital home of Movement Thinking — a unifying gateway to
            specialised educational pathways designed to liberate human
            potential.
          </p>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Founded by Dr. Freedom Cheteni
          </p>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Audiences
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link
                href="/individuals"
                className="text-foreground hover:text-primary transition-colors"
              >
                Individuals
              </Link>
            </li>
            <li>
              <Link
                href="/corporations"
                className="text-foreground hover:text-primary transition-colors"
              >
                Corporations
              </Link>
            </li>
            <li>
              <Link
                href="/institutions"
                className="text-foreground hover:text-primary transition-colors"
              >
                Schools & entities
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Sister schools
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <a
                href={SISTER_SCHOOLS.vr.href}
                className="text-foreground hover:text-primary transition-colors"
              >
                {SISTER_SCHOOLS.vr.name}
              </a>
            </li>
            <li>
              <a
                href={SISTER_SCHOOLS.ai.href}
                className="text-foreground hover:text-primary transition-colors"
              >
                {SISTER_SCHOOLS.ai.name}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Start
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <a
                href={profileHref}
                className="text-foreground hover:text-primary transition-colors"
              >
                Sign up
              </a>
            </li>
            <li>
              <Link
                href="/students"
                className="text-foreground hover:text-primary transition-colors"
              >
                Students
              </Link>
            </li>
            <li>
              <Link
                href="/apply"
                className="text-foreground hover:text-primary transition-colors"
              >
                Apply
              </Link>
            </li>
            <li>
              <Link
                href="/founder"
                className="text-foreground hover:text-primary transition-colors"
              >
                Founder
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {year} School of Freedom · Movement Thinking</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em]">
            sof.ai · the unifying gateway
          </p>
        </div>
      </div>
    </footer>
  )
}
