
import { useState, useCallback, useRef, useEffect } from "react"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

const STORAGE_KEY = "thrifty-chat"

const DEMO_RESPONSES = [
  "This chat is for demonstration only.",
]

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

function load(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Message[]
  } catch { /* ignore */ }
  return []
}

function save(messages: Message[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
}

export interface UseChatOptions {
  /** Canned assistant replies for the demo (no real model is wired). The
   *  consumer supplies its own; pass a stable (module-level) array so the
   *  send handler's identity stays stable. Falls back to a generic notice. */
  demoResponses?: string[]
}

export function useChat(options?: UseChatOptions) {
  const demoResponses =
    options?.demoResponses && options.demoResponses.length > 0
      ? options.demoResponses
      : DEMO_RESPONSES
  const [messages, setMessages] = useState<Message[]>(load)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [displayedContent, setDisplayedContent] = useState("")
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const typingMessageIdRef = useRef<string | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingRef.current) clearTimeout(typingRef.current)
    }
  }, [])

  const persist = useCallback((next: Message[]) => {
    save(next)
    setMessages(next)
  }, [])

  const sendMessage = useCallback(() => {
    if (!inputValue.trim() || isTyping) return

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: inputValue.trim(),
      timestamp: Date.now(),
    }

    const updatedMessages = [...messages, userMessage]
    persist(updatedMessages)
    setInputValue("")

    // Simulate assistant response after a short delay
    setIsTyping(true)
    const response = demoResponses[Math.floor(Math.random() * demoResponses.length)]
    const assistantMessage: Message = {
      id: generateId(),
      role: "assistant",
      content: response,
      timestamp: Date.now() + 500,
    }

    typingMessageIdRef.current = assistantMessage.id
    setDisplayedContent("")

    // Start typewriter after delay
    setTimeout(() => {
      let charIndex = 0
      const typeChar = () => {
        if (charIndex < response.length) {
          charIndex++
          setDisplayedContent(response.slice(0, charIndex))
          typingRef.current = setTimeout(typeChar, 15)
        } else {
          // Done typing — add full message to history
          const withAssistant = [...updatedMessages, assistantMessage]
          persist(withAssistant)
          setIsTyping(false)
          typingMessageIdRef.current = null
          setDisplayedContent("")
        }
      }
      typeChar()
    }, 600)
  }, [inputValue, isTyping, messages, persist, demoResponses])

  const clearMessages = useCallback(() => {
    if (typingRef.current) clearTimeout(typingRef.current)
    setIsTyping(false)
    typingMessageIdRef.current = null
    setDisplayedContent("")
    persist([])
  }, [persist])

  return {
    messages,
    inputValue,
    isTyping,
    displayedContent,
    typingMessageId: typingMessageIdRef.current,
    setInputValue,
    sendMessage,
    clearMessages,
  }
}
