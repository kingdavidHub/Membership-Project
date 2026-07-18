import { type ReactNode, useState } from 'react'
import { Bot, Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ChatMessage } from './types'

type MessageBlock =
  | {
    type: 'paragraph'
    lines: string[]
  }
  | {
    type: 'list'
    items: string[]
  }

function renderInline(content: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const boldPattern = /\*\*(.+?)\*\*/g
  let lastIndex = 0

  for (let match = boldPattern.exec(content); match; match = boldPattern.exec(content)) {
    if (match.index > lastIndex) {
      nodes.push(content.slice(lastIndex, match.index))
    }

    nodes.push(
      <strong key={`${match.index}-${match[1]}`} className="font-semibold text-foreground">
        {match[1]}
      </strong>
    )
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < content.length) {
    nodes.push(content.slice(lastIndex))
  }

  return nodes
}

function parseMessageBlocks(content: string): MessageBlock[] {
  const blocks: MessageBlock[] = []
  const paragraphLines: string[] = []
  const listItems: string[] = []

  const flushParagraph = () => {
    if (!paragraphLines.length) return
    blocks.push({ type: 'paragraph', lines: [...paragraphLines] })
    paragraphLines.length = 0
  }

  const flushList = () => {
    if (!listItems.length) return
    blocks.push({ type: 'list', items: [...listItems] })
    listItems.length = 0
  }

  for (const rawLine of content.split(/\r?\n/)) {
    const trimmedLine = rawLine.trim()

    if (!trimmedLine) {
      flushParagraph()
      flushList()
      continue
    }

    const bulletMatch = rawLine.match(/^\s*[*-]\s+(.*)$/)
    if (bulletMatch) {
      flushParagraph()
      listItems.push(bulletMatch[1])
      continue
    }

    flushList()
    paragraphLines.push(trimmedLine)
  }

  flushParagraph()
  flushList()

  return blocks
}

function MessageContent({ content }: { content: string }) {
  const blocks = parseMessageBlocks(content)

  return (
    <div className="space-y-3 wrap-break-word text-sm leading-7">
      {blocks.map((block, blockIndex) => {
        if (block.type === 'list') {
          return (
            <ul key={`list-${blockIndex}`} className="space-y-2 pl-5 marker:text-current/80">
              {block.items.map((item, itemIndex) => (
                <li key={`${blockIndex}-${itemIndex}`} className="list-disc pl-1">
                  {renderInline(item)}
                </li>
              ))}
            </ul>
          )
        }

        return (
          <p key={`paragraph-${blockIndex}`} className="whitespace-normal text-sm leading-7 last:mb-0">
            {block.lines.map((line, lineIndex) => (
              <span key={`${blockIndex}-${lineIndex}`}>
                {renderInline(line)}
                {lineIndex < block.lines.length - 1 ? ' ' : null}
              </span>
            ))}
          </p>
        )
      })}
    </div>
  )
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
          className={`rounded-3xl px-4 py-3 shadow-sm ${isAssistant
              ? 'rounded-bl-md bg-card text-card-foreground ring-1 ring-border/70'
              : 'rounded-br-md bg-primary text-primary-foreground'
            }`}
        >
          <MessageContent content={message.message} />
        </div>
        <div
          className={`mt-1 flex items-center gap-1 px-1 text-[10px] text-muted-foreground ${isAssistant ? '' : 'justify-end'
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
