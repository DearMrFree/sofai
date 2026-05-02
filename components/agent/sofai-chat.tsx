"use client"

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react"
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ChatRole = "assistant" | "user"

type ChatMessage = {
  id: string
  role: ChatRole
  content: string
}

const welcomeMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi, I'm SofAI. Ask me about School of Freedom, The VR School, School of AI, Movement Thinking, lessons, or what to build next.",
}

export function SofaiChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage])
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      endOfMessagesRef.current?.scrollIntoView({ block: "end" })
    }
  }, [isOpen, messages])

  async function submitMessage(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault()

    const content = input.trim()

    if (!content || isLoading) {
      return
    }

    const timestamp = Date.now()
    const userMessage: ChatMessage = {
      id: `user-${timestamp}`,
      role: "user",
      content,
    }
    const assistantId = `assistant-${timestamp}`
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
    }
    const nextMessages = [...messages, userMessage]
    const history = nextMessages
      .filter((message) => message.id !== welcomeMessage.id)
      .map(({ role, content }) => ({ role, content }))

    setMessages([...nextMessages, assistantMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: history }),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null

        throw new Error(
          payload?.error ?? "SofAI could not answer that request yet.",
        )
      }

      if (!response.body) {
        throw new Error("SofAI did not return a response.")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantText = ""

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        assistantText += decoder.decode(value, { stream: true })

        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === assistantId
              ? { ...message, content: assistantText }
              : message,
          ),
        )
      }

      const trailingText = decoder.decode()

      if (trailingText) {
        assistantText += trailingText
      }

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === assistantId
            ? {
                ...message,
                content:
                  assistantText.trim() ||
                  "I heard you, but I could not form a full answer. Please try again.",
              }
            : message,
        ),
      )
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "SofAI is unavailable right now. Please try again soon."

      setMessages((currentMessages) =>
        currentMessages.map((chatMessage) =>
          chatMessage.id === assistantId
            ? { ...chatMessage, content: message }
            : chatMessage,
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      void submitMessage()
    }
  }

  return (
    <>
      {!isOpen ? (
        <Button
          aria-label="Open SofAI chat"
          className="fixed bottom-3 right-3 z-50 h-12 w-12 rounded-lg bg-stone-950 p-0 text-white shadow-2xl hover:bg-stone-800 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 sm:bottom-5 sm:right-5 sm:w-auto sm:px-4"
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <MessageCircle className="size-5" />
          <span className="hidden sm:inline">SofAI</span>
        </Button>
      ) : null}

      {isOpen ? (
        <section
          aria-label="SofAI chat"
          className="fixed inset-3 z-50 flex min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-2xl sm:inset-auto sm:bottom-5 sm:right-5 sm:h-[620px] sm:max-h-[calc(100vh-2.5rem)] sm:w-[410px]"
        >
          <header className="flex items-center justify-between gap-3 bg-stone-950 px-4 py-3 text-white dark:bg-stone-900">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Bot className="size-5" />
              </div>
              <div className="min-w-0">
                <h2 className="font-sans text-sm font-semibold tracking-normal">
                  SofAI
                </h2>
                <p className="truncate text-xs text-stone-300">
                  School of Freedom guide
                </p>
              </div>
            </div>
            <Button
              aria-label="Close SofAI chat"
              className="size-9 rounded-md text-white hover:bg-white/10 hover:text-white"
              onClick={() => setIsOpen(false)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <X className="size-5" />
            </Button>
          </header>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-background px-4 py-4">
            {messages.map((message) => (
              <div
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
                key={message.id}
              >
                <div
                  className={cn(
                    "max-w-[86%] rounded-lg px-3 py-2 text-sm leading-relaxed shadow-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-card-foreground",
                  )}
                >
                  {message.content ? (
                    <p className="whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" />
                      <span>Thinking</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={endOfMessagesRef} />
          </div>

          <form
            className="border-t border-border bg-card p-3"
            onSubmit={submitMessage}
          >
            <div className="flex items-end gap-2">
              <textarea
                aria-label="Message SofAI"
                className="max-h-28 min-h-11 flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Ask SofAI..."
                rows={1}
                value={input}
              />
              <Button
                aria-label="Send message"
                className="size-11 rounded-md"
                disabled={!input.trim() || isLoading}
                size="icon"
                type="submit"
              >
                {isLoading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Send className="size-5" />
                )}
              </Button>
            </div>
          </form>
        </section>
      ) : null}
    </>
  )
}
