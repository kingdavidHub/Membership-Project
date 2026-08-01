import { Logo } from '@/assets/logo'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  BarChart3,
  CreditCard,
  Fingerprint,
  Mail,
  ShieldCheck,
  Users,
  WifiOff
} from 'lucide-react'

type AuthLayoutProps = {
  children: React.ReactNode
}

const highlights = [
  {
    icon: Users,
    title: 'Member management',
    description: 'Maintain profiles, dependants, and membership status in one organized place.'
  },
  {
    icon: CreditCard,
    title: 'Payments & subscriptions',
    description: 'Track dues, renewals, and full payment history for every member.'
  },
  {
    icon: BarChart3,
    title: 'Reporting & analytics',
    description: 'Turn membership data into clear dashboards and exportable reports.'
  },
  {
    icon: Mail,
    title: 'Built-in messaging',
    description: 'Send emails, announcements, and automated birthday greetings.'
  }
]

const assurances = [
  { icon: Fingerprint, label: 'Role-based access' },
  { icon: WifiOff, label: 'Works offline' }
]

export function AuthLayout({ children }: AuthLayoutProps) {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-svh overflow-hidden bg-background text-foreground">
      <div className="absolute left-6 top-9 z-20 hidden lg:block">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
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
          }}
        >
          <ArrowLeft className="me-2 h-4 w-4" />
          Back
        </Button>
      </div>

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

      <div className="mx-auto grid min-h-svh max-w-7xl lg:grid-cols-[1.05fr_480px]">
        {/* Left showcase */}
        <aside className="hidden border-r border-border/70 px-8 py-8 lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
                <Logo className="size-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">Membership Allocation</h1>
                <p className="text-sm text-muted-foreground">Role-based management system</p>
              </div>
            </div>
            <ThemeSwitch />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-xl space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm">
              <ShieldCheck className="size-4 text-primary" />
              Invite-only access for members
            </div>

            <div className="space-y-4">
              <h2 className="text-balance text-4xl font-semibold tracking-tight text-foreground">
                One secure portal for members, payments, and analytics.
              </h2>
              <p className="max-w-lg text-pretty text-lg leading-8 text-muted-foreground">
                Sign in to manage membership records, track payments, communicate with members, and
                view analytics — all from a single desktop app that works entirely offline.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.15 + index * 0.08 }}
                  className="rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="mb-3 flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <item.icon className="size-5" />
                  </div>
                  <p className="text-sm font-semibold text-card-foreground">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {assurances.map((item) => (
                <div
                  key={item.label}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm"
                >
                  <item.icon className="size-3.5 text-primary" />
                  {item.label}
                </div>
              ))}
            </div>
          </motion.div>

          <p className="text-sm text-muted-foreground">Invite-only access. No public sign up.</p>
        </aside>

        {/* Right form */}
        <section className="flex flex-col px-4 py-6 sm:px-8 lg:justify-center">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
                <Logo className="size-5 text-primary" />
              </div>
              <div>
                <h1 className="text-base font-semibold">Membership Allocation</h1>
                <p className="text-xs text-muted-foreground">Role-based management system</p>
              </div>
            </div>
            <ThemeSwitch />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mx-auto w-full max-w-md lg:max-w-none"
          >
            {children}
          </motion.div>
        </section>
      </div>
    </div>
  )
}
