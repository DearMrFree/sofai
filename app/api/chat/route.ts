import { matchKBEntry } from "@/lib/knowledge-base"

export const dynamic = "force-dynamic"
export const runtime = "edge"

type Role = "assistant" | "user"
type Msg = { role: Role; content: string }

function isRecord(v: unknown): v is Record<string, unknown> {
  return Boolean(v && typeof v === "object" && !Array.isArray(v))
}

function normalizeMessages(value: unknown): Msg[] {
  if (!Array.isArray(value)) return []
  return value
    .flatMap((m): Msg[] => {
      if (!isRecord(m) || typeof m.content !== "string") return []
      const content = m.content.trim()
      if (!content) return []
      return [{ role: m.role === "assistant" ? "assistant" : "user", content: content.slice(0, 2000) }]
    })
    .slice(-20)
}

export async function POST(request: Request) {
  let payload: unknown
  try { payload = await request.json() }
  catch {
    return new Response(
      JSON.stringify({ error: "Send a JSON body with a messages array." }),
      { status: 400, headers: { "content-type": "application/json" } },
    )
  }

  const messages = isRecord(payload) ? normalizeMessages(payload.messages) : []
  if (messages.length === 0) {
    return new Response(
      JSON.stringify({ error: "Add at least one message." }),
      { status: 400, headers: { "content-type": "application/json" } },
    )
  }

  // Use the last user message for intent matching
  const lastUserMsg = [...messages].reverse().find(m => m.role === "user")
  if (!lastUserMsg) {
    return new Response(
      JSON.stringify({ error: "No user message found." }),
      { status: 400, headers: { "content-type": "application/json" } },
    )
  }

  const entry = matchKBEntry(lastUserMsg.content)
  const response = entry.response

  // Stream word-by-word for a natural typing feel
  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>()
  const writer = writable.getWriter()
  const enc = new TextEncoder()

  // Adaptive delay: shorter for longer responses so it never drags
  const words = response.split(" ")
  const delay = words.length > 80 ? 8 : words.length > 40 ? 14 : 20

  ;(async () => {
    try {
      for (const word of words) {
        await writer.write(enc.encode(word + " "))
        await new Promise<void>(r => setTimeout(r, delay))
      }
    } finally {
      await writer.close().catch(() => {})
    }
  })()

  return new Response(readable, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "x-content-type-options": "nosniff",
      "cache-control": "no-store",
    },
  })
}
