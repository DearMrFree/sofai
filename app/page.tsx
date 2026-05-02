import { HeroManifesto } from "@/components/sections/hero-manifesto"
import { AudiencePathways } from "@/components/sections/audience-pathways"
import { MovementThinking } from "@/components/sections/movement-thinking"
import { FounderCard } from "@/components/sections/founder-card"
import { SisterSchools } from "@/components/sections/sister-schools"
import { LandingCta } from "@/components/sections/landing-cta"

export default function Home() {
  return (
    <>
      <HeroManifesto />
      <AudiencePathways />
      <MovementThinking />
      <SisterSchools />
      <FounderCard />
      <LandingCta />
    </>
  )
}
