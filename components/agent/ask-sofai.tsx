"use client"

  import { MessageCircle } from "lucide-react"
  import { useChatContext } from "@/components/providers/chat-provider"
  import { cn } from "@/lib/utils"

  interface AskSofAIProps {
    /** The message auto-sent to SofAI when the button is clicked */
    prompt: string
    /** Button label. Defaults to "Ask SofAI" */
    label?: string
    /** Visual style */
    variant?: "pill" | "ghost" | "banner"
    className?: string
  }

  /**
   * Drop-in button that opens the SofAI chat with a pre-filled message.
   * Place anywhere on any page — no props drilling required.
   *
   * Example:
   *   <AskSofAI prompt="How do I apply as a Pioneer?" label="How do I apply?" />
   */
  export function AskSofAI({
    prompt,
    label = "Ask SofAI",
    variant = "pill",
    className,
  }: AskSofAIProps) {
    const { open } = useChatContext()

    if (variant === "banner") {
      return (
        <div
          className={cn(
            "flex items-center justify-between gap-4 rounded-xl border border-[#e7e0d2] bg-white px-5 py-4 shadow-sm",
            className,
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-stone-950">
              <MessageCircle className="size-4 text-emerald-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#18181b]">Have a question?</p>
              <p className="text-xs text-[#78716c]">SofAI answers instantly — no waiting, no forms.</p>
            </div>
          </div>
          <button
            className="shrink-0 rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#065f46 0%,#047857 100%)" }}
            onClick={() => open(prompt)}
            type="button"
          >
            {label} →
          </button>
        </div>
      )
    }

    if (variant === "ghost") {
      return (
        <button
          className={cn(
            "inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 underline-offset-2 hover:underline",
            className,
          )}
          onClick={() => open(prompt)}
          type="button"
        >
          <MessageCircle className="size-3.5" />
          {label}
        </button>
      )
    }

    // pill (default)
    return (
      <button
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-[#d1c9bc] bg-white px-3.5 py-1.5 text-xs font-medium text-[#3d3730] shadow-sm transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800",
          className,
        )}
        onClick={() => open(prompt)}
        type="button"
      >
        <MessageCircle className="size-3 shrink-0" />
        {label}
      </button>
    )
  }
  