import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { COURSES, SECTION_META, getCoursesBySection, type UcSection } from "@/lib/courses"

export const metadata: Metadata = {
  title: "Course Catalog 2026–27 · The VR School",
  description:
    "Complete UC A-G approved course list for The VR School — " +
    String(COURSES.length) +
    " courses across History, English, Mathematics, Science, Languages, Arts, and College-Prep Electives.",
}

const SECTIONS: UcSection[] = ["A", "B", "C", "D", "E", "F", "G"]

type CourseCatalogSearchParams = {
  q?: string
  honors?: string
}

function HonorsBadge() {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 ml-2 align-middle">
      UC Honors
    </span>
  )
}

function matchesSearch(courseTitle: string, query: string) {
  if (!query) return true
  return courseTitle.toLowerCase().includes(query.toLowerCase())
}

export default async function CourseCatalog({
  searchParams,
}: {
  searchParams?: Promise<CourseCatalogSearchParams>
}) {
  const params = (await searchParams) ?? {}
  const query = (params.q ?? "").trim()
  const honorsOnly = params.honors === "1"

  const filtered = COURSES.filter((c) => matchesSearch(c.title, query) && (!honorsOnly || c.ucHonors))
  const total = filtered.length
  const honors = filtered.filter((c) => c.ucHonors).length
  const sections = SECTIONS.slice(0, 6)
  const gCourses = getCoursesBySection("G").filter((c) => matchesSearch(c.title, query) && (!honorsOnly || c.ucHonors))

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border/60 bg-gradient-to-br from-stone-50 to-amber-50/40 dark:from-stone-950 dark:to-stone-900">
        <div className="max-w-5xl mx-auto px-6 py-14 md:py-20">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
            The VR School &middot; Stanford, CA &middot; College Board Code 170588
          </p>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-3">Course Catalog</h1>
          <p className="text-lg text-muted-foreground mb-2">2026&ndash;27 Academic Year &middot; UC A-G Approved</p>
          <p className="text-sm text-muted-foreground mb-6">Track milestone dates at <a href="/courses/deadlines" className="underline underline-offset-4 hover:text-foreground">/courses/deadlines</a>.</p>

          <form className="grid gap-3 sm:grid-cols-[1fr_auto] mb-8" action="/courses" method="get">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search course titles (e.g., AI, Physics, Calculus)"
              className="w-full rounded-lg border border-border/70 bg-background px-3 py-2 text-sm"
            />
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" name="honors" value="1" defaultChecked={honorsOnly} />
              UC Honors only
            </label>
          </form>

          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col">
              <span className="text-2xl font-semibold tabular-nums">{total}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Visible Courses</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-semibold tabular-nums">{honors}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">UC Honors Courses</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-semibold tabular-nums">7</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">A-G Subject Areas</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-14 space-y-16">
        {sections.map((sec) => {
          const meta = SECTION_META[sec]
          const courses = getCoursesBySection(sec).filter((c) => matchesSearch(c.title, query) && (!honorsOnly || c.ucHonors))
          if (courses.length === 0) return null
          return (
            <div key={sec} id={`section-${sec}`}>
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-5xl font-serif text-muted-foreground/30 leading-none select-none">{sec}</span>
                <div>
                  <h2 className="text-xl font-serif">{meta.label}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{courses.length} courses</p>
                </div>
              </div>
              <div className="rounded-xl border border-border/60 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/30">
                    <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider border-b border-border/60">
                      <th className="px-5 py-3 font-medium">Course Title</th>
                      <th className="px-5 py-3 font-medium hidden sm:table-cell">Discipline</th>
                      <th className="px-5 py-3 font-medium hidden md:table-cell">Length</th>
                      <th className="px-5 py-3 font-medium w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {courses.map((c) => (
                      <tr key={c.slug} className="group hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-3.5">
                          <Link href={`/courses/${c.slug}`} className="font-medium group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                            {c.title}
                          </Link>
                          {c.ucHonors && <HonorsBadge />}
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground text-xs hidden sm:table-cell">{c.discipline}</td>
                        <td className="px-5 py-3.5 text-muted-foreground text-xs hidden md:table-cell tabular-nums">{c.length}</td>
                        <td className="px-5 py-3.5 text-muted-foreground">
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
      </section>

      {gCourses.length > 0 && (
        <>
          <div className="rule-hairline max-w-5xl mx-auto px-6" />
          <section className="max-w-5xl mx-auto px-6 py-14" id="section-G">
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-5xl font-serif text-muted-foreground/30 leading-none select-none">G</span>
              <div>
                <h2 className="text-xl font-serif">{SECTION_META.G.label}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{gCourses.length} courses</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {gCourses.map((c) => (
                <Link key={c.slug} href={`/courses/${c.slug}`} className="group flex items-start gap-2 px-4 py-3 rounded-lg border border-border/40 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50/30 dark:hover:bg-amber-950/20 transition-all">
                  <ArrowRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-muted-foreground group-hover:text-amber-600 transition-colors" />
                  <span className="text-sm leading-snug">
                    {c.title}
                    {c.ucHonors && <span className="ml-1.5 inline-flex items-center px-1 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">HON</span>}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
