import type { Metadata } from "next"
import { ApplyForm } from "@/components/sections/apply-form"

export const metadata: Metadata = {
  title: "Apply",
  description:
    "Apply to the School of Freedom. Pick a sister school pathway, write your manifesto, claim your slug.",
}

export default function ApplyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 lg:px-8 pt-12 pb-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        Application · No. 01
      </p>
      <h1 className="mt-6 font-serif text-5xl sm:text-6xl leading-[1.05] text-foreground">
        Tell us what you{" "}
        <span className="italic text-emerald-700">would build</span> if no
        one stopped you.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        We read every application. There is no test. There is one question,
        one pathway, and a slug you'll wear for the rest of the movement.
      </p>

      <div className="rule-hairline my-12" aria-hidden="true" />

      <ApplyForm />
    </section>
  )
}
