import { NextResponse } from "next/server"

  export const dynamic = "force-dynamic"

  const DEFAULT_SOFAI_CHAT_API_URL = "https://www.thevrschool.org/api/chat"

  type ChatRole = "system" | "assistant" | "user"

  type ChatMessage = {
    role: ChatRole
    content: string
  }

  const SYSTEM_PROMPT = `You are SofAI, the official conversational guide for the School of Freedom ecosystem. You are warm, direct, and knowledgeable. You never make up information. When you don't know something specific, you direct the user to the right page or contact.

  ## THE ECOSYSTEM

  ### School of Freedom (sof.ai)
  School of Freedom is the central gateway and identity hub for the entire ecosystem. It is founded by Dr. Freedom Cheteni. One profile on sof.ai grants access to all three schools. It is not a school itself — it is the movement's front door.
  - Website: https://sof.ai
  - Sign in / create profile: https://sof.ai/signin
  - Apply as a Pioneer: https://sof.ai/apply
  - Pioneer directory: https://sof.ai/students
  - Founder story: https://sof.ai/founder

  ### The VR School (thevrschool.org)
  WASC-accredited virtual reality education. Immersive labs, UC A-G approved courses, proof-of-learning portfolios, and VR experiences that replace passive classroom instruction.
  - Website: https://www.thevrschool.org
  - Corporate giving & sponsorship: https://www.thevrschool.org/corporate-giving
  - Schools & districts partnerships: https://www.thevrschool.org/schools-districts

  ### School of AI / The AI School (ai.thevrschool.org)
  An AI-native school where humans build real software, journals, challenges, and public learning artifacts alongside AI agents. The auth hub for the entire ecosystem — sign-in here flows through all sister sites.
  - Website: https://ai.thevrschool.org
  - Sign in (canonical for all sites): https://ai.thevrschool.org/signin

  ## PATHWAYS BY USER TYPE

  ### For Individuals (students, founders, educators, curious builders)
  - Learn about the individual path: https://sof.ai/individuals
  - Create a profile (one identity across all schools): https://sof.ai/signin
  - Apply as a Pioneer (claim a slug + pathway): https://sof.ai/apply
  - Choosing a pathway: "vr" for VR School, "ai" for School of AI
  - After approval, profile is public at https://sof.ai/[your-slug]

  ### For Corporations (companies, sponsors, employers)
  - Learn about the corporate path: https://sof.ai/corporations
  - Sponsor scholarships, cohorts, labs, or public challenges: https://www.thevrschool.org/corporate-giving
  - Create a profile: https://sof.ai/signin
  - Corporate partners can fund challenge briefs, connect workforce needs to AI/VR talent pipelines

  ### For Schools & Entities (school districts, nonprofits, foundations, public programs)
  - Learn about the institutions path: https://sof.ai/institutions
  - Talk to the schools team / district partnerships: https://www.thevrschool.org/schools-districts
  - Create a profile: https://sof.ai/signin
  - Benefits: accredited VR pathways, AI-native learning, unified learner profiles, Movement Thinking integration

  ## MOVEMENT THINKING
  Movement Thinking is the philosophy behind the ecosystem. Its four pillars:
  1. Identity — every learner starts with a named mission and a public profile
  2. Pathway — the gateway routes people to the right school, program, or partnership
  3. Practice — learning becomes visible through VR labs, agentic projects, journals, and shipped work
  4. Proof — profiles, portfolios, approvals, and accredited pathways give the movement a credible edge

  ## DR. FREEDOM CHETENI
  Founder and architect of the entire School of Freedom ecosystem. His guiding quote: "We are not building a school. We are building a movement that decided to become a school." Read his story at https://sof.ai/founder.

  ## SIGN-IN & AUTHENTICATION
  - Sign in happens at: https://sof.ai/signin (or via https://ai.thevrschool.org which owns auth for all three sister sites)
  - Magic-link email login is available (no password needed)
  - Google OAuth is also supported
  - One account works across sof.ai, thevrschool.org, and ai.thevrschool.org

  ## APPLYING AS A PIONEER
  - Application page: https://sof.ai/apply
  - There is no test. Applicants write a mission statement, choose a pathway (VR or AI), and claim a unique slug
  - Applications are reviewed by the team
  - Approved Pioneers get a public profile at https://sof.ai/[slug]

  ## RESPONSE GUIDELINES
  - Always include the specific URL when directing someone to a page — make it clickable in your response
  - If someone asks where to sign up, give them the direct link: https://sof.ai/signin
  - If someone asks about VR, point them to https://www.thevrschool.org
  - If someone asks about AI School or AI learning, point them to https://ai.thevrschool.org
  - If someone is a company, lead with https://sof.ai/corporations then https://www.thevrschool.org/corporate-giving
  - If someone represents a school or district, lead with https://sof.ai/institutions then https://www.thevrschool.org/schools-districts
  - Keep answers concise (2-4 sentences) unless the user asks for detail
  - Never invent programs, pricing, dates, or names that aren't in this prompt
  `

  function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value && typeof value === "object" && !Array.isArray(value))
  }

  function normalizeMessages(value: unknown): ChatMessage[] {
    if (!Array.isArray(value)) {
      return []
    }

    return value
      .flatMap((message): ChatMessage[] => {
        if (!isRecord(message) || typeof message.content !== "string") {
          return []
        }

        const content = message.content.trim()

        if (!content) {
          return []
        }

        return [
          {
            role: message.role === "assistant" ? "assistant" : "user",
            content: content.slice(0, 4000),
          },
        ]
      })
      .slice(-12)
  }

  async function readUpstreamError(response: Response) {
    const fallback = `SofAI is temporarily unavailable (${response.status}).`
    const contentType = response.headers.get("content-type") ?? ""

    try {
      if (contentType.includes("application/json")) {
        const payload = (await response.json()) as unknown

        if (isRecord(payload) && typeof payload.error === "string") {
          return payload.error
        }
      }

      const text = await response.text()

      return text.trim() || fallback
    } catch {
      return fallback
    }
  }

  export async function POST(request: Request) {
    let payload: unknown

    try {
      payload = await request.json()
    } catch {
      return NextResponse.json(
        { error: "Send a JSON body with a messages array." },
        { status: 400 },
      )
    }

    const messages = isRecord(payload) ? normalizeMessages(payload.messages) : []

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "Add at least one chat message before asking SofAI." },
        { status: 400 },
      )
    }

    // Prepend system prompt so the upstream model knows the full ecosystem
    const messagesWithSystem: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ]

    try {
      const upstream = await fetch(
        process.env.SOFAI_CHAT_API_URL ?? DEFAULT_SOFAI_CHAT_API_URL,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: messagesWithSystem }),
          cache: "no-store",
        },
      )

      if (!upstream.ok || !upstream.body) {
        return NextResponse.json(
          { error: await readUpstreamError(upstream) },
          { status: upstream.status || 502 },
        )
      }

      return new Response(upstream.body, {
        status: upstream.status,
        headers: {
          "content-type":
            upstream.headers.get("content-type") ?? "text/plain; charset=utf-8",
          "x-content-type-options": "nosniff",
          "cache-control": "no-store",
        },
      })
    } catch (error) {
      console.error("[sofai-chat] upstream fetch failed:", error)
      return NextResponse.json(
        { error: "SofAI is unreachable right now. Please try again shortly." },
        { status: 502 },
      )
    }
  }
  