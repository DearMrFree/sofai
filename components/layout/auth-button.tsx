"use client"

import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { LogOut, ShieldCheck, User } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Sign-in surface in the navbar. Three states:
 *   - loading → skeletal placeholder so the navbar doesn't jitter
 *   - signed-out → "Sign in" link to /signin
 *   - signed-in → avatar/initials with a small dropdown (email + sign out)
 */
export function AuthButton() {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  // Click-outside / Esc to close — same affordances as the apex's AuthButton.
  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("mousedown", handleClick)
    window.addEventListener("keydown", handleKey)
    return () => {
      window.removeEventListener("mousedown", handleClick)
      window.removeEventListener("keydown", handleKey)
    }
  }, [open])

  if (status === "loading") {
    return (
      <span
        className="inline-flex h-9 w-20 items-center justify-center rounded-md bg-muted/60"
        aria-hidden="true"
      />
    )
  }

  if (!session?.user) {
    return (
      <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
        <Link href="/signin">Sign in</Link>
      </Button>
    )
  }

  const name = session.user.name ?? "Pioneer"
  const email = session.user.email ?? ""
  const initials = initialsFor(name)
  const isAdmin = session.user.isAdmin === true

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-9 items-center gap-2 rounded-full border border-border/60 bg-background/60 pl-1 pr-3 transition-colors hover:bg-muted/70",
          open && "bg-muted/70",
        )}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-orange-400 text-[11px] font-semibold uppercase text-white"
          aria-hidden="true"
        >
          {initials}
        </span>
        <span className="hidden text-sm font-medium text-foreground sm:inline">
          {firstName(name)}
        </span>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-11 z-50 w-64 overflow-hidden rounded-xl border border-border/70 bg-background shadow-lg"
        >
          <div className="border-b border-border/60 px-4 py-3">
            <div className="text-sm font-medium text-foreground">{name}</div>
            {email ? (
              <div className="truncate font-mono text-[11px] text-muted-foreground">
                {email}
              </div>
            ) : null}
          </div>
          <Link
            href="/settings"
            role="menuitem"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted/60"
            onClick={() => setOpen(false)}
          >
            <User className="h-4 w-4" aria-hidden="true" />
            Profile settings
          </Link>
          {isAdmin ? (
            <Link
              href="/admin"
              role="menuitem"
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted/60"
              onClick={() => setOpen(false)}
            >
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Pioneer queue
            </Link>
          ) : null}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              void signOut({ callbackUrl: "/" })
            }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-foreground hover:bg-muted/60"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  )
}

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2)
  if (parts.length === 0) return "P"
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "P"
}

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? "Pioneer"
}
