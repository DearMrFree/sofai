import { generateSystemPrompt } from "@/lib/site-config"

  export const dynamic = "force-dynamic"
  export const runtime = "edge"

  const SYSTEM_PROMPT = generateSystemPrompt()
  const MODEL = "gpt-4o-mini"

  type Role = "system" | "assistant" | "user"
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
        return [{ role: m.role === "assistant" ? "assistant" : "user", content: content.slice(0, 4000) }]
      })
      .slice(-14)
  }

  export async function POST(request: Request) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "SofAI is not configured. OPENAI_API_KEY missing." }),
        { status: 503, headers: { "content-type": "application/json" } },
      )
    }

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
        JSON.stringify({ error: "Add at least one message before asking SofAI." }),
        { status: 400, headers: { "content-type": "application/json" } },
      )
    }

    let openaiRes: Response
    try {
      openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
          stream: true,
          max_tokens: 700,
          temperature: 0.72,
        }),
      })
    } catch {
      return new Response(
        JSON.stringify({ error: "SofAI is unreachable right now. Please try again shortly." }),
        { status: 502, headers: { "content-type": "application/json" } },
      )
    }

    if (!openaiRes.ok || !openaiRes.body) {
      const errText = await openaiRes.text().catch(() => "")
      let userMsg = `SofAI error (${openaiRes.status}). Please try again.`
      try {
        const parsed = JSON.parse(errText) as { error?: { message?: string } }
        if (parsed.error?.message) userMsg = parsed.error.message
      } catch {}
      return new Response(JSON.stringify({ error: userMsg }), {
        status: 502, headers: { "content-type": "application/json" },
      })
    }

    // Transform OpenAI SSE → plain text stream
    const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>()
    const writer = writable.getWriter()
    const enc = new TextEncoder()
    const dec = new TextDecoder()

    ;(async () => {
      const reader = openaiRes.body!.getReader()
      let buf = ""
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buf += dec.decode(value, { stream: true })
          const lines = buf.split("\n")
          buf = lines.pop() ?? ""
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue
            const data = line.slice(6).trim()
            if (data === "[DONE]") continue
            try {
              const chunk = JSON.parse(data) as {
                choices?: Array<{ delta?: { content?: string }; finish_reason?: string | null }>
              }
              const content = chunk.choices?.[0]?.delta?.content
              if (content) await writer.write(enc.encode(content))
            } catch {}
          }
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
  