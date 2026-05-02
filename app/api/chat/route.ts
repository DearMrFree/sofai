import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const DEFAULT_SOFAI_CHAT_API_URL = "https://www.thevrschool.org/api/chat"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

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

  try {
    const upstream = await fetch(
      process.env.SOFAI_CHAT_API_URL ?? DEFAULT_SOFAI_CHAT_API_URL,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages }),
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
        "cache-control": "no-cache, no-transform",
        "content-type":
          upstream.headers.get("content-type") ?? "text/plain; charset=utf-8",
      },
    })
  } catch {
    return NextResponse.json(
      { error: "SofAI could not be reached. Please try again in a moment." },
      { status: 502 },
    )
  }
}
