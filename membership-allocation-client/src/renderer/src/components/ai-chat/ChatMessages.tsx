import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'
import { ChatBubble } from './ChatBubble'
import { SuggestionChips } from './SuggestionChips'
import { TypingIndicator } from './TypingIndicator'
import type { ChatMessage } from './types'

interface ChatMessagesProps {
  messages: ChatMessage[]
  isLoading: boolean
  onSuggestion: (prompt: string) => void
}

export function ChatMessages({ messages, isLoading, onSuggestion }: ChatMessagesProps) {
  const messageAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const messageArea = messageAreaRef.current
    if (!messageArea) return
    messageArea.scrollTo({ top: messageArea.scrollHeight, behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div ref={messageAreaRef} className="min-h-0 flex-1 overflow-y-auto bg-muted/25 px-4 py-5">
      <div className="space-y-4">
        {messages.length === 0 && (
          <section className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Bot className="size-4" />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-card px-4 py-3 text-sm leading-6 text-card-foreground shadow-sm ring-1 ring-border/70">
                <p className="font-medium">Hello Administrator 👋</p>
                <p className="mt-1 text-muted-foreground">
                  Ask me anything about your members, applications, donations, and events.
                </p>
              </div>
            </div>
            <div className="pl-11">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Try asking</p>
              <SuggestionChips onSelect={onSuggestion} />
            </div>
          </section>
        )}

        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
          >
            <ChatBubble message={message} />
          </motion.div>
        ))}
        {isLoading && <TypingIndicator />}
      </div>
    </div>
  )
}
