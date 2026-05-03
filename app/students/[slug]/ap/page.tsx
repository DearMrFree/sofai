import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"

// ── AP / Advanced course registry ────────────────────────────
// Keyed by student slug. Expand as students are added.
interface ApCourse {
  ucagId:   string
  subject:  string
  title:    string
  level:    string
  grade:    string
  credits:  number
  year:     string
  schoolYear: string
}

interface ApRegistry {
  name: string
  slug: string
  dashboardUrl: string
  gpa: string
  courses: ApCourse[]
}

const AP_DATA: Record<string, ApRegistry> = {
  jiang: {
    name: "Ian Jiang",
    slug: "jiang",
    dashboardUrl:
      "https://ai.thevrschool.org/api/auth/sso/handoff?domain=iteachxr.com&next=%2Fstudent%2Fdashboard.php",
    gpa: "4.00",
    courses: [
      // ── Grade 9 (2024-2025) ──────────────────────────────
      { ucagId: "YMES6W", subject: "English",          title: "INTSV English Language & Composition",  level: "HGH HON", grade: "A",  credits: 10, year: "9",  schoolYear: "2024-25" },
      { ucagId: "CNJ3S5", subject: "Computer Science", title: "Advanced Computer Science Principles",  level: "HGH HNR", grade: "A",  credits: 10, year: "9",  schoolYear: "2024-25" },
      { ucagId: "PM956E", subject: "History",          title: "Advanced European History",             level: "HON",     grade: "A+", credits: 10, year: "9",  schoolYear: "2024-25" },
      { ucagId: "QS7A5X", subject: "Mathematics",      title: "Advanced Statistics",                   level: "HON",     grade: "A+", credits: 10, year: "9",  schoolYear: "2024-25" },
      { ucagId: "N6LNRQ", subject: "Science",          title: "INTSV Advanced Environmental Science",  level: "HON",     grade: "A",  credits: 10, year: "9",  schoolYear: "2024-25" },
      { ucagId: "PTF4DP", subject: "Visual & Perf Art",title: "ENRCHD Advanced Projects in Digital Arts", level: "HGH HNR", grade: "A+", credits: 10, year: "9", schoolYear: "2024-25" },
      // ── Grade 10 (2025-2026) ─────────────────────────────
      { ucagId: "J8KLTN", subject: "Mathematics",      title: "Advanced Calculus BC",                  level: "HON",     grade: "A+", credits: 5, year: "10", schoolYear: "2025-26" },
      { ucagId: "MBXM7H", subject: "Social Science",   title: "CPrep Psychology",                      level: "HON",     grade: "A+", credits: 5, year: "10", schoolYear: "2025-26" },
      { ucagId: "TX93D7", subject: "Computer Science", title: "ACC Design as Discovery (Stanford)",    level: "ADV",     grade: "A+", credits: 5, year: "10", schoolYear: "2025-26" },
      { ucagId: "JN43W9", subject: "Computer Science", title: "CPrep Computer Science A",              level: "HON",     grade: "A",  credits: 5, year: "10", schoolYear: "2025-26" },
      { ucagId: "J9TR5X", subject: "English",          title: "ACC College Writing",                   level: "GFTED",   grade: "A+", credits: 5, year: "10", schoolYear: "2025-26" },
      { ucagId: "D2DTCB", subject: "Science",          title: "Advanced Physics 2: Algebra Based",     level: "HON",     grade: "A+", credits: 5, year: "10", schoolYear: "2025-26" },
      { ucagId: "ALX47Y", subject: "Science",          title: "Advanced Physics C: Mechanics",         level: "HON",     grade: "A+", credits: 5, year: "10", schoolYear: "2025-26" },
      { ucagId: "KFA8SX", subject: "Science",          title: "ADV Experimental Archaeology in VR",   level: "HGH HON", grade: "A+", credits: 5, year: "10", schoolYear: "2025-26" },
      { ucagId: "H3QAHT", subject: "Social Science",   title: "ENRCHD Government and Policy",         level: "HON",     grade: "A+", credits: 5, year: "10", schoolYear: "2025-26" },
    ],
  },
}

// ── Helpers ───────────────────────────────────────────────────
function gradeColor(g: string) {
  if (g === "A+" || g === "A") return "text-emerald-700 dark:text-emerald-400"
  if (g.startsWith("B"))       return "text-blue-700 dark:text-blue-400"
  return "text-foreground"
}

function levelBadge(level: string) {
  const map: Record<string, string> = {
    "ADV":     "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
    "HON":     "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
    "HGH HON": "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    "HGH HNR": "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    "GFTED":   "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
  }
  return map[level] ?? "bg-muted text-muted-foreground"
}

// ── Page ─────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const d = AP_DATA[params.slug.toLowerCase()]
  if (!d) return { title: "Not Found" }
  return {
    title: `${d.name} — AP & Advanced Courses · The VR School`,
    description: `Complete advanced coursework record for ${d.name} at The VR School, Stanford.`,
  }
}

export default function ApPage({ params }: { params: { slug: string } }) {
  const d = AP_DATA[params.slug.toLowerCase()]
  if (!d) notFound()

  const byYear = d.courses.reduce<Record<string, ApCourse[]>>((acc, c) => {
    const key = `Grade ${c.year} — ${c.schoolYear}`
    ;(acc[key] ??= []).push(c)
    return acc
  }, {})

  const totalCredits = d.courses.reduce((s, c) => s + c.credits, 0)
  const apPlus       = d.courses.filter((c) => c.grade === "A+").length
  const subjects     = [...new Set(d.courses.map((c) => c.subject))]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Header ───────────────────────────────────────────── */}
      <section className="border-b border-border/60 bg-gradient-to-br from-stone-50 to-amber-50/40 dark:from-stone-950 dark:to-stone-900">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <Link
            href={`/students/${params.slug}`}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to {d.name}&rsquo;s portfolio
          </Link>

          <h1 className="text-4xl md:text-6xl font-serif tracking-tight mb-3">
            AP &amp; Advanced Courses
          </h1>
          <p className="text-lg text-muted-foreground mb-8">{d.name} · The VR School</p>

          {/* Summary stats */}
          <div className="flex flex-wrap gap-8">
            {[
              { label: "Advanced Courses",  value: String(d.courses.length) },
              { label: "A+ Grades",          value: String(apPlus) },
              { label: "Credits (adv only)", value: String(totalCredits) },
              { label: "Subject Areas",      value: String(subjects.length) },
              { label: "Cumulative GPA",     value: d.gpa },
            ].map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="text-2xl font-semibold tabular-nums">{s.value}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Course tables by grade year ──────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-14 space-y-14">
        {Object.entries(byYear).map(([yearLabel, courses]) => (
          <div key={yearLabel}>
            <h2 className="text-xl font-serif mb-6 text-muted-foreground">{yearLabel}</h2>
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider">
                    <th className="px-4 py-3 font-medium">Course</th>
                    <th className="px-4 py-3 font-medium">Subject</th>
                    <th className="px-4 py-3 font-medium">Level</th>
                    <th className="px-4 py-3 font-medium">Grade</th>
                    <th className="px-4 py-3 font-medium text-right">Credits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {courses.map((c) => (
                    <tr key={c.ucagId} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3.5 font-medium max-w-xs">{c.title}</td>
                      <td className="px-4 py-3.5 text-muted-foreground text-xs">{c.subject}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-semibold ${levelBadge(c.level)}`}>
                          {c.level}
                        </span>
                      </td>
                      <td className={`px-4 py-3.5 font-bold text-base ${gradeColor(c.grade)}`}>{c.grade}</td>
                      <td className="px-4 py-3.5 text-right tabular-nums text-muted-foreground">{c.credits}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t border-border bg-muted/20">
                  <tr>
                    <td colSpan={4} className="px-4 py-2.5 text-xs text-muted-foreground font-medium">
                      {courses.length} courses
                    </td>
                    <td className="px-4 py-2.5 text-right text-xs font-semibold tabular-nums">
                      {courses.reduce((s, c) => s + c.credits, 0)} cr
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ))}
      </section>

      <div className="rule-hairline max-w-5xl mx-auto px-6" />

      {/* ── Level legend ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <h3 className="text-sm font-semibold mb-4">Course Level Key</h3>
        <div className="flex flex-wrap gap-3 text-xs">
          {[
            ["ADV",     "Advanced / College-Level"],
            ["HON",     "Honors"],
            ["HGH HON","Highest Honors"],
            ["HGH HNR","Highest Honors (alt)"],
            ["GFTED",  "Gifted / Accelerated"],
          ].map(([code, desc]) => (
            <div key={code} className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded font-mono font-semibold ${levelBadge(code)}`}>{code}</span>
              <span className="text-muted-foreground">{desc}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="rule-hairline max-w-5xl mx-auto px-6" />

      {/* ── Dashboard CTA ────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/20">
          <div>
            <p className="font-serif text-xl mb-1">Full official transcript</p>
            <p className="text-sm text-muted-foreground">
              All 32 courses with UC A-G codes, GPA breakdown, and PDF export — inside iTeachXR.
            </p>
          </div>
          <a
            href={d.dashboardUrl}
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Open iTeachXR Dashboard <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  )
}
