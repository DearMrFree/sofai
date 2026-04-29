"use client"

import { useState } from "react"
import { ArrowRight, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Multi-step manifesto application.
 *
 * Submits to /api/pioneer-applications, which forwards into the AI
 * School FastAPI's /pioneer-applications endpoint and writes to the
 * shared Postgres. Once Freedom approves the row from the admin
 * dashboard, the applicant's profile goes live at sof.ai/<slug> and a
 * matching UserProfile row is upserted so their identity is unified
 * across all three sister sites.
 */
type Pathway = "vr" | "ai"

interface FormState {
  step: 0 | 1 | 2 | 3 | 4
  name: string
  email: string
  pathway: Pathway | ""
  slug: string
  mission: string
  manifesto: string
  submitting: boolean
  submitted: boolean
  error: string | null
}

const slugify = (s: string): string =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32)
    .replace(/-+$/g, "")

const STEP_LABELS = ["Identity", "Pathway", "Slug", "Mission", "Manifesto"] as const

export function ApplyForm() {
  const [state, setState] = useState<FormState>({
    step: 0,
    name: "",
    email: "",
    pathway: "",
    slug: "",
    mission: "",
    manifesto: "",
    submitting: false,
    submitted: false,
    error: null,
  })

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setState((s) => ({ ...s, [key]: value }))

  const canAdvance: Record<0 | 1 | 2 | 3 | 4, boolean> = {
    0: state.name.trim().length >= 2 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(state.email),
    1: state.pathway !== "",
    2: state.slug.length >= 3 && state.slug === slugify(state.slug),
    3: state.mission.trim().length >= 10 && state.mission.trim().length <= 600,
    4: state.manifesto.trim().length >= 80 && state.manifesto.trim().length <= 4000,
  }

  async function handleSubmit() {
    update("submitting", true)
    update("error", null)
    try {
      const resp = await fetch("/api/pioneer-applications", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          full_name: state.name.trim(),
          email: state.email.trim(),
          slug: state.slug,
          pathway: state.pathway,
          mission_statement: state.mission.trim(),
          personal_statement: state.manifesto.trim(),
          identity_tags: [],
        }),
      })
      if (!resp.ok) {
        let detail = "Something went wrong. Please try again."
        try {
          const data = (await resp.json()) as { error?: string }
          if (data.error) detail = data.error
        } catch {
          // keep default
        }
        update("error", detail)
        return
      }
      update("submitted", true)
    } catch (err) {
      update(
        "error",
        err instanceof Error ? err.message : "Network error. Please try again.",
      )
    } finally {
      update("submitting", false)
    }
  }

  if (state.submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white">
          <Check className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="mt-5 font-serif text-3xl text-foreground">
          Received. Freedom reviews on a rolling basis.
        </h2>
        <p className="mt-3 text-muted-foreground">
          You'll get an email when a decision is made. Approved applicants
          go live at{" "}
          <span className="font-mono text-foreground">
            sof.ai/{state.slug || "your-slug"}
          </span>{" "}
          with a profile they can edit themselves.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Step indicator — printed bar, not a progress bar. */}
      <ol className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {STEP_LABELS.map((label, i) => (
          <li
            key={label}
            className={cn(
              "flex items-center gap-2",
              i === state.step
                ? "text-foreground"
                : i < state.step
                ? "text-emerald-700"
                : "",
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full border text-[10px]",
                i === state.step
                  ? "border-foreground bg-foreground text-background"
                  : i < state.step
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-border",
              )}
            >
              {i < state.step ? <Check className="h-3 w-3" /> : i + 1}
            </span>
            {label}
          </li>
        ))}
      </ol>

      {state.step === 0 && (
        <fieldset className="space-y-5">
          <legend className="sr-only">Identity</legend>
          <FormField label="Name">
            <input
              type="text"
              autoComplete="name"
              value={state.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Ada Lovelace"
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </FormField>
          <FormField label="Email">
            <input
              type="email"
              autoComplete="email"
              value={state.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="ada@analytical.engine"
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </FormField>
        </fieldset>
      )}

      {state.step === 1 && (
        <fieldset>
          <legend className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Pick your pathway
          </legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {(
              [
                { id: "vr" as const, name: "The VR School", body: "Learn by doing in immersive VR." },
                { id: "ai" as const, name: "The AI School", body: "Build alongside AI agents." },
              ]
            ).map((opt) => {
              const selected = state.pathway === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => update("pathway", opt.id)}
                  aria-pressed={selected}
                  className={cn(
                    "rounded-2xl border p-6 text-left transition-all",
                    selected
                      ? "border-emerald-600 bg-emerald-50 shadow-md"
                      : "border-border bg-background hover:border-foreground/40",
                  )}
                >
                  <p className="font-serif text-2xl text-foreground">{opt.name}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{opt.body}</p>
                </button>
              )
            })}
          </div>
        </fieldset>
      )}

      {state.step === 2 && (
        <fieldset className="space-y-5">
          <legend className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Claim your slug
          </legend>
          <p className="text-sm text-muted-foreground">
            This is your public URL on the gateway. Letters, numbers, and
            hyphens only. You'll wear it for the rest of the movement.
          </p>
          <div className="flex items-stretch overflow-hidden rounded-md border border-border bg-background focus-within:ring-2 focus-within:ring-ring">
            <span className="flex items-center bg-muted/50 px-4 font-mono text-sm text-muted-foreground">
              sof.ai/
            </span>
            <input
              type="text"
              value={state.slug}
              onChange={(e) => update("slug", slugify(e.target.value))}
              placeholder="ada-lovelace"
              className="flex-1 bg-transparent px-3 py-3 text-base focus:outline-none"
              autoCapitalize="off"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          {state.slug && state.slug !== slugify(state.slug) ? (
            <p className="text-sm text-destructive">
              Slug must be lowercase letters, numbers, and hyphens only.
            </p>
          ) : null}
        </fieldset>
      )}

      {state.step === 3 && (
        <fieldset className="space-y-3">
          <legend className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Your mission
          </legend>
          <p className="text-sm text-muted-foreground">
            One sentence. The pull-quote that will sit at the top of your
            profile. Between 10 and 600 characters.
          </p>
          <textarea
            value={state.mission}
            onChange={(e) => update("mission", e.target.value)}
            rows={3}
            placeholder="I exist to…"
            className="w-full rounded-md border border-border bg-background px-4 py-3 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="font-mono text-[11px] text-muted-foreground">
            {state.mission.length} / 600 characters
          </p>
        </fieldset>
      )}

      {state.step === 4 && (
        <fieldset className="space-y-3">
          <legend className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Your manifesto
          </legend>
          <p className="text-sm text-muted-foreground">
            One paragraph. What would you build if no one stopped you? At
            least 80 characters — say something that costs you a little to
            say.
          </p>
          <textarea
            value={state.manifesto}
            onChange={(e) => update("manifesto", e.target.value)}
            rows={6}
            placeholder="I would build…"
            className="w-full rounded-md border border-border bg-background px-4 py-3 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="font-mono text-[11px] text-muted-foreground">
            {state.manifesto.length} / 4000 characters
          </p>
        </fieldset>
      )}

      {state.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={() => update("step", Math.max(0, state.step - 1) as FormState["step"])}
          disabled={state.step === 0 || state.submitting}
        >
          Back
        </Button>
        {state.step < 4 ? (
          <Button
            type="button"
            onClick={() =>
              update("step", Math.min(4, state.step + 1) as FormState["step"])
            }
            disabled={!canAdvance[state.step]}
          >
            Continue
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!canAdvance[4] || state.submitting}
          >
            {state.submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Submitting
              </>
            ) : (
              <>
                Submit application
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

function FormField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  )
}
