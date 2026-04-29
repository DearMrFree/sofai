"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Liquid routing — the navbar tags itself with a contextual identity that
 * tracks the page the visitor is reading. /founder = "The Architect",
 * /[slug] = "Pioneer", /apply = "Applicant", default = "Movement".
 *
 * This is the visible incarnation of "Contextual Navigation" from the spec:
 * a quiet inflection that the gateway is alive to where you are inside it.
 */
function contextLabel(pathname: string): string {
  if (pathname === "/" || pathname === "") return "Movement"
  if (pathname === "/founder") return "The Architect"
  if (pathname === "/apply") return "Applicant"
  if (pathname === "/students") return "Pioneers"
  if (pathname === "/settings") return "Editor"
  if (pathname === "/admin") return "Steward"
  if (pathname.startsWith("/founder/")) return "The Architect"
  // /[slug] — student profile
  return "Pioneer"
}

const NAV_LINKS: { href: string; label: string }[] = [
  { href: "/", label: "Manifesto" },
  { href: "/founder", label: "Founder" },
  { href: "/students", label: "Students" },
  { href: "/apply", label: "Apply" },
]

export function Navbar() {
  const pathname = usePathname() || "/"
  const label = contextLabel(pathname)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label="School of Freedom — home"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-emerald-600 via-emerald-500 to-orange-400 text-white shadow-sm"
            aria-hidden="true"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-lg text-foreground">
              School of Freedom
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              · {label}
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(link.href + "/")
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
                {active ? (
                  <span
                    className="pointer-events-none absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-emerald-500 to-orange-500"
                    aria-hidden="true"
                  />
                ) : null}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <a
              href="https://ai.thevrschool.org/signin?callbackUrl=https%3A%2F%2Fsof.ai%2F"
              rel="noreferrer"
            >
              Sign in
            </a>
          </Button>
          <Button asChild size="sm">
            <Link href="/apply">Apply</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
