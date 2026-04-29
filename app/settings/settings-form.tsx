"use client"

import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import type {
  ProfileEditPayload,
  UserProfileRecord,
} from "@/lib/userProfile"

const USER_TYPES: { value: string; label: string }[] = [
  { value: "student", label: "Student" },
  { value: "educator", label: "Educator" },
  { value: "researcher", label: "Researcher" },
  { value: "founder", label: "Founder" },
  { value: "corporation", label: "Corporation" },
  { value: "administrator", label: "Administrator" },
]

interface SettingsFormProps {
  email: string
  initialProfile: UserProfileRecord | null
  sessionDisplayName: string
}

interface FormState {
  handle: string
  display_name: string
  user_type: string
  tagline: string
  location: string
  goals: string
  strengths: string
  first_project: string
  twin_name: string
  twin_emoji: string
  devin_session_url: string
  photo_url: string
}

function profileToFormState(
  profile: UserProfileRecord | null,
  email: string,
  sessionDisplayName: string,
): FormState {
  const fallbackHandle = email.split("@")[0]?.toLowerCase().slice(0, 64) ?? ""
  return {
    handle: profile?.handle ?? fallbackHandle,
    display_name: profile?.display_name ?? sessionDisplayName ?? "",
    user_type: profile?.user_type ?? "student",
    tagline: profile?.tagline ?? "",
    location: profile?.location ?? "",
    goals: (profile?.goals ?? []).join("\n"),
    strengths: (profile?.strengths ?? []).join("\n"),
    first_project: profile?.first_project ?? "",
    twin_name: profile?.twin_name ?? "",
    twin_emoji: profile?.twin_emoji ?? "🤖",
    devin_session_url: profile?.devin_session_url ?? "",
    photo_url: profile?.photo_url ?? "",
  }
}

function splitToList(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function getInitials(name: string, email: string): string {
  const source = name.trim() || email.split("@")[0] || ""
  const parts = source.split(/[\s._-]+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export function SettingsForm({
  email,
  initialProfile,
  sessionDisplayName,
}: SettingsFormProps) {
  const [form, setForm] = useState<FormState>(() =>
    profileToFormState(initialProfile, email, sessionDisplayName),
  )
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Auto-dismiss the saved banner after a beat.
  useEffect(() => {
    if (!savedAt) return
    const t = setTimeout(() => setSavedAt(null), 5000)
    return () => clearTimeout(t)
  }, [savedAt])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleAvatar(file: File) {
    setUploading(true)
    setError(null)
    try {
      const body = new FormData()
      body.append("file", file)
      const r = await fetch("/api/upload/avatar", { method: "POST", body })
      const data = (await r.json().catch(() => ({}))) as
        | { url?: string; error?: string }
        | undefined
      if (!r.ok || !data?.url) {
        setError(data?.error ?? `Upload failed (${r.status}).`)
        return
      }
      update("photo_url", data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload: ProfileEditPayload = {
        handle: form.handle.trim(),
        display_name: form.display_name.trim(),
        user_type: form.user_type,
        tagline: form.tagline,
        location: form.location,
        goals: splitToList(form.goals),
        strengths: splitToList(form.strengths),
        first_project: form.first_project,
        twin_name: form.twin_name.trim(),
        twin_emoji: form.twin_emoji.trim() || "🤖",
        devin_session_url: form.devin_session_url.trim(),
        photo_url: form.photo_url.trim(),
      }
      const r = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = (await r.json().catch(() => ({}))) as
        | { error?: string }
        | undefined
      if (!r.ok) {
        setError(data?.error ?? `Save failed (${r.status}).`)
        return
      }
      setSavedAt(Date.now())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="space-y-10" onSubmit={handleSubmit}>
      {/* Avatar */}
      <section className="space-y-3">
        <h2 className="font-serif text-2xl text-foreground">Photo</h2>
        <p className="text-sm text-muted-foreground">
          Square images render best. We accept anything under 4MB.
        </p>
        <div className="flex items-center gap-4">
          {form.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.photo_url}
              alt={`${form.display_name || form.handle}'s avatar`}
              className="h-20 w-20 rounded-full border border-border object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-20 w-20 items-center justify-center rounded-full border border-border bg-muted font-serif text-2xl text-foreground"
            >
              {getInitials(form.display_name, email)}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) void handleAvatar(f)
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? "Uploading…" : form.photo_url ? "Replace photo" : "Upload photo"}
            </Button>
            {form.photo_url ? (
              <button
                type="button"
                className="text-left text-xs text-muted-foreground hover:text-foreground"
                onClick={() => update("photo_url", "")}
              >
                Remove photo
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {/* Identity */}
      <section className="grid gap-4 sm:grid-cols-2">
        <Field label="Display name" htmlFor="display_name">
          <input
            id="display_name"
            value={form.display_name}
            onChange={(e) => update("display_name", e.target.value)}
            maxLength={200}
            className={inputClass}
            placeholder="How your name appears on your profile"
          />
        </Field>
        <Field
          label="Handle"
          htmlFor="handle"
          help={`sof.ai/${form.handle || "your-handle"}`}
        >
          <input
            id="handle"
            value={form.handle}
            onChange={(e) =>
              update(
                "handle",
                e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9._-]/g, "")
                  .slice(0, 64),
              )
            }
            maxLength={64}
            className={inputClass}
            placeholder="ada"
          />
        </Field>
        <Field label="I am a…" htmlFor="user_type">
          <select
            id="user_type"
            value={form.user_type}
            onChange={(e) => update("user_type", e.target.value)}
            className={inputClass}
          >
            {USER_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Location" htmlFor="location">
          <input
            id="location"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
            maxLength={200}
            className={inputClass}
            placeholder="London, UK"
          />
        </Field>
        <Field
          label="Tagline"
          htmlFor="tagline"
          className="sm:col-span-2"
          help="One line. Shown above your manifesto."
        >
          <input
            id="tagline"
            value={form.tagline}
            onChange={(e) => update("tagline", e.target.value)}
            maxLength={300}
            className={inputClass}
            placeholder="Builds compilers. Writes notes that ship."
          />
        </Field>
      </section>

      {/* Movement */}
      <section className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Goals"
          htmlFor="goals"
          className="sm:col-span-2"
          help="One per line. We don't grade these — they steer your twin."
        >
          <textarea
            id="goals"
            value={form.goals}
            onChange={(e) => update("goals", e.target.value)}
            rows={4}
            className={textareaClass}
            placeholder={"Ship my first AI app\nPair with Devin daily"}
          />
        </Field>
        <Field
          label="Strengths"
          htmlFor="strengths"
          className="sm:col-span-2"
          help="One per line."
        >
          <textarea
            id="strengths"
            value={form.strengths}
            onChange={(e) => update("strengths", e.target.value)}
            rows={4}
            className={textareaClass}
            placeholder={"Writing\nResearch"}
          />
        </Field>
        <Field
          label="First project"
          htmlFor="first_project"
          className="sm:col-span-2"
        >
          <textarea
            id="first_project"
            value={form.first_project}
            onChange={(e) => update("first_project", e.target.value)}
            rows={3}
            className={textareaClass}
            maxLength={500}
            placeholder="Analytical engine notes, modernized."
          />
        </Field>
      </section>

      {/* Twin + Devin */}
      <section className="grid gap-4 sm:grid-cols-2">
        <Field label="Twin name" htmlFor="twin_name">
          <input
            id="twin_name"
            value={form.twin_name}
            onChange={(e) => update("twin_name", e.target.value)}
            maxLength={80}
            className={inputClass}
            placeholder="Ada-Twin"
          />
        </Field>
        <Field
          label="Twin emoji"
          htmlFor="twin_emoji"
          help="Used on profile + chat avatars. One emoji."
        >
          <input
            id="twin_emoji"
            value={form.twin_emoji}
            onChange={(e) => update("twin_emoji", e.target.value)}
            maxLength={8}
            className={inputClass}
            placeholder="✨"
          />
        </Field>
        <Field
          label="Devin session URL"
          htmlFor="devin_session_url"
          className="sm:col-span-2"
          help="Optional. Renders a 'Continue in Devin →' button on your profile."
        >
          <input
            id="devin_session_url"
            type="url"
            value={form.devin_session_url}
            onChange={(e) => update("devin_session_url", e.target.value)}
            maxLength={500}
            className={inputClass}
            placeholder="https://app.devin.ai/sessions/…"
          />
        </Field>
      </section>

      {error ? (
        <p
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}
      {savedAt ? (
        <p
          role="status"
          aria-live="polite"
          className="rounded-md bg-emerald-100/60 px-4 py-3 text-sm text-emerald-900"
        >
          Saved. Your profile is live.
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" disabled={saving || uploading}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
        <a
          href={form.handle ? `/${form.handle}` : "/students"}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          View public profile →
        </a>
      </div>
    </form>
  )
}

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"

const textareaClass = `${inputClass} resize-y`

function Field({
  label,
  htmlFor,
  help,
  className,
  children,
}: {
  label: string
  htmlFor: string
  help?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <label htmlFor={htmlFor} className={`block space-y-1.5 ${className ?? ""}`}>
      <span className="block text-sm font-medium text-foreground">{label}</span>
      {children}
      {help ? (
        <span className="block text-xs text-muted-foreground">{help}</span>
      ) : null}
    </label>
  )
}
