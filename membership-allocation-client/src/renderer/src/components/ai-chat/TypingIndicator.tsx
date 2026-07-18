import { motion } from 'framer-motion'

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground" aria-live="polite">
      <div className="flex gap-1 rounded-2xl bg-muted px-3 py-2">
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            className="size-1.5 rounded-full bg-muted-foreground"
            animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: dot * 0.12 }}
          />
        ))}
      </div>
      AI is thinking...
    </div>
  )
}
