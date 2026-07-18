import { Bot, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChatHeaderProps {
  onMinimize: () => void
  onClear: () => void
}

export function ChatHeader({ onMinimize, onClear }: ChatHeaderProps) {
  return (
    <header className="mx-3 mt-3 mb-3 flex items-center gap-3 rounded-2xl border border-border/60 bg-card/70 px-4 py-4 text-foreground shadow-sm backdrop-blur-xl supports-backdrop-filter:bg-card/55">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-border/60">
        <Bot className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-sm font-semibold text-foreground">MBHS AI Assistant</h2>
        <p className="mt-1 text-xs text-muted-foreground">Administrator AI Assistant</p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 text-foreground hover:bg-accent hover:text-accent-foreground"
        onClick={onClear}
        aria-label="Clear conversation"
      >
        <Trash2 className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 text-foreground hover:bg-accent hover:text-accent-foreground"
        onClick={onMinimize}
        aria-label="Minimize assistant"
      >
        <X className="size-5" />
      </Button>
    </header>
  )
}
