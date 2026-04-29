import { HeroManifesto } from "@/components/sections/hero-manifesto"
import { MovementThinking } from "@/components/sections/movement-thinking"
import { FounderCard } from "@/components/sections/founder-card"
import { SisterSchools } from "@/components/sections/sister-schools"

export default function Home() {
  return (
    <>
      <HeroManifesto />
      <MovementThinking />
      <FounderCard />
      <SisterSchools />
    </>
  )
}
