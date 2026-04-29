"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Inbox,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type {
  PioneerApplicationRecord,
  PioneerStatus,
} from "@/lib/pioneer-applications"
import { pathwayLabel } from "@/lib/pioneers"

/**
 * Admin dashboard for Pioneer applications.
 *
 * Pulls the queue from `/api/admin/pioneer-applications?status=…` and
 * exposes approve / decline / save-note actions that PATCH each row's
 * proxy. Every mutating call has admin re-checked server-side; the
 * client never holds the FastAPI shared secret.
 *
 * UX shape:
 *   - Three tabs (Pending · Approved · Declined). Pending is the
 *     default and the working state.
 *   - Master list on the left, detail panel on the right (single
 *     column on mobile).
 *   - Approve flips the row to "approved" + writes a (optional)
 *     review note. The FastAPI side then upserts a UserProfile so the
 *     Pioneer's identity propagates across the three sister sites.
 *   - Decline is the same shape but flips to "declined" — row stays
 *     in the audit but the Pioneer's slug is freed up for re-claim.
 */

const TAB_LABELS: Array<{ id: TabId; label: string }> = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "declined", label: "Declined" },
]

type TabId = "pending" | "approved" | "declined"

interface ApiErrorBody {
  error?: string
  detail?: string
}

interface DashboardProps {
  adminEmail: string
}

export function AdminDashboard({ adminEmail }: DashboardProps) {
  const [tab, setTab] = useState<TabId>("pending")
  const [rows, setRows] = useState<PioneerApplicationRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [reviewNote, setReviewNote] = useState("")
  const [actionState, setActionState] = useState<{
    inflight: null | "approve" | "decline"
    error: string | null
  }>({ inflight: null, error: null })
  // Lifted out of actionState because it must survive both (a) the
  // selection-change effect that wipes per-row state and (b) the
  // detail panel's empty-state branch (which renders when the row
  // disappears from the current tab after an approve/decline). It is
  // shown at the dashboard level, above the grid, so it stays visible
  // regardless of which row is selected.
  const [successBanner, setSuccessBanner] = useState<string | null>(null)

  const selected = useMemo(
    () => rows.find((r) => r.id === selectedId) ?? null,
    [rows, selectedId],
  )

  const loadQueue = useCallback(
    async (status: TabId, opts?: { keepSelection?: boolean }) => {
      setLoading(true)
      setLoadError(null)
      try {
        const res = await fetch(
          `/api/admin/pioneer-applications?status=${status}&limit=100`,
          { cache: "no-store" },
        )
        const text = await res.text()
        if (!res.ok) {
          let detail = "Could not load applications."
          try {
            const parsed = JSON.parse(text) as ApiErrorBody
            detail = parsed.error ?? parsed.detail ?? detail
          } catch {
            // text wasn't JSON; fall through
          }
          setLoadError(detail)
          setRows([])
          if (!opts?.keepSelection) setSelectedId(null)
          return
        }
        const parsed = JSON.parse(text) as PioneerApplicationRecord[]
        setRows(parsed)
        if (!opts?.keepSelection) {
          setSelectedId(parsed[0]?.id ?? null)
          setReviewNote(parsed[0]?.review_note ?? "")
        }
      } catch (err) {
        setLoadError(
          err instanceof Error
            ? err.message
            : "Network error while loading queue.",
        )
        setRows([])
        if (!opts?.keepSelection) setSelectedId(null)
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    void loadQueue(tab)
  }, [tab, loadQueue])

  // When the user clicks a different row, sync the review-note
  // textarea to whatever's already on file. Per-row state (inflight,
  // error) resets so a previous failure doesn't bleed across rows.
  // The success banner is intentionally NOT reset here — it lives at
  // the dashboard level so it persists across the deselection that
  // happens after a successful approve/decline.
  useEffect(() => {
    if (selected) {
      setReviewNote(selected.review_note ?? "")
    } else {
      setReviewNote("")
    }
    setActionState({ inflight: null, error: null })
  }, [selectedId, selected])

  // Auto-dismiss the success banner after a beat so the dashboard
  // doesn't accumulate stale confirmations across multiple reviews.
  useEffect(() => {
    if (!successBanner) return
    const timer = setTimeout(() => setSuccessBanner(null), 6000)
    return () => clearTimeout(timer)
  }, [successBanner])

  const submitReview = async (status: PioneerStatus) => {
    if (!selected) return
    if (status === "pending") return // not exposed in UI
    const verb = status === "approved" ? "approve" : "decline"
    setActionState({ inflight: verb, error: null })
    setSuccessBanner(null)
    try {
      const res = await fetch(
        `/api/admin/pioneer-applications/${selected.id}`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            status,
            review_note: reviewNote.trim(),
          }),
        },
      )
      const text = await res.text()
      if (!res.ok) {
        let detail = "Could not update the application."
        try {
          const parsed = JSON.parse(text) as ApiErrorBody
          detail = parsed.error ?? parsed.detail ?? detail
        } catch {
          // fall through with default
        }
        setActionState({ inflight: null, error: detail })
        return
      }
      const updated = JSON.parse(text) as PioneerApplicationRecord
      // Optimistically reconcile: drop the row from the current tab if
      // its status no longer matches, otherwise replace in place.
      setRows((prev) => {
        const next = prev.map((r) => (r.id === updated.id ? updated : r))
        if (updated.status !== tab) {
          return next.filter((r) => r.id !== updated.id)
        }
        return next
      })
      if (updated.status !== tab) {
        setSelectedId(null)
      }
      setActionState({ inflight: null, error: null })
      setSuccessBanner(
        status === "approved"
          ? `Approved \u00b7 ${updated.full_name} is now live at sof.ai/${updated.slug}.`
          : `Declined \u00b7 ${updated.full_name}'s slug is free for re-claim.`,
      )
    } catch (err) {
      setActionState({
        inflight: null,
        error:
          err instanceof Error
            ? err.message
            : "Network error while saving the review.",
      })
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 lg:px-8 pt-12 pb-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Admin · Pioneer queue
          </p>
          <h1 className="mt-6 font-serif text-4xl sm:text-5xl leading-[1.05] text-foreground">
            Approve the next{" "}
            <span className="italic text-emerald-700">named members</span>.
          </h1>
          <p className="mt-3 max-w-xl text-base text-muted-foreground">
            Reviewing as <span className="font-mono">{adminEmail}</span>. Each
            approval upserts a unified UserProfile across all three sister
            sites and publishes <span className="font-mono">sof.ai/&lt;slug&gt;</span>.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => loadQueue(tab, { keepSelection: true })}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <RefreshCw />
          )}
          Refresh
        </Button>
      </div>

      <div
        className="rule-hairline my-10"
        aria-hidden="true"
      />

      {successBanner ? (
        <div
          role="status"
          aria-live="polite"
          className="mt-2 mb-4 flex items-start gap-2 rounded-md bg-emerald-100/60 px-4 py-3 text-sm text-emerald-900"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="flex-1">{successBanner}</span>
          <button
            type="button"
            onClick={() => setSuccessBanner(null)}
            className="rounded-sm text-emerald-900/70 hover:text-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Application status"
        className="flex flex-wrap gap-2"
      >
        {TAB_LABELS.map((t) => {
          const active = t.id === tab
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-foreground text-background"
                  : "border border-border text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <QueueList
          rows={rows}
          loading={loading}
          loadError={loadError}
          selectedId={selectedId}
          onSelect={setSelectedId}
          tab={tab}
        />
        <DetailPanel
          row={selected}
          tab={tab}
          reviewNote={reviewNote}
          onReviewNoteChange={setReviewNote}
          inflight={actionState.inflight}
          error={actionState.error}
          onApprove={() => submitReview("approved")}
          onDecline={() => submitReview("declined")}
        />
      </div>
    </section>
  )
}

interface QueueListProps {
  rows: PioneerApplicationRecord[]
  loading: boolean
  loadError: string | null
  selectedId: number | null
  onSelect: (id: number) => void
  tab: TabId
}

function QueueList({
  rows,
  loading,
  loadError,
  selectedId,
  onSelect,
  tab,
}: QueueListProps) {
  if (loadError) {
    return (
      <div className="rounded-2xl border border-border/60 bg-background p-8">
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-amber-700">
          <AlertTriangle className="h-4 w-4" />
          Could not load
        </p>
        <p className="mt-3 text-sm text-muted-foreground">{loadError}</p>
      </div>
    )
  }

  if (loading && rows.length === 0) {
    return (
      <div className="rounded-2xl border border-border/60 bg-background p-8">
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading queue
        </p>
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-border/60 bg-background p-8">
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <Inbox className="h-4 w-4" />
          {tab === "pending"
            ? "Inbox zero"
            : tab === "approved"
              ? "No approvals yet"
              : "No declines on file"}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          {tab === "pending"
            ? "No applications are awaiting review."
            : tab === "approved"
              ? "Approved Pioneers will appear here once you review them."
              : "Declined Pioneers will appear here for audit."}
        </p>
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {rows.map((r) => {
        const active = r.id === selectedId
        return (
          <li key={r.id}>
            <button
              type="button"
              onClick={() => onSelect(r.id)}
              aria-pressed={active}
              className={cn(
                "w-full rounded-xl border p-4 text-left transition-colors",
                active
                  ? "border-foreground bg-foreground/5"
                  : "border-border/60 bg-background hover:bg-muted/40",
              )}
            >
              <p className="flex items-center justify-between gap-3">
                <span className="font-serif text-lg text-foreground">
                  {r.full_name}
                </span>
                <StatusPill status={r.status} />
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                sof.ai/{r.slug} · {pathwayLabel(r.pathway)}
              </p>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                “{r.mission_statement}”
              </p>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function StatusPill({ status }: { status: PioneerStatus }) {
  const palette: Record<PioneerStatus, string> = {
    pending: "bg-amber-100/70 text-amber-800",
    approved: "bg-emerald-100/70 text-emerald-800",
    declined: "bg-rose-100/70 text-rose-800",
  }
  return (
    <span
      className={cn(
        "rounded-md px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em]",
        palette[status],
      )}
    >
      {status}
    </span>
  )
}

interface DetailPanelProps {
  row: PioneerApplicationRecord | null
  tab: TabId
  reviewNote: string
  onReviewNoteChange: (s: string) => void
  inflight: null | "approve" | "decline"
  error: string | null
  onApprove: () => void
  onDecline: () => void
}

function DetailPanel({
  row,
  tab,
  reviewNote,
  onReviewNoteChange,
  inflight,
  error,
  onApprove,
  onDecline,
}: DetailPanelProps) {
  if (!row) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 bg-background p-10">
        <p className="font-serif text-2xl text-muted-foreground">
          Pick an application to review.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          The detail view shows the manifesto, the slug being claimed, and
          the controls to approve, decline, or annotate the application.
        </p>
      </div>
    )
  }

  const submitted = formatTimestamp(row.created_at)
  const reviewed = row.reviewed_at ? formatTimestamp(row.reviewed_at) : null

  return (
    <article className="rounded-2xl border border-border/60 bg-background p-6 sm:p-8">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            sof.ai/{row.slug} · {pathwayLabel(row.pathway)}
          </p>
          <h2 className="mt-2 font-serif text-3xl text-foreground">
            {row.full_name}
          </h2>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {row.email}
          </p>
        </div>
        <StatusPill status={row.status} />
      </header>

      <dl className="mt-6 grid grid-cols-1 gap-y-2 gap-x-6 sm:grid-cols-2">
        <Meta label="Submitted">{submitted}</Meta>
        {reviewed ? <Meta label="Reviewed">{reviewed}</Meta> : null}
        {row.reviewed_by_email ? (
          <Meta label="Reviewer">{row.reviewed_by_email}</Meta>
        ) : null}
      </dl>

      <Section title="Mission statement">
        <p className="text-base leading-relaxed text-foreground">
          “{row.mission_statement}”
        </p>
      </Section>

      <Section title="Personal manifesto">
        <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
          {row.personal_statement}
        </p>
      </Section>

      {row.identity_tags.length > 0 ? (
        <Section title="Identity tags">
          <ul className="flex flex-wrap gap-2">
            {row.identity_tags.map((t) => (
              <li
                key={t}
                className="rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground"
              >
                {t}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section title="Review note">
        <label className="sr-only" htmlFor="admin-review-note">
          Review note
        </label>
        <textarea
          id="admin-review-note"
          value={reviewNote}
          onChange={(e) => onReviewNoteChange(e.target.value)}
          maxLength={1000}
          rows={3}
          placeholder="Optional · what tipped this decision"
          className="w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm font-mono leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <p className="mt-1 text-right font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {reviewNote.length} / 1000
        </p>
      </Section>

      {error ? (
        <p className="mt-2 flex items-start gap-2 rounded-md bg-rose-100/60 px-3 py-2 text-sm text-rose-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      ) : null}

      {tab === "pending" ? (
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            onClick={onApprove}
            disabled={inflight !== null}
            className="bg-emerald-700 hover:bg-emerald-800 text-white"
          >
            {inflight === "approve" ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Check />
            )}
            Approve · publish profile
          </Button>
          <Button
            onClick={onDecline}
            disabled={inflight !== null}
            variant="outline"
          >
            {inflight === "decline" ? (
              <Loader2 className="animate-spin" />
            ) : (
              <X />
            )}
            Decline · free the slug
          </Button>
        </div>
      ) : (
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {tab === "approved"
            ? "This Pioneer is published. Switch to Pending to review more."
            : "This application is on the audit shelf. Switch to Pending to review more."}
        </p>
      )}
    </article>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {title}
      </p>
      <div className="mt-2">{children}</div>
    </section>
  )
}

function Meta({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </dt>
      <dd className="font-mono text-xs text-foreground">{children}</dd>
    </div>
  )
}

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return iso
  }
}
