import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const navigate = useNavigate()

  const goBack = () => {
    if (
      typeof window !== 'undefined' &&
      typeof document !== 'undefined' &&
      document.referrer.startsWith(window.location.origin) &&
      window.history.length > 1
    ) {
      window.history.back()
    } else {
      navigate({ to: '/' })
    }
  }

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),transparent_30%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_28%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_28%)]" />
      <motion.div
        className="pointer-events-none absolute -left-24 top-16 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        animate={{ y: [0, 20, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute right-0 top-1/2 -z-10 h-80 w-80 rounded-full bg-chart-2/10 blur-3xl"
        animate={{ y: [0, -18, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Top bar — Back + brand on the left, theme switch on the right */}
      <header className="flex items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button variant="ghost" size="icon" onClick={goBack} aria-label="Go back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="leading-tight">
            <h1 className="text-base font-semibold tracking-tight sm:text-lg">Membership Allocation</h1>
            <p className="text-xs text-muted-foreground sm:text-sm">Your membership portal</p>
          </div>
        </div>
        <ThemeSwitch />
      </header>

      {/* Centered form */}
      <main className="flex flex-1 items-center justify-center px-4 pb-12 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}
