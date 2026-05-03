import { SITE } from "@/lib/site-config"

export interface KBEntry {
  id: string
  keywords: string[]
  response: string
}

function buildEntries(): KBEntry[] {
  const { url, stats, founder, auth, schools, paths, movementThinking, timeline } = SITE

  return [

    {
      id: "greeting",
      keywords: ["hi", "hello", "hey", "good morning", "howdy", "greetings", "yo", "sup"],
      response: `Welcome. I'm SofAI — the guide inside the School of Freedom.

Ask me anything: how to join, what The VR School is, how Movement Thinking works, or what a Pioneer application looks like. I know everything about this movement.

→ [Start with the basics — create your profile](${auth.signin})`,
    },

    {
      id: "what_is_sof",
      keywords: ["what is school of freedom", "what is sof.ai", "what is sof", "tell me about sof", "explain school of freedom", "overview", "about sof", "about school of freedom", "what is this", "what do you do"],
      response: `**School of Freedom** is the unifying gateway for three sister schools: **The VR School** (WASC-accredited VR education), **School of AI** (AI-native agentic learning), and **Movement Thinking** (the philosophy that runs through both).

One sof.ai profile moves with you across all three institutions. ${stats.pioneers} Pioneers from ${stats.countries} countries have come through this door — students, founders, educators, companies, and school districts.

The founding question: *"${SITE.tagline}"*

→ [Explore your path](${url})`,
    },

    {
      id: "get_started",
      keywords: ["how do i start", "first step", "where do i begin", "how to join", "how to get started", "getting started", "what should i do first", "how do i get in", "how do i sign up", "where to start"],
      response: `There are two ways in:

- **Create a profile** — claim your identity, declare your mission, and move across all three schools. Takes two minutes.
- **Apply as a Pioneer** — go deeper. Tell us what you'd build if no one stopped you.

Most people create a profile first, then apply. Both paths start at sof.ai.

→ [Create your profile now](${auth.signin})`,
    },

    {
      id: "create_profile",
      keywords: ["create profile", "sign in", "sign up", "create account", "log in", "login", "register", "account", "my profile", "profile creation", "how to make a profile", "set up profile"],
      response: `Your **sof.ai profile** is your single identity across the entire School of Freedom ecosystem — including The VR School and School of AI.

It takes about two minutes: name, mission statement, and the path you're walking. From there, you can apply to schools, track your progress, and appear in the Pioneer directory.

Sign in is handled through **School of AI's** canonical auth — signed in there means signed in everywhere.

→ [Create your profile](${auth.signin})`,
    },

    {
      id: "individual_path",
      keywords: ["individual", "personal", "student", "founder", "educator", "builder", "learner", "for me", "i want to learn", "i want to join", "individual path", "as an individual"],
      response: `The individual path is for **students, founders, educators, and builders** who want to learn, build, and be seen doing it.

- Create your sof.ai profile — one identity across all three schools
- Apply as a Pioneer and claim your public slug
- Move into **The VR School** for WASC-accredited VR education or **School of AI** for agentic, AI-native learning
- Your profile becomes your portfolio — a live record of what you've built

${stats.pioneers} Pioneers from ${stats.countries} countries have walked this path.

→ [Start your journey](${paths.individuals.url})`,
    },

    {
      id: "corporate_path",
      keywords: ["corporate", "company", "business", "corporation", "sponsor", "sponsorship", "partner", "partnership", "hire", "hiring", "workforce", "talent", "invest", "fund", "challenge brief", "corporate giving"],
      response: `Companies engage with School of Freedom in four ways:

- **Sponsorships** — fund learner cohorts, scholarships, or challenge briefs
- **Challenge-based hiring** — post real problems, evaluate candidates by what they build
- **AI & VR talent pipeline** — connect directly to graduates of School of AI and The VR School
- **Corporate profile** — appear in the sof.ai directory as a mission-aligned partner

The model is proof-of-work, not resume-of-hope.

→ [Explore the corporate path](${paths.corporations.url})`,
    },

    {
      id: "institution_path",
      keywords: ["institution", "school district", "district", "nonprofit", "foundation", "organization", "for schools", "for districts", "schools and districts", "bring this to", "educational institution"],
      response: `School districts, nonprofits, foundations, and educational organizations can partner with School of Freedom to bring **Movement Thinking**, **accredited VR education**, and **AI-native learning** to their learners.

The institutional path includes:
- Connecting your students to WASC-accredited VR coursework via **The VR School**
- Integrating School of AI's agentic learning into existing programs
- Unified learner profiles that move with students across institutions

→ [Explore the institutions path](${paths.institutions.url})`,
    },

    {
      id: "vr_school",
      keywords: ["vr school", "the vr school", "virtual reality school", "thevrschool", "thevrschool.org", "vr education", "vr learning", "virtual classroom", "vr courses"],
      response: `**The VR School** is WASC-accredited and UC A-G approved — a student in Harare and a student in Palo Alto share the same virtual classroom.

- **WASC accreditation** — same standard as traditional brick-and-mortar schools
- **UC A-G approved** — qualifies for University of California admission requirements
- Immersive VR labs replace passive lectures
- Reading proficiency above California state average
- Proof-of-learning portfolios replace standardized tests

→ [Visit The VR School](${schools.vr.url})`,
    },

    {
      id: "school_of_ai",
      keywords: ["school of ai", "ai school", "agentic", "agentic learning", "devin", "claude", "gemini", "ai.thevrschool", "ai native", "pull request", "build with ai", "ai agents"],
      response: `**School of AI** is where humans and AI agents build real things together — not exercises, actual shipped software, scholarly journals, and public artifacts.

Students work alongside **Devin, Claude, Gemini**, and other frontier models as collaborators. The first cohort graduated with public, signed artifacts that live on their sof.ai profiles.

Learn by building. Prove by shipping. Advance by publishing.

→ [Visit School of AI](${schools.ai.url})`,
    },

    {
      id: "pioneer_apply",
      keywords: ["apply", "pioneer", "application", "how to apply", "pioneer application", "apply as a pioneer", "how do i apply", "pioneer program", "join as pioneer"],
      response: `The Pioneer application has one question:

**"What would you build if no one stopped you?"**

No test. No GPA. No essay on extracurriculars. We read every application. If accepted, you receive:
- A public sof.ai profile with your chosen **slug**
- Priority access to cohorts, challenges, and partnerships
- A credential that follows you across all three schools

→ [Apply as a Pioneer](${auth.apply})`,
    },

    {
      id: "pioneer_after",
      keywords: ["after approved", "after application", "what happens after", "approved pioneer", "next steps after", "once approved", "when approved", "if accepted", "when accepted", "after i apply"],
      response: `Once your Pioneer application is approved:

1. **Your profile goes live** — your slug is claimed, your public profile is activated
2. **You appear in the Pioneer directory** — visible to partners, companies, and other schools
3. **Access unlocks** — priority enrollment in VR School cohorts, School of AI programs, and challenge briefs
4. **Your profile becomes your resume** — everything you build links back here

→ [Start your application](${auth.apply})`,
    },

    {
      id: "founder",
      keywords: ["dr freedom", "freedom cheteni", "founder", "who started", "who built", "who created", "who is the founder", "who made this", "dr cheteni", "the architect", "who is freedom"],
      response: `**${founder.name}** is the founder and architect of School of Freedom.

Key chapters of his story:
- **2017** — Built the Moonshot Innovation Diploma alongside Dr. Esther Wojcicki
- **2020** — Presented at the UNESCO Inclusive Policy Lab on education for all 8 billion people
- **2024** — Founded The VR School. WASC-accredited. Reading above state average.
- **2025** — Launched School of AI. First cohort graduated with public artifacts.
- **2026** — School of Freedom: the unifying gateway.

"${founder.quote}"

→ [Read his full story](${founder.url})`,
    },

    {
      id: "movement_thinking",
      keywords: ["movement thinking", "philosophy", "four pillars", "pillars", "what is movement thinking", "framework", "methodology", "educational philosophy", "the pillars"],
      response: `**Movement Thinking** is the philosophy that runs through every part of School of Freedom. Four pillars:

- **Identity** — ${movementThinking.pillars[0]?.description}
- **Pathway** — ${movementThinking.pillars[1]?.description}
- **Practice** — ${movementThinking.pillars[2]?.description}
- **Proof** — ${movementThinking.pillars[3]?.description}

A philosophy that can sell, teach, and scale — poetic enough to be memorable, structured enough for families, sponsors, and districts to act on.

→ [Explore the movement](${url})`,
    },

    {
      id: "wasc",
      keywords: ["wasc", "accreditation", "accredited", "uc a-g", "university of california", "college credit", "transferable", "recognized", "official recognition", "academic recognition"],
      response: `**WASC** (Western Association of Schools and Colleges) is the gold standard for K-12 accreditation in the western United States. The VR School holds full WASC accreditation.

What this means for students:
- Coursework is officially recognized by universities and employers
- **UC A-G approved** courses qualify for University of California admission
- Diplomas carry the same weight as traditional schools
- Credits can transfer to other accredited institutions

→ [Learn more at The VR School](${schools.vr.url})`,
    },

    {
      id: "courses",
      keywords: ["courses", "curriculum", "subjects", "what do you learn", "what do students learn", "classes", "lessons", "programs", "what is taught", "course catalog", "what subjects"],
      response: `**The VR School** offers UC A-G approved courses across core academic subjects — taught inside immersive virtual reality environments.

**School of AI** is project-based rather than course-based. Students choose a build challenge, work alongside AI agents (Devin, Claude, Gemini), and ship real artifacts: software, journals, research. The "curriculum" is the work you produce.

Everything links to your sof.ai profile — every course, project, and credential becomes part of your permanent public record.

→ [Visit The VR School](${schools.vr.url})`,
    },

    {
      id: "cost_pricing",
      keywords: ["cost", "price", "pricing", "tuition", "fee", "fees", "how much", "is it free", "scholarship", "financial aid", "afford", "payment", "pay"],
      response: `Tuition details are handled directly through each school. **The VR School** has specific information for students and families, and scholarship programs are available.

For corporate partners, sponsorships can fund cohorts and learner scholarships — turning cost into investment in your talent pipeline.

Start by creating your sof.ai profile (free), then connect with the team.

→ [Contact The VR School](${schools.vr.url})`,
    },

    {
      id: "timeline_history",
      keywords: ["history", "timeline", "when did", "2017", "2020", "2024", "2025", "2026", "moonshot", "moonshot innovation diploma", "unesco", "esther wojcicki", "how long", "founded"],
      response: `School of Freedom didn't appear overnight:

- **2017** — ${timeline[0]?.body}
- **2020** — ${timeline[1]?.body}
- **2024** — ${timeline[2]?.body}
- **2025** — ${timeline[3]?.body}
- **2026** — ${timeline[4]?.body}

Every milestone builds toward one goal: education that works for all 8 billion people on this planet.

→ [Read the full founder story](${founder.url})`,
    },

    {
      id: "profile_details",
      keywords: ["what is on my profile", "what goes on profile", "profile page", "public profile", "my page", "profile slug", "sof.ai profile", "profile details", "what does my profile show", "profile information"],
      response: `Your **sof.ai profile** is a live public record of your mission and your proof of work:

- Your **name and chosen slug** (e.g., sof.ai/your-name)
- Your **mission statement** — what you're building or pursuing
- Your **pathway** — Individual, Corporate, or Institutional
- A record of **schools, programs, and challenges** completed
- **Artifacts** — shipped work, journals, pull requests, public builds

It's not a résumé you update every six months. It updates as you work inside the ecosystem.

→ [Create your profile](${auth.signin})`,
    },

    {
      id: "stats",
      keywords: ["how many students", "how many pioneers", "how many countries", "stats", "numbers", "size", "how big", "how many people", "community size", "how popular"],
      response: `School of Freedom currently has:

- **${stats.pioneers} Pioneers** — individuals who have claimed a profile and declared their mission
- **${stats.countries} Countries** represented across the community
- **${stats.accreditation} accreditation** — The VR School holds WASC, the highest standard for K-12 in the western US

The community spans students, founders, educators, corporate partners, and school districts — all connected through one identity layer at sof.ai.

→ [Join the movement](${auth.signin})`,
    },

    {
      id: "contact",
      keywords: ["contact", "reach", "email", "talk to someone", "speak to", "get in touch", "how do i contact", "customer support", "help", "support", "team", "reach out"],
      response: `Best ways to reach the School of Freedom team:

- **Individual questions** — the founder is accessible via the [founder profile](${founder.url})
- **Corporate partnerships** — [The VR School corporate page](${schools.vr.links.corporate.url})
- **Schools & districts** — [The VR School schools partnerships page](${schools.vr.links.districts.url})
- **General questions** — start a Pioneer application at [sof.ai/apply](${auth.apply}) and the team will be in touch

School of Freedom is a movement, not a bureaucracy. Every message gets a real response.

→ [Reach the team](${founder.url})`,
    },

    {
      id: "comparison",
      keywords: ["how is it different", "compare", "vs", "versus", "better than", "different from", "traditional school", "traditional education", "how does it compare", "what makes it different", "unique"],
      response: `Traditional education optimizes for compliance. School of Freedom optimizes for **proof of capability**.

- **Identity first** — you have a public profile and mission before a class schedule
- **Proof-of-work, not proof-of-attendance** — what you ship matters more than what you sat through
- **AI as collaborator** — School of AI students work *with* frontier AI, not *about* it
- **Accreditation without walls** — WASC-accredited education in VR, accessible from ${stats.countries}+ countries
- **One profile, three schools** — no fragmented credentials

"${founder.quote2}"

→ [Find your path](${url})`,
    },

    {
      id: "sister_schools",
      keywords: ["sister schools", "three schools", "how do the schools connect", "relationship between", "ecosystem", "all three schools", "sof.ai and vr", "how are they connected"],
      response: `**sof.ai** is the gateway. The two sister schools are the destinations:

- **[The VR School](${schools.vr.url})** — WASC-accredited VR education. UC A-G approved. Immersive, accredited, global.
- **[School of AI](${schools.ai.url})** — AI-native agentic learning. Build real things with Devin, Claude, and Gemini.

One sof.ai profile spans all three. Sign in once, recognized everywhere. Credentials and artifacts from any school appear on your single public profile.

→ [Create your unified profile](${auth.signin})`,
    },

    {
      id: "tell_me_more",
      keywords: ["tell me more", "more details", "elaborate", "explain more", "go deeper", "expand on that", "what else", "and then what"],
      response: `I can go deeper on any part of the ecosystem. Most popular areas:

- **The VR School** — accreditation, virtual classrooms, UC A-G courses
- **School of AI** — agentic learning, what students build, AI collaborators
- **Pioneer application** — the question, approval process, what comes after
- **Corporate partnerships** — sponsorships, challenge briefs, talent pipeline
- **Dr. Freedom Cheteni** — the story and philosophy behind the movement

What would you like to explore?

→ [Full overview — sof.ai](${url})`,
    },

    {
      id: "thanks",
      keywords: ["thank you", "thanks", "great", "awesome", "perfect", "excellent", "amazing", "that helps", "got it", "understood", "makes sense", "appreciate"],
      response: `Glad that's clear. The movement is yours to step into whenever you're ready.

More questions — about the schools, your specific path, or the Pioneer application — I'm here.

→ [Take the next step — sof.ai](${url})`,
    },

  ]
}

const ENTRIES = buildEntries()

const FALLBACK: KBEntry = {
  id: "fallback",
  keywords: [],
  response: `That's a specific question I may not have full details on right now.

What I know well:
- Getting started, profiles, Pioneer applications
- The VR School (WASC + VR) and School of AI (agentic learning)
- Corporate & institution partnerships
- Dr. Freedom Cheteni and the Movement Thinking philosophy

For anything beyond that, reach the team directly via the [founder profile](${SITE.founder.url}).

→ [Explore sof.ai](${SITE.url})`,
}

function scoreEntry(entry: KBEntry, normalized: string): number {
  let score = 0
  for (const kw of entry.keywords) {
    if (normalized.includes(kw.toLowerCase())) {
      score += kw.trim().split(/\s+/).length * 2
    }
  }
  return score
}

export function matchKBEntry(userMessage: string): KBEntry {
  const normalized = userMessage.toLowerCase().replace(/[^\w\s]/g, " ")
  let best: KBEntry | null = null
  let bestScore = 0

  for (const entry of ENTRIES) {
    const score = scoreEntry(entry, normalized)
    if (score > bestScore) {
      bestScore = score
      best = entry
    }
  }

  return best ?? FALLBACK
}
