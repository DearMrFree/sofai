"use client"

  import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
  } from "react"

  interface ChatContextValue {
    isOpen: boolean
    pendingMessage: string | null
    open: (message?: string) => void
    close: () => void
    clearPending: () => void
  }

  const ChatContext = createContext<ChatContextValue>({
    isOpen: false,
    pendingMessage: null,
    open: () => {},
    close: () => {},
    clearPending: () => {},
  })

  export function useChatContext() {
    return useContext(ChatContext)
  }

  export function ChatProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [pendingMessage, setPendingMessage] = useState<string | null>(null)

    const open = useCallback((message?: string) => {
      if (message) setPendingMessage(message)
      setIsOpen(true)
    }, [])

    const close = useCallback(() => {
      setIsOpen(false)
    }, [])

    const clearPending = useCallback(() => {
      setPendingMessage(null)
    }, [])

    return (
      <ChatContext.Provider value={{ isOpen, pendingMessage, open, close, clearPending }}>
        {children}
      </ChatContext.Provider>
    )
  }
  