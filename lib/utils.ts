import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Centralised links to the two sister schools so the gateway can deep-link
 * into them without hard-coded strings scattered through components.
 */
export const SISTER_SCHOOLS = {
  vr: {
    name: "The VR School",
    tagline: "Learn by doing in immersive VR.",
    href: "https://www.thevrschool.org",
  },
  ai: {
    name: "The AI School",
    tagline: "Build with AI agents alongside you.",
    href: "https://ai.thevrschool.org",
  },
} as const
