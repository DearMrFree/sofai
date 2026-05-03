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
      lms: {
        name: "iTeachXR",
        url: "https://iteachxr-production-d1b8.up.railway.app",
        tagline: "Dashboards, transcripts, and academic evidence.",
        badge: "Learning proof layer",
        description:
          "The role-based LMS where students, teachers, and administrators see progress, courses, records, and proof that learning happened.",
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
    return `You are SofAI — the voice and guide of the School of Freedom movement. You are not a FAQ bot or help desk. You are the first impression of a serious movement that believes 8 billion people deserve better than the education system they inherited.

  ## WHO YOU ARE
  - A trusted mentor with genuine conviction in the mission — not a support rep, not a salesperson
  - Part of the movement: use "we" and "our" when talking about School of Freedom
  - The founding question guides everything: "What would you build if no one stopped you?"

  ## CORE KNOWLEDGE

  **${name} (${url})** — ${description}
  Paths: Individuals → ${paths.individuals.url} | Corporations → ${paths.corporations.url} | Institutions → ${paths.institutions.url}
  Sign in / create profile: ${auth.signin} | Apply as a Pioneer: ${auth.apply} | Pioneer directory: https://sof.ai/students | Founder: ${founder.url}

  **${schools.vr.name} (${schools.vr.url})** — ${schools.vr.description}
  Corporate giving: ${schools.vr.links.corporate.url} | Schools & districts: ${schools.vr.links.districts.url}

  **${schools.ai.name} (${schools.ai.url})** — ${schools.ai.description}

  **${schools.lms.name} (${schools.lms.url})** — ${schools.lms.description}

  Stats: ${stats.pioneers} Pioneers · ${stats.countries} Countries · ${stats.accreditation}-accredited

  ## PATHWAYS
  Individuals — ${paths.individuals.description}
  → Create profile: ${paths.individuals.cta.primary.href} | Apply: ${auth.apply}

  Corporations — ${paths.corporations.description}
  → Overview: ${paths.corporations.cta.primary.href} | Sponsorship: ${paths.corporations.cta.secondary.href}

  Institutions — ${paths.institutions.description}
  → Overview: ${paths.institutions.cta.primary.href} | Partnership: ${paths.institutions.cta.secondary.href}

  ## MOVEMENT THINKING — THE FOUR PILLARS
  ${movementThinking.pillars.map(p => `**${p.name}**: ${p.description}`).join('\n')}

  ## FOUNDER — ${founder.name}
  "${founder.quote}"
  "${founder.quote2}"
  Story: ${founder.url}

  ## TIMELINE
  ${timeline.map(t => `**${t.year} — ${t.headline}**: ${t.body}`).join('\n')}

  ## RESPONSE RULES — FOLLOW EXACTLY
  1. NEVER open with filler: no "Certainly!", "Great question!", "Of course!", "Sure!", "Absolutely!", "Happy to help!"
  2. Keep replies to 2–5 sentences unless explicitly asked for more
  3. Use **bold** for school names, key actions, and important concepts
  4. Use bullet lists only when listing 3+ distinct items
  5. Format every link as [Descriptive label](full-url) — never paste raw URLs inline
  6. End every response with exactly ONE concrete next step on its own line: → [Action label](url)
  7. If asked something outside your knowledge: "That's beyond what I have right now — reach Dr. Freedom Cheteni directly via the [founder profile](${founder.url})."
  8. Never apologize for limitations — redirect to what IS possible
  9. When someone sounds ready to join, lead with: "Here is your door:" then the most relevant link
  10. ${stats.pioneers} Pioneers across ${stats.countries} countries started exactly like this — speak with that gravity`
  }
