
import { useState, useEffect, useMemo, useRef } from "react"
import { SlidingPanels, SlidingPanel, SlidingPanelContent } from "../ui/sliding-panels"
import { ChevronLeft, Send } from "lucide-react"
import { cx } from "../../lib/utils"
import { usePanelChrome } from "../../hooks/use-panel-chrome"
import type { PanelProps } from "../../types/panel"

export interface MessagesConfig {
  relayUrl: string
}

interface Contact {
  id: string
  name: string
  initials: string
  status: "online" | "away" | "offline"
}

interface Message {
  id: string
  content: string
  sender: "user" | "contact"
  timestamp: number
}

interface Conversation {
  contact: Contact
  messages: Message[]
  unread: number
}

const now = Date.now()
const min = (n: number) => now - n * 60 * 1000
const hr = (n: number) => now - n * 60 * 60 * 1000
const day = (n: number) => now - n * 24 * 60 * 60 * 1000

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    contact: { id: "1", name: "Alex Kim", initials: "AK", status: "online" },
    unread: 2,
    messages: [
      { id: "1a", content: "Hey, did you finish the report?", sender: "contact", timestamp: hr(2) },
      { id: "1b", content: "Almost done, just reviewing it now", sender: "user", timestamp: hr(2) + min(5) },
      { id: "1c", content: "Are you coming to the meeting?", sender: "contact", timestamp: min(15) },
      { id: "1d", content: "The client is asking for an update", sender: "contact", timestamp: min(3) },
    ],
  },
  {
    contact: { id: "2", name: "Sara Chen", initials: "SC", status: "away" },
    unread: 0,
    messages: [
      { id: "2a", content: "Just sent you the design files", sender: "contact", timestamp: hr(5) },
      { id: "2b", content: "Got them, looks really good!", sender: "user", timestamp: hr(4) },
      { id: "2c", content: "The designs look great!", sender: "contact", timestamp: hr(3) },
    ],
  },
  {
    contact: { id: "3", name: "Marcus Lee", initials: "ML", status: "online" },
    unread: 1,
    messages: [
      { id: "3a", content: "Can we reschedule tomorrow?", sender: "user", timestamp: day(1) },
      { id: "3b", content: "Sure, what time works for you?", sender: "contact", timestamp: day(1) + min(10) },
      { id: "3c", content: "Did you get my last message?", sender: "contact", timestamp: hr(1) },
    ],
  },
  {
    contact: { id: "4", name: "Jordan Park", initials: "JP", status: "offline" },
    unread: 0,
    messages: [
      { id: "4a", content: "Let me know when you're free", sender: "contact", timestamp: day(2) },
      { id: "4b", content: "Will do, probably Friday", sender: "user", timestamp: day(2) + min(30) },
    ],
  },
]

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const diffMs = now - timestamp
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: "short" })
  return date.toLocaleDateString([], { month: "short", day: "numeric" })
}

export function MessagesPanel({ onFooter }: PanelProps) {
  const [panelIndex, setPanelIndex] = useState(0)
  const [activeId, setActiveId] = useState<string | null>(null)

  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS)
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const allConversations = conversations
  const activeConv = allConversations.find(c => c.contact.id === activeId) ?? null
  const totalUnread = allConversations.reduce((sum, c) => sum + c.unread, 0)

  const handleSelect = (id: string) => {
    setActiveId(id)
    setConversations(prev => prev.map(c => c.contact.id === id ? { ...c, unread: 0 } : c))
    setPanelIndex(1)
    // inbound conversations are read-only — no unread mutation needed
  }

  const handleBack = () => {
    setPanelIndex(0)
  }

  const handleSend = () => {
    if (!input.trim() || !activeId) return
    const content = input.trim()
    setInput("")
    const newMsg: Message = {
      id: `${activeId}-${Date.now()}`,
      content,
      sender: "user",
      timestamp: Date.now(),
    }
    setConversations(prev => prev.map(c =>
      c.contact.id === activeId ? { ...c, messages: [...c.messages, newMsg] } : c
    ))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeConv?.messages.length])

  const footer = useMemo(
    () =>
      panelIndex === 1 && activeConv ? (
        <div className="flex-1 px-3 flex items-center gap-2">
          <input
            type="text"
            placeholder="Message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-[11px] text-foreground placeholder:text-mute-fg/40 outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={cx(
              "transition-colors shrink-0",
              input.trim() ? "text-foreground hover:text-mute-fg" : "text-mute-fg/30"
            )}
          >
            <Send className="size-3.5" />
          </button>
        </div>
      ) : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [panelIndex, activeConv?.contact.id, input]
  )

  const { footer: footerEl } = usePanelChrome({ onFooter, footer })

  const listView = (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="shrink-0 h-11 px-3 border-b border-line flex items-center justify-between">
        <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          Messages
        </span>
        {totalUnread > 0 && (
          <span className="text-[9px] font-(--theme-font-weight) bg-foreground text-background px-1.5 py-0.5">
            {totalUnread}
          </span>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {allConversations.map((conv) => {
          const last = conv.messages[conv.messages.length - 1]
          return (
            <button
              key={conv.contact.id}
              onClick={() => handleSelect(conv.contact.id)}
              className="w-full px-3 py-2.5 flex items-center gap-3 border-b border-line/40 hover:bg-mute/50 transition-colors text-left"
            >
              {/* Avatar + status dot */}
              <div className="relative shrink-0">
                <div className="size-8 bg-mute flex items-center justify-center text-[10px] font-(--theme-font-weight) text-mute-fg">
                  {conv.contact.initials}
                </div>
                <span className={cx(
                  "absolute -bottom-0.5 -right-0.5 size-2 border border-background",
                  conv.contact.status === "online"
                    ? "bg-foreground"
                    : conv.contact.status === "away"
                    ? "bg-mute-fg"
                    : "bg-mute-fg/30"
                )} />
              </div>

              {/* Name + preview */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={cx(
                    "text-[11px] font-(--theme-font-weight)",
                    conv.unread > 0 ? "text-foreground" : "text-mute-fg"
                  )}>
                    {conv.contact.name}
                  </span>
                  {last && (
                    <span className="text-[9px] text-mute-fg shrink-0 ml-2">
                      {formatTime(last.timestamp)}
                    </span>
                  )}
                </div>
                {last && (
                  <p className="text-[10px] text-mute-fg truncate">
                    {last.sender === "user" ? "You: " : ""}{last.content}
                  </p>
                )}
              </div>

              {/* Unread badge */}
              {conv.unread > 0 && (
                <span className="shrink-0 size-4 flex items-center justify-center bg-foreground text-background text-[9px] font-(--theme-font-weight)">
                  {conv.unread}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )

  const threadView = activeConv ? (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="shrink-0 h-11 px-3 border-b border-line flex items-center gap-2">
        <button
          onClick={handleBack}
          className="text-mute-fg hover:text-foreground transition-colors"
        >
          <ChevronLeft className="size-3.5" />
        </button>
        <div className="size-6 bg-mute flex items-center justify-center text-[9px] font-(--theme-font-weight) text-mute-fg shrink-0">
          {activeConv.contact.initials}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-(--theme-font-weight) text-foreground">{activeConv.contact.name}</span>
          <span className={cx(
            "ml-1.5 text-[9px]",
            activeConv.contact.status === "online" ? "text-foreground/50" : "text-mute-fg/50"
          )}>
            {activeConv.contact.status}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 flex flex-col gap-2">
        {activeConv.messages.map((msg) => (
          <div
            key={msg.id}
            className={cx("flex", msg.sender === "user" ? "justify-end" : "justify-start")}
          >
            <div className={cx(
              "max-w-[75%] px-3 py-2 text-[11px]",
              msg.sender === "user"
                ? "bg-foreground text-background"
                : "bg-mute text-foreground"
            )}>
              <p>{msg.content}</p>
              <p className={cx(
                "text-[9px] mt-1",
                msg.sender === "user" ? "text-background/50" : "text-mute-fg"
              )}>
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

    </div>
  ) : null

  const body = (
    <div className="flex flex-col h-full overflow-hidden">
      <SlidingPanels activeIndex={panelIndex} onIndexChange={setPanelIndex} className="h-full">
        <SlidingPanel>
          <SlidingPanelContent className="!p-0 h-full">
            {listView}
          </SlidingPanelContent>
        </SlidingPanel>
        <SlidingPanel>
          <SlidingPanelContent className="!p-0 h-full">
            {threadView}
          </SlidingPanelContent>
        </SlidingPanel>
      </SlidingPanels>
    </div>
  )

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0">{body}</div>
      {footerEl}
    </div>
  )
}
