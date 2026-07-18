import { type KeyboardEvent, useEffect, useState } from 'react'
import { SendHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChatInputProps {
  isLoading: boolean
  onSend: (message: string) => void
  inputRef: React.RefObject<HTMLTextAreaElement | null>
}

export function ChatInput({ isLoading, onSend, inputRef }: ChatInputProps) {
  const [value, setValue] = useState('')

  useEffect(() => {
    const textarea = inputRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 112)}px`
  }, [inputRef, value])

  const submit = () => {
    if (!value.trim() || isLoading) return
    onSend(value)
    setValue('')
  }

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <footer className="border-t border-border bg-card px-3 py-3">
      <div className="flex items-end gap-2 rounded-xl border border-input bg-background px-3 py-1.5 shadow-xs focus-within:ring-2 focus-within:ring-ring/50">
        <textarea
          ref={inputRef}
          value={value}
          rows={1}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onKeyDown}
          disabled={isLoading}
          placeholder="Type a message..."
          aria-label="Message MBHS AI Assistant"
          className="max-h-28 min-h-8 flex-1 resize-none bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Button
          type="button"
          size="icon"
          className="mb-0.5 size-8 shrink-0 rounded-lg"
          disabled={!value.trim() || isLoading}
          onClick={submit}
          aria-label="Send message"
        >
          <SendHorizontal className="size-4" />
        </Button>
      </div>
      <p className="mt-2 text-center text-[10px] text-muted-foreground">Enter to send · Shift + Enter for a new line</p>
    </footer>
  )
}
