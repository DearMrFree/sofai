/**
   * Single source of truth for the entire School of Freedom ecosystem.
   *
   * Imported by:
   *   - app/api/chat/route.ts       → AI system prompt (auto-updates on deploy)
   *   - components/sections/*.tsx   → page copy  (auto-updates on deploy)
   *
   * To add a school, change a URL, update stats, or add a fact:
   * edit this file only. No FAQ pages. No stale copy.
   */

  export const SITE = {
    name: "School of Freedom",
    url: "https://sof.ai",
    tagline: "What would you build if no one stopped you?",
    description:
      "The gateway into The VR School, School of AI, and Movement Thinking. One profile for individuals, corporations, schools, and partner entities.",

    stats: { pioneers: "402+", countries: "20+", accreditation: "WASC" },

    founder: {
      name: "Dr. Freedom Cheteni",
      title: "Founder and Architect",
      slug: "freedom-cheteni",
      url: "https://sof.ai/founder",
      quote:
        "We are not building a school. We are building a movement that decided to become a school.",
      quote2:
        "Reinvention of societal infrastructure is the only bridge towards improving quality of life for 8 billion people.",
    },

    auth: {
      signin: "https://sof.ai/signin",
      apply: "https://sof.ai/apply",
      canonical: "https://ai.thevrschool.org",
    },

    schools: {
      vr: {
        name: "The VR School",
        url: "https://www.thevrschool.org",
        tagline: "Learn by doing. Earn by proving.",
        badge: "WASC-accredited · UC A-G approved",
        description:
          "WASC-accredited virtual reality education with immersive labs, UC A-G approved courses, and proof-of-learning portfolios. A student in Harare and a student in Palo Alto share the same classroom.",
        links: {
          corporate: {
            url: "https://www.thevrschool.org/corporate-giving",
            label: "Corporate giving & sponsorship",
          },
          districts: {
            url: "https://www.thevrschool.org/schools-districts",
            label: "Schools & districts partnerships",
          },
        },
      },
      ai: {
        name: "School of AI",
        url: "https://ai.thevrschool.org",
        tagline: "Build with AI agents alongside you.",
        badge: "AI-native · Agentic learning",
        description:
          "AI-native school where humans and agents build real software, journals, challenges, and public learning artifacts together. The canonical auth hub for all three sister sites.",
      },
    },

    paths: {
      individuals: {
        url: "https://sof.ai/individuals",
        eyebrow: "For individuals",
        title: "Create a mission profile that moves with you.",
        description:
          "Students, founders, educators, and builders start with one identity — then move into The VR School or School of AI without a separate login.",
        cta: {
          primary: { label: "Create profile", href: "https://sof.ai/signin" },
          secondary: { label: "Apply as a Pioneer", href: "/apply" },
        },
        quickPrompts: [
          "How do I sign up and create a profile?",
          "What is the difference between The VR School and School of AI?",
          "How do I apply as a Pioneer and what does that mean?",
          "What happens after my Pioneer application is approved?",
        ],
      },
      corporations: {
        url: "https://sof.ai/corporations",
        eyebrow: "For corporations",
        title: "Partner with a school network built around proof of work.",
        description:
          "Companies can sponsor learners, fund challenge-based cohorts, support scholarships, and connect workforce needs to AI and VR learning environments.",
        cta: {
          primary: { label: "Explore corporate path", href: "https://sof.ai/corporations" },
          secondary: { label: "Sponsorship & giving", href: "https://www.thevrschool.org/corporate-giving" },
        },
        quickPrompts: [
          "How can my company sponsor learners or cohorts?",
          "What does a corporate partnership with School of Freedom look like?",
          "How do we connect our workforce needs to AI and VR talent?",
          "How do we start a corporate profile on sof.ai?",
        ],
      },
      institutions: {
        url: "https://sof.ai/institutions",
        eyebrow: "For schools & entities",
        title: "Bring Movement Thinking into your school, district, or entity.",
        description:
          "Schools, districts, nonprofits, foundations, and public programs can connect to accredited VR education, AI-native learning, and unified learner profiles.",
        cta: {
          primary: { label: "Explore institutions path", href: "https://sof.ai/institutions" },
          secondary: { label: "Schools & districts", href: "https://www.thevrschool.org/schools-districts" },
        },
        quickPrompts: [
          "How can our school district partner with School of Freedom?",
          "Tell me about accredited VR education pathways for schools.",
          "How does AI-native learning work for institutions?",
          "How do we contact the schools partnerships team?",
        ],
      },
    },

    movementThinking: {
      tagline: "A philosophy that can sell, teach, and scale.",
      description:
        "School of Freedom should feel like the front door to a serious educational company: poetic enough to be memorable, structured enough for families, sponsors, districts, and partners to act.",
      pillars: [
        { name: "Identity", description: "Every learner begins with a named mission and an editable public profile." },
        { name: "Pathway", description: "The gateway routes people to the right school, program, or partnership track." },
        { name: "Practice", description: "Learning becomes visible through VR labs, agentic projects, journals, and shipped work." },
        { name: "Proof", description: "Profiles, portfolios, approvals, and accredited pathways give the movement a credible edge." },
      ],
    },

    timeline: [
      {
        year: "2017",
        headline: "The Moonshot Innovation Diploma",
        body: "Working alongside Dr. Esther Wojcicki, the diploma proved a single idea: a transcript could measure preparedness for the automation economy, not just compliance with it.",
      },
      {
        year: "2020",
        headline: "UNESCO Inclusive Policy Lab",
        body: "Articulated that the only honest yardstick for educational reform is whether it improves the lives of the most disadvantaged 8 billion — not the most successful 8.",
      },
      {
        year: "2024",
        headline: "The VR School",
        body: "WASC-accredited. UC A-G approved. Reading proficiency above state average. A student in Harare and a student in Palo Alto now sit in the same classroom.",
      },
      {
        year: "2025",
        headline: "School of AI",
        body: "Students ship Pull Requests with Devin, draft scholarly journals with Claude, and build alongside Gemini. The first cohort graduated with public, signed artifacts.",
      },
      {
        year: "2026",
        headline: "School of Freedom",
        body: "The unifying gateway. Two sister schools, one philosophy, one identity per student. The movement formalises.",
      },
    ],
  } as const

  // ── System prompt generator ──────────────────────────────────────────────────
  // Called by app/api/chat/route.ts.
  // Update SITE above → AI knowledge updates automatically on next deploy.

  export function generateSystemPrompt(): string {
    const { name, url, description, stats, founder, auth, schools, paths, movementThinking, timeline } = SITE
    return `You are SofAI — the voice and guide of the School of Freedom movement. You speak with conviction, clarity, and warmth. You are not a FAQ bot. You are the first impression of a serious educational movement.

  ## THE ECOSYSTEM

  **${name} (${url})** — ${description}
  - Sign in / create profile: ${auth.signin}
  - Apply as a Pioneer: ${auth.apply}
  - Individual path: ${paths.individuals.url}
  - Corporate path: ${paths.corporations.url}
  - Institutions path: ${paths.institutions.url}
  - Pioneer directory: https://sof.ai/students
  - Founder story: ${founder.url}

  **${schools.vr.name} (${schools.vr.url})** — ${schools.vr.description}
  - Corporate sponsorship: ${schools.vr.links.corporate.url}
  - Schools & districts: ${schools.vr.links.districts.url}

  **${schools.ai.name} (${schools.ai.url})** — ${schools.ai.description}

  ## STATS
  ${stats.pioneers} Pioneers · ${stats.countries} Countries · ${stats.accreditation} Accredited

  ## PATHWAYS BY AUDIENCE

  ### Individuals — ${paths.individuals.description}
  Common questions visitors ask:
  ${paths.individuals.quickPrompts.map(q => `- ${q}`).join('\n')}
  → Sign up: ${paths.individuals.cta.primary.href}
  → Apply: ${auth.apply}

  ### Corporations — ${paths.corporations.description}
  Common questions:
  ${paths.corporations.quickPrompts.map(q => `- ${q}`).join('\n')}
  → Overview: ${paths.corporations.cta.primary.href}
  → Sponsorship: ${paths.corporations.cta.secondary.href}

  ### Schools & Entities — ${paths.institutions.description}
  Common questions:
  ${paths.institutions.quickPrompts.map(q => `- ${q}`).join('\n')}
  → Overview: ${paths.institutions.cta.primary.href}
  → Partnership: ${paths.institutions.cta.secondary.href}

  ## MOVEMENT THINKING — FOUR PILLARS
  ${movementThinking.pillars.map(p => `**${p.name}**: ${p.description}`).join('\n')}

  ## FOUNDER — ${founder.name}
  "${founder.quote}"
  "${founder.quote2}"
  Full story: ${founder.url}

  ## TIMELINE
  ${timeline.map(t => `**${t.year} — ${t.headline}**: ${t.body}`).join('\n')}

  ## RESPONSE FORMAT — REQUIRED
  - Use **bold** for school names, key actions, and important concepts
  - Use bullet lists (lines starting "- ") when listing 3+ items
  - Format every link as [Descriptive label](full-url) — NEVER paste raw URLs
  - 2–4 sentences max unless the user explicitly asks for more
  - End every response with exactly ONE next step: → [Action label](url)
  - Never open with "Certainly!", "Great question!", "Of course!" or any filler

  ## TONE
  - Speak like a founder inviting someone into a movement — not a customer service rep
  - Direct: "Here is the door" not "you might consider possibly…"
  - ${stats.pioneers} Pioneers across ${stats.countries} countries. Speak with that energy.
  - Founding question: "What would you build if no one stopped you?"`
  }
  