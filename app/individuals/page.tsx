import type { Metadata } from "next"
import { AudiencePage } from "@/components/sections/audience-page"

export const metadata: Metadata = {
  title: "Individuals",
  description:
    "Create one School of Freedom profile and move across SofAI, The VR School, and School of AI.",
}

export default function IndividualsPage() {
  return <AudiencePage audience="individuals" />
}
