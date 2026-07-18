import { Bot, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChatHeaderProps {
  onMinimize: () => void
  onClear: () => void
}

export function ChatHeader({ onMinimize, onClear }: ChatHeaderProps) {
  return (
    <header className="flex items-center gap-3 bg-primary px-4 py-4 text-primary-foreground shadow-sm">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15 ring-1 ring-primary-foreground/25">
        <Bot className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-sm font-semibold">MBHS AI Assistant</h2>
        <p className="mt-0.5 text-xs text-primary-foreground/75">Administrator AI Assistant</p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
        onClick={onClear}
        aria-label="Clear conversation"
      >
        <Trash2 className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
        onClick={onMinimize}
        aria-label="Minimize assistant"
      >
        <X className="size-5" />
      </Button>
    </header>
  )
}
