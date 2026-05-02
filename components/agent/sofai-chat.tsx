"use client"

  import {
    FormEvent,
    KeyboardEvent,
    useEffect,
    useRef,
    useState,
  } from "react"
  import {
    Building2,
    Check,
    Copy,
    GraduationCap,
    Landmark,
    Loader2,
    Send,
    Sparkles,
    X,
  } from "lucide-react"
  import { cn } from "@/lib/utils"
  import { useChatContext } from "@/components/providers/chat-provider"
  import { SITE } from "@/lib/site-config"

  type ChatRole = "assistant" | "user"
  type ChatMessage = { id: string; role: ChatRole; content: string }

  const PIONEER_QUOTES = [
    { quote: SITE.founder.quote, name: SITE.founder.name, title: "Founder, School of Freedom" },
    { quote: SITE.founder.quote2, name: SITE.founder.name, title: "Architect of the movement" },
  ]

  const PATHS = [
    {
      key: "individual",
      icon: GraduationCap,
      label: "I want to learn and build",
      sub: "Student · Founder · Educator · Builder",
      message: "I'm an individual — a student, founder, or builder — looking to join School of Freedom. What's my path in?",
    },
    {
      key: "corporation",
      icon: Building2,
      label: "My company wants to partner",
      sub: "Sponsor · Hire · Invest in talent",
      message: "I represent a company interested in partnering with School of Freedom. What are our options?",
    },
    {
      key: "institution",
      icon: Landmark,
      label: "My school wants to bring this in",
      sub: "District · Nonprofit · Foundation · Org",
      message: "I work for a school, district, or organization and want to explore bringing Movement Thinking and VR/AI learning to our institution.",
    },
  ]

  const CTA_MAP: { pattern: RegExp; href: string; label: string; desc: string; cta: string; primary?: boolean }[] = [
    { pattern: /sof\.ai\/apply/, href: "https://sof.ai/apply", label: "Apply as a Pioneer", desc: "Claim your slug. Declare your mission.", cta: "Apply now", primary: true },
    { pattern: /sof\.ai\/signin|create.*profile|sign.*up/i, href: "https://sof.ai/signin", label: "Create your profile", desc: "One identity across all three schools.", cta: "Get started", primary: true },
    { pattern: /thevrschool\.org\/corporate-giving/, href: "https://www.thevrschool.org/corporate-giving", label: "Corporate sponsorship", desc: "Fund cohorts, scholarships & challenges.", cta: "Partner →" },
    { pattern: /thevrschool\.org\/schools-districts/, href: "https://www.thevrschool.org/schools-districts", label: "Schools & districts", desc: "Accredited VR education for your org.", cta: "Talk to us →" },
    { pattern: /(?:www\.)?thevrschool\.org(?!\/corporate|\/schools)/i, href: "https://www.thevrschool.org", label: "The VR School", desc: "WASC-accredited immersive VR education.", cta: "Open →" },
    { pattern: /ai\.thevrschool\.org/i, href: "https://ai.thevrschool.org", label: "School of AI", desc: "AI-native learning built around proof of work.", cta: "Open →" },
  ]

  function renderInline(text: string, kp: string) {
    const parts: React.ReactNode[] = []
    const re = /(\*\*(.+?)\*\*|\*([^*]+?)\*|\[([^\]]+)\]\((https?:\/\/[^)]+)\)|(https?:\/\/[^\s,;)>]+))/g
    let last = 0, m: RegExpExecArray | null
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) parts.push(text.slice(last, m.index))
      if (m[2]) parts.push(<strong key={`${kp}b${m.index}`} className="font-semibold text-[#18181b]">{m[2]}</strong>)
      else if (m[3]) parts.push(<em key={`${kp}i${m.index}`}>{m[3]}</em>)
      else if (m[4] && m[5]) parts.push(
        <a key={`${kp}a${m.index}`} href={m[5]} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 rounded bg-emerald-50 px-1.5 py-0.5 text-[0.8em] font-medium text-emerald-800 hover:bg-emerald-100 transition">
          {m[4]}<span className="opacity-40 text-[0.85em]">↗</span>
        </a>
      )
      else if (m[6]) { const u = m[6].replace(/[.,;]$/, ""); parts.push(<a key={`${kp}u${m.index}`} href={u} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline underline-offset-2 hover:text-emerald-900 break-all">{u}</a>) }
      last = m.index + m[0].length
    }
    if (last < text.length) parts.push(text.slice(last))
    return parts
  }

  function MarkdownMsg({ text, kp }: { text: string; kp: string }) {
    const lines = text.split("\n")
    const nodes: React.ReactNode[] = []
    let i = 0
    while (i < lines.length) {
      const line = lines[i]!
      if (/^[-*•]\s/.test(line)) {
        const items: string[] = []
        while (i < lines.length && /^[-*•]\s/.test(lines[i]!)) { items.push(lines[i]!.replace(/^[-*•]\s/, "")); i++ }
        nodes.push(<ul key={`ul${i}`} className="my-1.5 space-y-1">{items.map((it, j) => <li key={j} className="flex items-start gap-2"><span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-emerald-500" /><span>{renderInline(it, `${kp}ul${i}${j}`)}</span></li>)}</ul>)
        continue
      }
      if (/^\d+\.\s/.test(line)) {
        const items: string[] = []
        while (i < lines.length && /^\d+\.\s/.test(lines[i]!)) { items.push(lines[i]!.replace(/^\d+\.\s/, "")); i++ }
        nodes.push(<ol key={`ol${i}`} className="my-1.5 space-y-1">{items.map((it, j) => <li key={j} className="flex items-start gap-2"><span className="font-semibold text-emerald-600 shrink-0 w-4">{j+1}.</span><span>{renderInline(it, `${kp}ol${i}${j}`)}</span></li>)}</ol>)
        continue
      }
      if (line.startsWith("→")) { nodes.push(<p key={`cta${i}`} className="mt-2 font-medium text-emerald-700">{renderInline(line, `${kp}cta${i}`)}</p>); i++; continue }
      if (line.trim() === "") { nodes.push(<div key={`br${i}`} className="h-1.5" />); i++; continue }
      nodes.push(<p key={`p${i}`}>{renderInline(line, `${kp}p${i}`)}</p>)
      i++
    }
    return <div className="space-y-0.5">{nodes}</div>
  }

  function extractCtas(text: string) {
    const seen = new Set<string>()
    return CTA_MAP.filter(({ pattern, href }) => { if (pattern.test(text) && !seen.has(href)) { seen.add(href); return true } return false })
  }

  function CopyBtn({ text }: { text: string }) {
    const [copied, setCopied] = useState(false)
    return (
      <button className="flex size-6 items-center justify-center rounded text-[#a8a29e] hover:bg-[#f5efe2] hover:text-[#57534e] transition" title="Copy"
        onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800) }} type="button">
        {copied ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
      </button>
    )
  }

  export function SofaiChat() {
    const { isOpen, pendingMessage, open, close, clearPending } = useChatContext()
    const [started, setStarted] = useState(false)
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [quoteIdx] = useState(() => Math.floor(Math.random() * PIONEER_QUOTES.length))
    const endRef = useRef<HTMLDivElement | null>(null)
    const taRef = useRef<HTMLTextAreaElement | null>(null)

    // Auto-scroll
    useEffect(() => { if (isOpen) endRef.current?.scrollIntoView({ block: "end" }) }, [isOpen, messages])

    // Auto-resize textarea
    useEffect(() => {
      const ta = taRef.current
      if (ta) { ta.style.height = "auto"; ta.style.height = `${Math.min(ta.scrollHeight, 112)}px` }
    }, [input])

    // Handle pending message from any page AskSofAI button
    useEffect(() => {
      if (pendingMessage && isOpen) {
        void submitMessage(undefined, pendingMessage)
        clearPending()
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pendingMessage, isOpen])

    async function submitMessage(event?: FormEvent<HTMLFormElement>, preset?: string) {
      event?.preventDefault()
      const content = (preset ?? input).trim()
      if (!content || isLoading) return
      if (!started) setStarted(true)

      const ts = Date.now()
      const userMsg: ChatMessage = { id: `u${ts}`, role: "user", content }
      const asstId = `a${ts}`
      const asstMsg: ChatMessage = { id: asstId, role: "assistant", content: "" }
      const history = [...messages, userMsg].map(({ role, content: c }) => ({ role, content: c }))

      setMessages(prev => [...prev, userMsg, asstMsg])
      setInput("")
      setIsLoading(true)

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: history }),
        })
        if (!res.ok) {
          const p = (await res.json().catch(() => null)) as { error?: string } | null
          throw new Error(p?.error ?? "SofAI could not answer that.")
        }
        if (!res.body) throw new Error("No response from SofAI.")

        const reader = res.body.getReader()
        const dec = new TextDecoder()
        let text = ""
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          text += dec.decode(value, { stream: true })
          setMessages(c => c.map(m => m.id === asstId ? { ...m, content: text } : m))
        }
        const trail = dec.decode()
        if (trail) text += trail
        setMessages(c => c.map(m => m.id === asstId ? { ...m, content: text.trim() || "I heard you, but couldn't form a full answer. Try again." } : m))
      } catch (err) {
        const msg = err instanceof Error ? err.message : "SofAI is unavailable right now."
        setMessages(c => c.map(m => m.id === asstId ? { ...m, content: msg } : m))
      } finally {
        setIsLoading(false)
      }
    }

    function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void submitMessage() }
    }

    const quote = PIONEER_QUOTES[quoteIdx]!
    const userMsgCount = messages.filter(m => m.role === "user").length

    return (
      <>
        {/* Trigger */}
        {!isOpen && (
          <button aria-label="Open SofAI" type="button"
            className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl px-4 py-3 text-white transition-all duration-300 hover:scale-105 sm:bottom-6 sm:right-6"
            style={{ background: "linear-gradient(135deg,#065f46 0%,#047857 60%,#064e3b 100%)", boxShadow: "0 8px 32px rgba(4,120,87,0.45)" }}
            onClick={() => open()}>
            <span className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-emerald-400/30 animate-ping" />
            <Sparkles className="size-4 shrink-0" />
            <span className="text-sm font-semibold tracking-wide">Ask SofAI</span>
          </button>
        )}

        {/* Panel */}
        {isOpen && (
          <section aria-label="SofAI" className="fixed inset-3 z-50 flex min-h-0 flex-col overflow-hidden rounded-2xl sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[680px] sm:max-h-[calc(100vh-3rem)] sm:w-[440px]"
            style={{ animation: "sofai-up 0.3s cubic-bezier(0.34,1.56,0.64,1) both", boxShadow: "0 32px 96px rgba(0,0,0,0.2), 0 8px 24px rgba(0,0,0,0.1)" }}>

            {/* Header */}
            <header className="relative z-10 flex shrink-0 items-center justify-between gap-3 px-4 py-3 text-white"
              style={{ background: "linear-gradient(135deg,#065f46 0%,#064e3b 55%,#111827 100%)" }}>
              <div className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{ backgroundImage: "repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 24px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 24px)" }} />
              <div className="relative flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20"><Sparkles className="size-5 text-emerald-300" /></div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold">SofAI</h2>
                    <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300">Live</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-white/60">{SITE.stats.pioneers} Pioneers · {SITE.stats.countries} Countries · {SITE.stats.accreditation} Accredited</p>
                </div>
              </div>
              <button aria-label="Close" onClick={close} type="button"
                className="relative flex size-8 items-center justify-center rounded-lg text-white/50 transition hover:bg-white/10 hover:text-white"><X className="size-4" /></button>
            </header>

            {/* Body */}
            <div className="relative min-h-0 flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#e7e0d2 transparent" }}>
              <div className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%,rgba(4,120,87,0.06) 0%,transparent 70%),radial-gradient(ellipse 60% 40% at 100% 100%,rgba(217,119,6,0.04) 0%,transparent 70%),#fffaf0" }} />

              <div className="relative px-4 py-4">
                {/* Welcome manifesto */}
                {!started && (
                  <div className="flex flex-col gap-4" style={{ animation: "sofai-in 0.35s ease both" }}>
                    <div className="rounded-2xl border border-[#e7e0d2] bg-white p-5 shadow-sm">
                      <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-emerald-600">{SITE.name}</p>
                      <h3 className="font-serif text-xl leading-snug text-[#18181b]">"{SITE.tagline}"</h3>
                      <p className="mt-2 text-[13px] leading-relaxed text-[#78716c]">That is the founding question. SofAI is your guide into the movement — pick your path below or just ask anything.</p>
                    </div>

                    <div className="rounded-xl border border-[#ede8dc] bg-[#fdf8f0] px-4 py-3.5">
                      <p className="text-[12px] italic leading-relaxed text-[#57534e]">"{quote.quote}"</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex size-6 items-center justify-center rounded-full bg-stone-950 font-serif text-[10px] text-white">FC</div>
                        <div><p className="text-[11px] font-semibold text-[#18181b]">{quote.name}</p><p className="text-[10px] text-[#a8a29e]">{quote.title}</p></div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-[#a8a29e]">Choose your path</p>
                      {PATHS.map(({ key, icon: Icon, label, sub, message }) => (
                        <button key={key} type="button"
                          className="group flex items-center gap-3.5 rounded-xl border border-[#e7e0d2] bg-white px-4 py-3.5 text-left shadow-sm transition hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-md"
                          onClick={() => void submitMessage(undefined, message)}>
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-stone-950 text-white transition group-hover:bg-emerald-800"><Icon className="size-4" /></span>
                          <span className="min-w-0"><span className="block text-[13px] font-semibold text-[#18181b]">{label}</span><span className="block text-[11px] text-[#78716c]">{sub}</span></span>
                          <span className="ml-auto text-[#d1c9bc] transition group-hover:text-emerald-500">→</span>
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[{ val: SITE.stats.pioneers, label: "Pioneers" }, { val: SITE.stats.countries, label: "Countries" }, { val: SITE.stats.accreditation, label: "Accredited" }].map(({ val, label }) => (
                        <div key={label} className="rounded-lg border border-[#e7e0d2] bg-white py-2.5 text-center shadow-sm">
                          <p className="font-serif text-lg text-[#18181b]">{val}</p>
                          <p className="text-[10px] text-[#a8a29e]">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conversation */}
                {started && (
                  <div className="flex flex-col gap-3">
                    {messages.map((msg, i) => {
                      const isUser = msg.role === "user"
                      const cards = !isUser && msg.content ? extractCtas(msg.content) : []
                      return (
                        <div key={msg.id} className="flex flex-col gap-1.5" style={{ animation: `sofai-in 0.2s ease both ${Math.min(i * 0.03, 0.15)}s` }}>
                          <div className={cn("flex gap-2", isUser ? "justify-end" : "items-end justify-start")}>
                            {!isUser && <div className="mb-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-900"><Sparkles className="size-3 text-white" /></div>}
                            <div className={cn("group relative max-w-[84%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                              isUser ? "rounded-br-sm text-white" : "rounded-bl-sm border border-[#e7e0d2] bg-white text-[#18181b] shadow-sm")}
                              style={isUser ? { background: "linear-gradient(135deg,#065f46 0%,#047857 100%)" } : undefined}>
                              {msg.content
                                ? isUser
                                  ? <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                                  : <MarkdownMsg text={msg.content} kp={msg.id} />
                                : <div className="flex items-center gap-1 px-1 py-0.5">
                                    {[0, 130, 260].map(d => <span key={d} className="size-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                                  </div>
                              }
                              {msg.content && !isUser && <div className="absolute -bottom-5 right-0 opacity-0 transition group-hover:opacity-100"><CopyBtn text={msg.content} /></div>}
                            </div>
                          </div>
                          {cards.length > 0 && (
                            <div className="ml-8 flex flex-col gap-2" style={{ animation: "sofai-in 0.25s ease both 0.15s" }}>
                              {cards.map(card => (
                                <a key={card.href} href={card.href} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 shadow-sm transition hover:shadow-md"
                                  style={card.primary ? { background: "linear-gradient(135deg,#065f46 0%,#047857 100%)", borderColor: "transparent" } : { background: "white", borderColor: "#e7e0d2" }}>
                                  <div><p className={cn("text-xs font-semibold", card.primary ? "text-white" : "text-[#18181b]")}>{card.label}</p><p className={cn("text-[11px]", card.primary ? "text-white/70" : "text-[#78716c]")}>{card.desc}</p></div>
                                  <span className={cn("shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap", card.primary ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-800")}>{card.cta}</span>
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
                <div ref={endRef} className="h-2" />
              </div>
            </div>

            {/* Join banner */}
            {userMsgCount >= 2 && (
              <div className="shrink-0 border-t border-emerald-100 px-4 py-3" style={{ background: "linear-gradient(90deg,rgba(4,120,87,0.07) 0%,rgba(217,119,6,0.04) 100%)", animation: "sofai-in 0.3s ease both" }}>
                <div className="flex items-center justify-between gap-3">
                  <div><p className="text-[12px] font-semibold text-[#18181b]">Ready to join the movement?</p><p className="text-[11px] text-[#78716c]">{SITE.stats.pioneers} Pioneers from {SITE.stats.countries} countries started here.</p></div>
                  <a href={SITE.auth.signin} target="_blank" rel="noopener noreferrer"
                    className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
                    style={{ background: "linear-gradient(135deg,#065f46 0%,#047857 100%)" }}>Start now →</a>
                </div>
              </div>
            )}

            {/* Input */}
            <form className="shrink-0 border-t border-[#e7e0d2] bg-white px-3 py-3" onSubmit={submitMessage}>
              <div className="flex items-end gap-2 rounded-xl border border-[#e7e0d2] bg-[#fffaf0] px-3 py-2 transition-shadow focus-within:border-emerald-500 focus-within:shadow-[0_0_0_3px_rgba(4,120,87,0.1)]">
                <textarea ref={taRef} aria-label="Ask SofAI" rows={1} value={input}
                  className="max-h-28 min-h-[28px] flex-1 resize-none bg-transparent text-sm leading-6 text-[#18181b] outline-none placeholder:text-[#b4aca2]"
                  placeholder={started ? "Ask anything…" : "Or type your question…"}
                  onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} />
                <button aria-label="Send" type="submit" disabled={!input.trim() || isLoading}
                  className={cn("mb-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg transition-all", input.trim() && !isLoading ? "text-white" : "cursor-not-allowed bg-[#f0e9d8] text-[#b4aca2]")}
                  style={input.trim() && !isLoading ? { background: "linear-gradient(135deg,#065f46 0%,#047857 100%)", boxShadow: "0 2px 8px rgba(4,120,87,0.4)" } : undefined}>
                  {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-3.5" />}
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-[#b4aca2]">SofAI · School of Freedom · sof.ai</p>
            </form>
          </section>
        )}

        <style>{`
          @keyframes sofai-up { from{opacity:0;transform:translateY(28px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
          @keyframes sofai-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        `}</style>
      </>
    )
  }
  