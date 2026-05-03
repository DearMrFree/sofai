import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight, GraduationCap, BookOpen, Star, Award, FlaskConical, Cpu, Globe } from "lucide-react"

// ── Student registry ─────────────────────────────────────────
// Add future students here. The subdomain slug must match the
// directory name in [slug]/ and the Vercel domain alias.
type SubjectKey = "english" | "math" | "science" | "cs" | "history" | "art" | "social"

interface CourseRow {
  title: string
  level: string
  grade: string
  credits: number
  year: string
}

interface StudentRecord {
  name: string
  firstName: string
  grade: number
  graduationYear: number
  studentId: string
  gpa: string
  totalCredits: number
  status: string
  email: string
  dashboardUrl: string
  tagline: string
  bio: string
  highlights: { icon: string; label: string; value: string }[]
  subjectStrengths: { subject: string; icon: SubjectKey; description: string }[]
  recentCourses: CourseRow[]
  apCount: number
}

const STUDENTS: Record<string, StudentRecord> = {
  jiang: {
    name: "Ian Jiang",
    firstName: "Ian",
    grade: 10,
    graduationYear: 2029,
    studentId: "28467382VR",
    gpa: "4.00",
    totalCredits: 240,
    status: "Good Standing",
    email: "ian09jiang@gmail.com",
    dashboardUrl:
      "https://ai.thevrschool.org/api/auth/sso/handoff?domain=iteachxr.com&next=%2Fstudent%2Fdashboard.php",
    tagline: "Computer Science · Physics · VR Engineering",
    bio:
      "Ian is a sophomore at The VR School (Stanford) pursuing an accelerated path through advanced computer science, physics, and immersive-technology design. Across two years he has earned a perfect 4.00 GPA while completing college-level coursework through Stanford Continuing Studies and dual-enrollment partnerships.",
    highlights: [
      { icon: "gpa",     label: "Cumulative GPA",  value: "4.00 / 4.00" },
      { icon: "credits", label: "Credits Earned",   value: "240" },
      { icon: "grade",   label: "Current Grade",    value: "10th — Sophomore" },
      { icon: "class",   label: "Graduation",       value: "Class of 2029" },
    ],
    subjectStrengths: [
      {
        subject: "Computer Science",
        icon: "cs",
        description:
          "From CS Principles to AP CS A and a Stanford-affiliated Design as Discovery studio, Ian has built fluency across algorithmic thinking, object-oriented programming, and UX research.",
      },
      {
        subject: "Physics & Engineering",
        icon: "science",
        description:
          "Completed AP Physics 2 and AP Physics C: Mechanics concurrently in 10th grade, alongside an original experimental-archaeology project conducted entirely in virtual reality.",
      },
      {
        subject: "Mathematics",
        icon: "math",
        description:
          "Advanced Statistics (9th) and AP Calculus BC (10th) form the quantitative backbone of his STEM coursework, both earning A+ marks.",
      },
      {
        subject: "Humanities",
        icon: "history",
        description:
          "AP European History, Honors English, College Writing, and Government & Policy round out a genuinely broad intellectual profile.",
      },
    ],
    recentCourses: [
      { title: "Advanced Calculus BC",              level: "HON",     grade: "A+", credits: 5, year: "2025-26" },
      { title: "AP Physics C: Mechanics",            level: "HON",     grade: "A+", credits: 5, year: "2025-26" },
      { title: "AP Physics 2: Algebra Based",        level: "HON",     grade: "A+", credits: 5, year: "2025-26" },
      { title: "Design as Discovery (Stanford)",     level: "ADV",     grade: "A+", credits: 5, year: "2025-26" },
      { title: "CPrep Computer Science A",           level: "HON",     grade: "A",  credits: 5, year: "2025-26" },
      { title: "Experimental Archaeology in VR",     level: "HGH HON", grade: "A+", credits: 5, year: "2025-26" },
      { title: "ACC College Writing",                level: "GFTED",   grade: "A+", credits: 5, year: "2025-26" },
      { title: "ENRCHD Government and Policy",       level: "HON",     grade: "A+", credits: 5, year: "2025-26" },
    ],
    apCount: 14,
  },
}

// ── Helpers ───────────────────────────────────────────────────
const subjectIcons: Record<SubjectKey, React.ReactNode> = {
  cs:      <Cpu      className="w-5 h-5" />,
  science: <FlaskConical className="w-5 h-5" />,
  math:    <Star     className="w-5 h-5" />,
  history: <Globe    className="w-5 h-5" />,
  english: <BookOpen className="w-5 h-5" />,
  art:     <Award    className="w-5 h-5" />,
  social:  <Globe    className="w-5 h-5" />,
}

function gradeColor(g: string) {
  if (g === "A+" || g === "A") return "text-emerald-700 dark:text-emerald-400"
  if (g.startsWith("B"))       return "text-blue-700 dark:text-blue-400"
  return "text-foreground"
}

// ── Page ─────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const s = STUDENTS[params.slug.toLowerCase()]
  if (!s) return { title: "Student Not Found" }
  return {
    title: `${s.name} · The VR School`,
    description: s.bio,
  }
}

export default function StudentPortfolio({ params }: { params: { slug: string } }) {
  const s = STUDENTS[params.slug.toLowerCase()]
  if (!s) notFound()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="border-b border-border/60 bg-gradient-to-br from-stone-50 to-amber-50/40 dark:from-stone-950 dark:to-stone-900">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>The VR School · Stanford, CA · WASC Accredited</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-3">{s.name}</h1>
          <p className="text-lg text-muted-foreground mb-2">
            Grade {s.grade} · Class of {s.graduationYear} · Student #{s.studentId}
          </p>
          <p className="text-sm font-mono text-amber-700 dark:text-amber-400 mb-8">{s.tagline}</p>

          {/* Stats strip */}
          <div className="flex flex-wrap gap-6 mb-10">
            {s.highlights.map((h) => (
              <div key={h.label} className="flex flex-col">
                <span className="text-2xl font-semibold tabular-nums">{h.value}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{h.label}</span>
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div className="flex flex-wrap gap-3">
            <a
              href={s.dashboardUrl}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Go to My Dashboard <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href={`/students/${params.slug}/ap`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-background text-sm font-semibold hover:bg-muted transition-colors"
            >
              View AP Coursework <BookOpen className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Bio ──────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-serif mb-4">Academic Profile</h2>
          <p className="text-base leading-relaxed text-muted-foreground">{s.bio}</p>
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            Enrollment status: <span className="font-medium text-foreground">{s.status}</span>
          </div>
        </div>
      </section>

      <div className="rule-hairline max-w-5xl mx-auto px-6" />

      {/* ── Subject strengths ────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-serif mb-8">Areas of Distinction</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {s.subjectStrengths.map((area) => (
            <div
              key={area.subject}
              className="group p-6 rounded-xl border border-border/60 bg-card hover:border-amber-300 dark:hover:border-amber-700 transition-colors"
            >
              <div className="flex items-center gap-2.5 mb-3 text-amber-700 dark:text-amber-400">
                {subjectIcons[area.icon]}
                <span className="font-semibold text-sm">{area.subject}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{area.description}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="rule-hairline max-w-5xl mx-auto px-6" />

      {/* ── Recent coursework ────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-2xl font-serif">Current Year Highlights</h2>
          <Link
            href={`/students/${params.slug}/ap`}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            All {s.apCount} advanced courses <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase tracking-wider">
                <th className="pb-3 font-medium pr-8">Course</th>
                <th className="pb-3 font-medium pr-8">Level</th>
                <th className="pb-3 font-medium pr-8">Grade</th>
                <th className="pb-3 font-medium">Credits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {s.recentCourses.map((c) => (
                <tr key={c.title} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 pr-8 font-medium">{c.title}</td>
                  <td className="py-3 pr-8 font-mono text-xs text-muted-foreground">{c.level}</td>
                  <td className={`py-3 pr-8 font-bold ${gradeColor(c.grade)}`}>{c.grade}</td>
                  <td className="py-3 tabular-nums text-muted-foreground">{c.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="rule-hairline max-w-5xl mx-auto px-6" />

      {/* ── Footer CTA ───────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/20">
          <div>
            <p className="font-serif text-xl mb-1">{s.firstName}&rsquo;s full academic record</p>
            <p className="text-sm text-muted-foreground">
              Complete transcript, GPA breakdown, and course history — available after sign-in.
            </p>
          </div>
          <a
            href={s.dashboardUrl}
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Open iTeachXR Dashboard <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  )
}
