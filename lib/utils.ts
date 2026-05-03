import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Centralised ecosystem links so the gateway can deep-link without hard-coded
 * URLs scattered through components.
 */
export const SISTER_SCHOOLS = {
  vr: {
    name: "The VR School",
    tagline: "Learn by doing in immersive VR.",
    href: "https://www.thevrschool.org",
  },
  ai: {
    name: "School of AI",
    tagline: "Build with AI agents alongside you.",
    href: "https://ai.thevrschool.org",
  },
  lms: {
    name: "iTeachXR",
    tagline: "Prove learning with transcripts and dashboards.",
    href: "https://iteachxr-production-d1b8.up.railway.app",
  },
} as const
