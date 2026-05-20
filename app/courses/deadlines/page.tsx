import type { Metadata } from "next"
import { MIT_COURSEWARE_DEADLINES, sortDeadlinesByDate } from "@/lib/course-deadlines"

export const metadata: Metadata = {
  title: "MIT Courseware Deadlines · The VR School",
  description:
    "Operational deadlines for enrollment, coursework, exam registration, portfolio checkpoints, and transcript closeout.",
}

const CATEGORY_STYLE: Record<string, string> = {
  Enrollment: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
  Coursework: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300",
  Exams: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
  Portfolio: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  Admin: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
}

export default function CourseDeadlinesPage() {
  const deadlines = sortDeadlinesByDate(MIT_COURSEWARE_DEADLINES)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">MIT Courseware Deadlines</h1>
        <p className="text-muted-foreground max-w-3xl mb-10">
          Single source of truth for 2026&ndash;27 operational milestones across enrollment, instruction, assessments, portfolio evidence, and final transcript closeout.
        </p>

        <div className="rounded-xl border border-border/60 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider border-b border-border/60">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Milestone</th>
                <th className="px-5 py-3 font-medium hidden sm:table-cell">Owner</th>
                <th className="px-5 py-3 font-medium">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {deadlines.map((item) => (
                <tr key={item.id}>
                  <td className="px-5 py-3 tabular-nums whitespace-nowrap">{item.date}</td>
                  <td className="px-5 py-3">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.notes}</p>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">{item.owner}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${CATEGORY_STYLE[item.category]}`}>
                      {item.category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
