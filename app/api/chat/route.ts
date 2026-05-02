import { NextResponse } from "next/server"
  import { generateSystemPrompt } from "@/lib/site-config"

  export const dynamic = "force-dynamic"

  const DEFAULT_SOFAI_CHAT_API_URL = "https://www.thevrschool.org/api/chat"

  type ChatRole = "system" | "assistant" | "user"
  type ChatMessage = { role: ChatRole; content: string }

  // Generated from lib/site-config.ts — update that file to change AI knowledge
  const SYSTEM_PROMPT = generateSystemPrompt()

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
  