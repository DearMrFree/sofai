"use client"

  import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react"
  import { Building2, GraduationCap, Landmark, Loader2, Send, Sparkles, X } from "lucide-react"

  import { cn } from "@/lib/utils"

  type ChatRole = "assistant" | "user"

  type ChatMessage = {
    id: string
    role: ChatRole
    content: string
  }

  type UserType = "individual" | "corporation" | "institution" | null

  const welcomeMessage: ChatMessage = {
    id: "welcome",
    role: "assistant",
    content:
      "Hi, I'm SofAI — your guide to the School of Freedom ecosystem. Who are you?",
  }

  const USER_TYPES = [
    {
      key: "individual" as const,
      icon: GraduationCap,
      label: "Individual",
      sub: "Student, founder, or builder",
    },
    {
      key: "corporation" as const,
      icon: Building2,
      label: "Corporation",
      sub: "Company or sponsor",
    },
    {
      key: "institution" as const,
      icon: Landmark,
      label: "School / Entity",
      sub: "District, nonprofit, org",
    },
  ]

  const QUICK_PROMPTS: Record<NonNullable<UserType>, { label: string; prompt: string }[]> = {
    individual: [
      { label: "How do I sign up?", prompt: "How do I create a profile and sign up?" },
      { label: "Apply as a Pioneer", prompt: "How do I apply as a Pioneer and what does that get me?" },
      { label: "VR School vs AI School", prompt: "What is the difference between The VR School and School of AI?" },
      { label: "What is Movement Thinking?", prompt: "What is Movement Thinking?" },
    ],
    corporation: [
      { label: "Corporate partnership", prompt: "How can my company partner with School of Freedom?" },
      { label: "Sponsor a cohort", prompt: "How do we sponsor scholarships or learning cohorts?" },
      { label: "Talent pipeline", prompt: "How does School of Freedom connect us to AI and VR talent?" },
      { label: "Create a profile", prompt: "How does my company create a profile on sof.ai?" },
    ],
    institution: [
      { label: "School partnerships", prompt: "How can our school district partner with School of Freedom?" },
      { label: "Accredited VR pathways", prompt: "Tell me about accredited VR education pathways for schools." },
      { label: "AI-native learning", prompt: "How does School of AI work for institutions?" },
      { label: "Talk to the schools team", prompt: "How do we get in touch with the schools partnerships team?" },
    ],
  }

  const LINKS: Record<NonNullable<UserType>, { label: string; href: string; primary?: boolean }[]> = {
    individual: [
      { label: "Sign in / Create profile", href: "https://sof.ai/signin", primary: true },
      { label: "Apply as a Pioneer", href: "https://sof.ai/apply" },
      { label: "The VR School", href: "https://www.thevrschool.org" },
      { label: "School of AI", href: "https://ai.thevrschool.org" },
    ],
    corporation: [
      { label: "Corporate path", href: "https://sof.ai/corporations", primary: true },
      { label: "Sponsorship & giving", href: "https://www.thevrschool.org/corporate-giving" },
      { label: "Create a profile", href: "https://sof.ai/signin" },
    ],
    institution: [
      { label: "Institutions path", href: "https://sof.ai/institutions", primary: true },
      { label: "Schools & districts", href: "https://www.thevrschool.org/schools-districts" },
      { label: "Create a profile", href: "https://sof.ai/signin" },
    ],
  }

  export function SofaiChat() {
    const [isOpen, setIsOpen] = useState(false)
    const [userType, setUserType] = useState<UserType>(null)
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage])
    const endOfMessagesRef = useRef<HTMLDivElement | null>(null)
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    useEffect(() => {
      if (isOpen) {
        endOfMessagesRef.current?.scrollIntoView({ block: "end" })
      }
    }, [isOpen, messages])

    useEffect(() => {
      const ta = textareaRef.current
      if (ta) {
        ta.style.height = "auto"
        ta.style.height = `${Math.min(ta.scrollHeight, 112)}px`
      }
    }, [input])

    async function submitMessage(
      event?: FormEvent<HTMLFormElement>,
      quickPrompt?: string,
    ) {
      event?.preventDefault()
      const content = (quickPrompt ?? input).trim()
      if (!content || isLoading) return

      const timestamp = Date.now()
      const userMessage: ChatMessage = { id: `user-${timestamp}`, role: "user", content }
      const assistantId = `assistant-${timestamp}`
      const assistantMessage: ChatMessage = { id: assistantId, role: "assistant", content: "" }
      const nextMessages = [...messages, userMessage]
      const history = nextMessages
        .filter((m) => m.id !== welcomeMessage.id)
        .map(({ role, content: c }) => ({ role, content: c }))

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
          const payload = (await response.json().catch(() => null)) as { error?: string } | null
          throw new Error(payload?.error ?? "SofAI could not answer that request yet.")
        }
        if (!response.body) throw new Error("SofAI did not return a response.")

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let assistantText = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          assistantText += decoder.decode(value, { stream: true })
          setMessages((curr) =>
            curr.map((m) => (m.id === assistantId ? { ...m, content: assistantText } : m)),
          )
        }

        const trailing = decoder.decode()
        if (trailing) assistantText += trailing

        setMessages((curr) =>
          curr.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    assistantText.trim() ||
                    "I heard you, but I could not form a full answer. Please try again.",
                }
              : m,
          ),
        )
      } catch (error) {
        const msg =
          error instanceof Error
            ? error.message
            : "SofAI is unavailable right now. Please try again soon."
        setMessages((curr) =>
          curr.map((m) => (m.id === assistantId ? { ...m, content: msg } : m)),
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

    const isWelcomeOnly = messages.length === 1 && messages[0].id === "welcome"
    const links = userType ? LINKS[userType] : null
    const prompts = userType ? QUICK_PROMPTS[userType] : null

    return (
      <>
        {/* ── Trigger ── */}
        {!isOpen && (
          <button
            aria-label="Open SofAI chat"
            className="group fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl px-4 py-3 text-white shadow-[0_8px_32px_rgba(4,120,87,0.45)] transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_40px_rgba(4,120,87,0.65)] sm:bottom-6 sm:right-6"
            style={{ background: "linear-gradient(135deg,#065f46 0%,#047857 60%,#064e3b 100%)" }}
            onClick={() => setIsOpen(true)}
            type="button"
          >
            <span className="absolute inset-0 rounded-2xl ring-2 ring-emerald-400/30 animate-ping pointer-events-none" />
            <Sparkles className="size-4 shrink-0" />
            <span className="text-sm font-semibold tracking-wide">Ask SofAI</span>
          </button>
        )}

        {/* ── Panel ── */}
        {isOpen && (
          <section
            aria-label="SofAI chat"
            className="fixed inset-3 z-50 flex min-h-0 flex-col overflow-hidden rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[660px] sm:max-h-[calc(100vh-3rem)] sm:w-[430px]"
            style={{ animation: "sofai-slide-up 0.28s cubic-bezier(0.34,1.56,0.64,1) both" }}
          >
            {/* Header */}
            <header
              className="relative flex items-center justify-between gap-3 px-4 py-3.5 text-white"
              style={{ background: "linear-gradient(135deg,#065f46 0%,#064e3b 55%,#1a1a2e 100%)" }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 24px)," +
                    "repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 24px)",
                }}
              />
              <div className="relative flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
                  <Sparkles className="size-5 text-emerald-300" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold tracking-wide">SofAI</h2>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
                    <p className="text-xs text-emerald-200/80">School of Freedom guide</p>
                  </div>
                </div>
              </div>
              <button
                aria-label="Close SofAI chat"
                className="relative flex size-8 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/10 hover:text-white"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                <X className="size-4" />
              </button>
            </header>

            {/* Messages */}
            <div
              className="min-h-0 flex-1 overflow-y-auto bg-[#fffaf0] px-4 py-4"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#e7e0d2 transparent" }}
            >
              <div className="flex flex-col gap-3">
                {messages.map((message, i) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2",
                      message.role === "user" ? "justify-end" : "items-end justify-start",
                    )}
                    style={{ animation: `sofai-fade-in 0.22s ease both ${i * 0.04}s` }}
                  >
                    {message.role === "assistant" && (
                      <div className="mb-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-900">
                        <Sparkles className="size-3 text-white" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                        message.role === "user"
                          ? "rounded-br-sm text-white shadow-[0_4px_16px_rgba(4,120,87,0.28)]"
                          : "rounded-bl-sm border border-[#e7e0d2] bg-white text-[#18181b] shadow-sm",
                      )}
                      style={
                        message.role === "user"
                          ? { background: "linear-gradient(135deg,#065f46 0%,#047857 100%)" }
                          : undefined
                      }
                    >
                      {message.content ? (
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      ) : (
                        <div className="flex items-center gap-1 px-1 py-1">
                          <span className="size-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="size-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "140ms" }} />
                          <span className="size-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "280ms" }} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* User-type selector — shown only on welcome screen before type chosen */}
                {isWelcomeOnly && !userType && (
                  <div className="flex flex-col gap-2 mt-1" style={{ animation: "sofai-fade-in 0.3s ease both 0.1s" }}>
                    {USER_TYPES.map(({ key, icon: Icon, label, sub }) => (
                      <button
                        key={key}
                        className="flex items-center gap-3 rounded-xl border border-[#e7e0d2] bg-white px-4 py-3 text-left shadow-sm transition hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-md"
                        onClick={() => setUserType(key)}
                        type="button"
                      >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-stone-950 text-white">
                          <Icon className="size-4" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-[#18181b]">{label}</span>
                          <span className="block text-xs text-[#78716c]">{sub}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* After type chosen: quick prompts + direct links */}
                {isWelcomeOnly && userType && (
                  <div className="flex flex-col gap-3 mt-1" style={{ animation: "sofai-fade-in 0.25s ease both" }}>
                    {/* Quick prompts */}
                    <div className="flex flex-wrap gap-2">
                      {prompts!.map(({ label, prompt }) => (
                        <button
                          key={label}
                          className="rounded-full border border-[#d1c9bc] bg-white px-3 py-1.5 text-xs font-medium text-[#3d3730] shadow-sm transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800"
                          onClick={() => void submitMessage(undefined, prompt)}
                          type="button"
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    {/* Direct links */}
                    <div className="rounded-xl border border-[#e7e0d2] bg-white p-3 shadow-sm">
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#a8a29e]">Quick links</p>
                      <div className="flex flex-col gap-1.5">
                        {links!.map(({ label, href, primary }) => (
                          <a
                            key={href}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              "flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition",
                              primary
                                ? "text-white shadow-sm"
                                : "border border-[#e7e0d2] text-[#3d3730] hover:border-emerald-300 hover:bg-emerald-50",
                            )}
                            style={primary ? { background: "linear-gradient(135deg,#065f46 0%,#047857 100%)" } : undefined}
                          >
                            {label}
                            <span className="ml-2 opacity-60">↗</span>
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Switch type */}
                    <button
                      className="text-center text-[11px] text-[#a8a29e] underline underline-offset-2 hover:text-emerald-700"
                      onClick={() => setUserType(null)}
                      type="button"
                    >
                      Switch type
                    </button>
                  </div>
                )}
              </div>
              <div ref={endOfMessagesRef} />
            </div>

            {/* Input */}
            <form
              className="border-t border-[#e7e0d2] bg-white px-3 py-3"
              onSubmit={submitMessage}
            >
              <div className="flex items-end gap-2 rounded-xl border border-[#e7e0d2] bg-[#fffaf0] px-3 py-2 transition-shadow focus-within:border-emerald-500 focus-within:shadow-[0_0_0_3px_rgba(4,120,87,0.12)]">
                <textarea
                  ref={textareaRef}
                  aria-label="Message SofAI"
                  className="max-h-28 min-h-[28px] flex-1 resize-none bg-transparent text-sm leading-6 text-[#18181b] outline-none placeholder:text-[#b4aca2]"
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Ask SofAI anything…"
                  rows={1}
                  value={input}
                />
                <button
                  aria-label="Send message"
                  className={cn(
                    "mb-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg transition-all",
                    input.trim() && !isLoading
                      ? "text-white shadow-[0_2px_8px_rgba(4,120,87,0.4)] hover:shadow-[0_4px_14px_rgba(4,120,87,0.55)]"
                      : "cursor-not-allowed bg-[#f0e9d8] text-[#b4aca2]",
                  )}
                  style={
                    input.trim() && !isLoading
                      ? { background: "linear-gradient(135deg,#065f46 0%,#047857 100%)" }
                      : undefined
                  }
                  disabled={!input.trim() || isLoading}
                  type="submit"
                >
                  {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-3.5" />}
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-[#b4aca2]">SofAI · School of Freedom</p>
            </form>
          </section>
        )}

        <style>{`
          @keyframes sofai-slide-up {
            from { opacity: 0; transform: translateY(24px) scale(0.96); }
            to   { opacity: 1; transform: translateY(0)   scale(1);    }
          }
          @keyframes sofai-fade-in {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0);   }
          }
        `}</style>
      </>
    )
  }
  