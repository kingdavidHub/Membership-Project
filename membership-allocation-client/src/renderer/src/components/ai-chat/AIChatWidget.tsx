import { type CSSProperties, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import { ChatHeader } from './ChatHeader'
import { ChatInput } from './ChatInput'
import { ChatMessages } from './ChatMessages'
import { useAIChat } from './hooks/use-ai-chat'

const layerStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 2147483647,
  pointerEvents: 'none'
}

const panelStyle: CSSProperties = {
  position: 'fixed',
  right: 24,
  bottom: 96,
  width: 'min(400px, calc(100vw - 48px))',
  height: 'min(640px, calc(100vh - 128px))',
  maxHeight: 'calc(100vh - 128px)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  pointerEvents: 'auto'
}

const launcherWrapStyle: CSSProperties = {
  position: 'fixed',
  right: 24,
  bottom: 24,
  pointerEvents: 'auto'
}

const launcherStyle: CSSProperties = {
  width: 56,
  height: 56,
  borderRadius: 9999,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  cursor: 'pointer'
}

export function AIChatWidget() {
  const panelId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { messages, isLoading, sendMessage, clearConversation } = useAIChat()

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('keydown', handleEscape)
    const focusTimer = window.setTimeout(() => textareaRef.current?.focus(), 180)
    return () => {
      window.removeEventListener('keydown', handleEscape)
      window.clearTimeout(focusTimer)
    }
  }, [isOpen])

  if (typeof document === 'undefined') return null

  const widget = (
    <div style={layerStyle} data-ai-chat-widget="">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            id={panelId}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            aria-label="MBHS AI Assistant"
            style={panelStyle}
            className="origin-bottom-right rounded-xl border border-border bg-card shadow-2xl"
          >
            <ChatHeader
              onMinimize={() => setIsOpen(false)}
              onClear={clearConversation}
            />
            <ChatMessages messages={messages} isLoading={isLoading} onSuggestion={sendMessage} />
            <ChatInput isLoading={isLoading} onSend={sendMessage} inputRef={textareaRef} />
          </motion.section>
        )}
      </AnimatePresence>

      <motion.div
        style={launcherWrapStyle}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          style={launcherStyle}
          className="border-2 border-background bg-primary text-primary-foreground shadow-xl transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
          aria-expanded={isOpen}
          aria-controls={panelId}
        >
          {isOpen ? <X className="size-6" /> : <MessageCircle className="size-6" />}
          <span className="sr-only">{isOpen ? 'Close assistant' : 'Open assistant'}</span>
        </button>
      </motion.div>
    </div>
  )

  return createPortal(widget, document.body)
}
