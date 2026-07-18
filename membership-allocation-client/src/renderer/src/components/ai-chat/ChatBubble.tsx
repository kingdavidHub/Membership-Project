import { useState } from 'react'
import { Bot, Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ChatMessage } from './types'

function MessageContent({ content }: { content: string }) {
  return <div className="whitespace-pre-wrap break-words text-sm leading-6">{content}</div>
}

export function ChatBubble({ message }: { message: ChatMessage }) {
  const [copied, setCopied] = useState(false)
  const isAssistant = message.role === 'assistant'

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.message)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // Copy can be unavailable in non-secure desktop renderer contexts.
    }
  }

  return (
    <div className={`group flex items-end gap-2 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      {isAssistant && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Bot className="size-4" />
        </div>
      )}
      <div className={`max-w-[78%] ${isAssistant ? '' : 'flex flex-col items-end'}`}>
        <div
          className={`rounded-2xl px-3.5 py-2.5 shadow-sm ${
            isAssistant
              ? 'rounded-bl-sm bg-card text-card-foreground ring-1 ring-border/70'
              : 'rounded-br-sm bg-primary text-primary-foreground'
          }`}
        >
          <MessageContent content={message.message} />
        </div>
        <div
          className={`mt-1 flex items-center gap-1 px-1 text-[10px] text-muted-foreground ${
            isAssistant ? '' : 'justify-end'
          }`}
        >
          <time dateTime={message.timestamp}>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: 'numeric',
              minute: '2-digit'
            })}
          </time>
          {isAssistant && (
            <Button
              variant="ghost"
              size="icon"
              className="size-5 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              onClick={copy}
              aria-label="Copy assistant message"
            >
              {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
