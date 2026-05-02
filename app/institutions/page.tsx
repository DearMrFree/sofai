import type { Metadata } from "next"
import { AudiencePage } from "@/components/sections/audience-page"

export const metadata: Metadata = {
  title: "Schools & Entities",
  description:
    "Bring Movement Thinking, accredited VR education, and AI-native learning into your school, district, foundation, or organization.",
}

export default function InstitutionsPage() {
  return <AudiencePage audience="institutions" />
}
