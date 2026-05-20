export type DeadlineCategory = "Enrollment" | "Coursework" | "Exams" | "Portfolio" | "Admin"

export interface CourseDeadline {
  id: string
  title: string
  date: string
  category: DeadlineCategory
  owner: "Student" | "Teacher" | "Registrar" | "Admin"
  notes: string
}

/**
 * Central deadline calendar for the 2026-27 catalog cycle.
 * Dates are ISO-8601 so sorting and filtering are deterministic.
 */
export const MIT_COURSEWARE_DEADLINES: CourseDeadline[] = [
  {
    id: "fall-enrollment-lock",
    title: "Fall enrollment lock",
    date: "2026-08-14",
    category: "Enrollment",
    owner: "Registrar",
    notes: "Learner section placement and roster finalization for all A-G tracks.",
  },
  {
    id: "q1-syllabus-publish",
    title: "Quarter 1 syllabus publish",
    date: "2026-08-21",
    category: "Coursework",
    owner: "Teacher",
    notes: "Publish objectives, pacing, and rubric checkpoints for each live course shell.",
  },
  {
    id: "q1-progress-check",
    title: "Quarter 1 progress checkpoint",
    date: "2026-10-02",
    category: "Coursework",
    owner: "Student",
    notes: "All students submit first mastery artifacts and advisor conference notes.",
  },
  {
    id: "fall-midterm-window",
    title: "Fall midterm assessment window",
    date: "2026-10-23",
    category: "Exams",
    owner: "Teacher",
    notes: "Standards-aligned midterm scoring posted for transcript preview.",
  },
  {
    id: "fall-portfolio-freeze",
    title: "Fall portfolio evidence freeze",
    date: "2026-11-20",
    category: "Portfolio",
    owner: "Student",
    notes: "Evidence lock for semester 1 public profile publication.",
  },
  {
    id: "spring-enrollment-lock",
    title: "Spring enrollment lock",
    date: "2027-01-15",
    category: "Enrollment",
    owner: "Registrar",
    notes: "Second-semester seat balancing and section transfer freeze.",
  },
  {
    id: "ap-registration-close",
    title: "AP exam registration closes",
    date: "2027-03-05",
    category: "Exams",
    owner: "Admin",
    notes: "Final AP roster submission and accommodations verification.",
  },
  {
    id: "spring-capstone-review",
    title: "Spring capstone review",
    date: "2027-04-16",
    category: "Portfolio",
    owner: "Teacher",
    notes: "Cross-disciplinary capstone review boards and remediation plans.",
  },
  {
    id: "final-grade-post",
    title: "Final grade posting deadline",
    date: "2027-06-04",
    category: "Admin",
    owner: "Registrar",
    notes: "Final transcript grades, honors flags, and GPA exports finalized.",
  },
]

export function sortDeadlinesByDate(deadlines: CourseDeadline[]): CourseDeadline[] {
  return [...deadlines].sort((a, b) => a.date.localeCompare(b.date))
}
