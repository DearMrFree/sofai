import type { Metadata } from "next"
import { AudiencePage } from "@/components/sections/audience-page"

export const metadata: Metadata = {
  title: "Corporations",
  description:
    "Partner with School of Freedom through sponsorships, challenge briefs, cohorts, and applied AI or VR learning.",
}

export default function CorporationsPage() {
  return <AudiencePage audience="corporations" />
}
