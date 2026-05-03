
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, Monitor, Award, BookOpen } from "lucide-react"
import { COURSES, SECTION_META, getCourseBySlug, getCoursesBySection } from "@/lib/courses"

export async function generateStaticParams() {
  return COURSES.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const course = getCourseBySlug(params.slug)
  if (!course) return { title: "Course Not Found" }
  return {
    title: `${course.title} \xb7 The VR School`,
    description: `${course.title} \u2014 Section ${course.section}: ${SECTION_META[course.section].label}. ${course.length}, online delivery${course.ucHonors ? ", UC Honors" : ""}. The VR School, Stanford.`,
  }
}

export default function CoursePage({ params }: { params: { slug: string } }) {
  const course = getCourseBySlug(params.slug)
  if (!course) notFound()

  const sectionMeta = SECTION_META[course.section]
  const related = getCoursesBySection(course.section)
    .filter((c) => c.slug !== course.slug)
    .slice(0, 6)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Header ───────────────────────────────────────────── */}
      <section className="border-b border-border/60 bg-gradient-to-br from-stone-50 to-amber-50/40 dark:from-stone-950 dark:to-stone-900">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Course Catalog
          </Link>

          {/* Section badge */}
          <div className="mb-4">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${sectionMeta.color}`}>
              <span className="font-mono">{course.section}</span>
              <span>{sectionMeta.label}</span>
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-serif tracking-tight mb-6 max-w-3xl leading-tight">
            {course.title}
          </h1>

          {/* Meta strip */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{course.length}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Monitor className="w-4 h-4" />
              <span>Online</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              <span>{course.discipline}</span>
            </div>
            {course.ucHonors && (
              <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
                <Award className="w-4 h-4" />
                <span className="font-semibold">UC Honors</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Content placeholder ──────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="max-w-2xl">
          <div className="p-8 rounded-2xl border border-dashed border-border/80 bg-muted/20 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-5 h-5 text-amber-700 dark:text-amber-400" />
            </div>
            <h2 className="font-serif text-xl mb-2">Course Details Coming Soon</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Full course description, learning objectives, prerequisites, and materials
              for <span className="font-medium text-foreground">{course.title}</span> will
              be published here for the 2026\u201327 academic year.
            </p>
          </div>
        </div>
      </section>

      {/* ── Related courses ──────────────────────────────────── */}
      {related.length > 0 && (
        <>
          <div className="rule-hairline max-w-5xl mx-auto px-6" />
          <section className="max-w-5xl mx-auto px-6 py-12">
            <h3 className="text-lg font-serif mb-6">
              More in Section {course.section} \u2014 {sectionMeta.label}
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {related.map((c) => (
                <Link
                  key={c.slug}
                  href={`/courses/${c.slug}`}
                  className="group p-4 rounded-xl border border-border/60 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50/20 dark:hover:bg-amber-950/10 transition-all"
                >
                  <p className="text-sm font-medium leading-snug group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                    {c.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{c.length}</p>
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <Link
                href="/courses"
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> View full catalog
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
