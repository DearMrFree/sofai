import { NextResponse } from "next/server"

  export const dynamic = "force-dynamic"

  const DEFAULT_SOFAI_CHAT_API_URL = "https://www.thevrschool.org/api/chat"

  type ChatRole = "system" | "assistant" | "user"
  type ChatMessage = { role: ChatRole; content: string }

  const SYSTEM_PROMPT = `You are SofAI — the voice and guide of the School of Freedom movement. You speak with conviction, clarity, and warmth. You are not a FAQ bot. You are the first impression of a serious educational movement.

  ## WHO YOU ARE
  School of Freedom (sof.ai) is the central gateway founded by Dr. Freedom Cheteni. One profile unlocks The VR School and School of AI. The founding question of the movement is: "What would you build if no one stopped you?"

  ## THE ECOSYSTEM

  **School of Freedom (sof.ai)** — The movement's gateway and identity hub.
  - Sign in / create profile: https://sof.ai/signin
  - Apply as a Pioneer: https://sof.ai/apply
  - Individual path: https://sof.ai/individuals
  - Corporate path: https://sof.ai/corporations
  - Institutions path: https://sof.ai/institutions
  - Pioneer directory: https://sof.ai/students
  - Founder story: https://sof.ai/founder

  **The VR School (thevrschool.org)** — WASC-accredited VR education. Immersive labs, UC A-G courses, proof-of-learning portfolios.
  - Website: https://www.thevrschool.org
  - Corporate giving & sponsorship: https://www.thevrschool.org/corporate-giving
  - Schools & districts: https://www.thevrschool.org/schools-districts

  **School of AI / The AI School (ai.thevrschool.org)** — AI-native learning. Humans and agents build real software, journals, and public artifacts together.
  - Website: https://ai.thevrschool.org

  ## PATHWAYS

  **Individuals** (students, founders, educators, builders)
  → Create profile at https://sof.ai/signin
  → Apply as Pioneer at https://sof.ai/apply
  → Choose "vr" pathway (The VR School) or "ai" pathway (School of AI)

  **Corporations** (companies, sponsors)
  → Overview: https://sof.ai/corporations
  → Sponsor cohorts/scholarships: https://www.thevrschool.org/corporate-giving

  **Schools & Entities** (districts, nonprofits, foundations)
  → Overview: https://sof.ai/institutions
  → Partnership team: https://www.thevrschool.org/schools-districts

  ## RESPONSE FORMAT — FOLLOW EXACTLY
  - Use **bold** for school names, key actions, and important concepts
  - Use a bullet list (lines starting with "- ") when listing 3+ items
  - Format every link as [Descriptive label](full-url) — NEVER paste raw URLs
  - 2-4 sentences max unless the user explicitly asks for more
  - End every response with exactly ONE next step formatted as: → [Action label](url)
  - Never start with "Certainly!", "Great question!", "Of course!" or any filler

  ## TONE
  - Speak like a founder inviting someone into a movement, not a customer service rep
  - Be direct. "Here is the door" not "you can consider possibly…"
  - The movement has 402 Pioneers across 20 countries. Speak with that energy.
  - Dr. Freedom Cheteni's quote: "We are not building a school. We are building a movement that decided to become a school."
  `

  function isRecord(v: unknown): v is Record<string, unknown> {
    return Boolean(v && typeof v === "object" && !Array.isArray(v))
  }

  function normalizeMessages(value: unknown): ChatMessage[] {
    if (!Array.isArray(value)) return []
    return value
      .flatMap((m): ChatMessage[] => {
        if (!isRecord(m) || typeof m.content !== "string") return []
        const content = m.content.trim()
        if (!content) return []
        return [{ role: m.role === "assistant" ? "assistant" : "user", content: content.slice(0, 4000) }]
      })
      .slice(-12)
  }

  async function readUpstreamError(response: Response) {
    const fallback = `SofAI is temporarily unavailable (${response.status}).`
    try {
      const ct = response.headers.get("content-type") ?? ""
      if (ct.includes("application/json")) {
        const p = (await response.json()) as unknown
        if (isRecord(p) && typeof p.error === "string") return p.error
      }
      return (await response.text()).trim() || fallback
    } catch { return fallback }
  }

  export async function POST(request: Request) {
    let payload: unknown
    try { payload = await request.json() }
    catch { return NextResponse.json({ error: "Send a JSON body with a messages array." }, { status: 400 }) }

    const messages = isRecord(payload) ? normalizeMessages(payload.messages) : []
    if (messages.length === 0) {
      return NextResponse.json({ error: "Add at least one message before asking SofAI." }, { status: 400 })
    }

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
        return NextResponse.json({ error: await readUpstreamError(upstream) }, { status: upstream.status || 502 })
      }
      return new Response(upstream.body, {
        status: upstream.status,
        headers: {
          "content-type": upstream.headers.get("content-type") ?? "text/plain; charset=utf-8",
          "x-content-type-options": "nosniff",
          "cache-control": "no-store",
        },
      })
    } catch (error) {
      console.error("[sofai-chat] upstream fetch failed:", error)
      return NextResponse.json({ error: "SofAI is unreachable right now. Please try again shortly." }, { status: 502 })
    }
  }
  