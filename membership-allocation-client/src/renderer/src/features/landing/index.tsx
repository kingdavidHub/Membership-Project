import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, useInView, animate } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BellRing,
  CreditCard,
  FileSpreadsheet,
  Fingerprint,
  Gauge,
  LayoutDashboard,
  Lock,
  Mail,
  PieChart,
  ServerOff,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCog,
  UserRound,
  Users,
  WifiOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeSwitch } from '@/components/theme-switch'
import { Logo } from '@/assets/logo'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Data                                                               */
/* ------------------------------------------------------------------ */

const roles = [
  {
    icon: ShieldCheck,
    name: 'Super Administrator',
    tagline: 'Total system control',
    points: [
      'Assign and revoke administrator privileges',
      'System-wide analytics and oversight',
      'Manage every account and global setting'
    ]
  },
  {
    icon: UserCog,
    name: 'Administrator',
    tagline: 'Day-to-day operations',
    points: [
      'Add, edit and manage member records',
      'Track payments, subscriptions and status',
      'Generate reports and send messages'
    ]
  },
  {
    icon: UserRound,
    name: 'Member',
    tagline: 'Personal workspace',
    points: [
      'View and edit personal biodata',
      'Manage dependants and profile details',
      'Check payment history and subscription'
    ]
  }
]

const features = [
  {
    icon: Users,
    title: 'Member management',
    description:
      'Register members, maintain rich profiles, and organize dependants with advanced search and filtering.'
  },
  {
    icon: CreditCard,
    title: 'Payments & subscriptions',
    description:
      'Track dues, renewals and transaction history with a clear view of every member’s standing.'
  },
  {
    icon: BarChart3,
    title: 'Reporting & analytics',
    description:
      'Interactive dashboards surface demographics, engagement trends and membership growth at a glance.'
  },
  {
    icon: Mail,
    title: 'Messaging system',
    description:
      'Send direct emails, bulk announcements and automated birthday greetings without leaving the app.'
  },
  {
    icon: FileSpreadsheet,
    title: 'Exportable reports',
    description:
      'Generate custom reports and export them to PDF or Excel for meetings, audits and record keeping.'
  },
  {
    icon: Fingerprint,
    title: 'Role-based access control',
    description:
      'A strict three-tier permission model keeps sensitive records visible only to the right people.'
  },
  {
    icon: WifiOff,
    title: 'Fully offline',
    description:
      'Runs as a local desktop app with no internet dependency, so records stay available and private.'
  },
  {
    icon: Lock,
    title: 'Secure by design',
    description:
      'Encrypted local storage, session management and activity audit logging protect every record.'
  }
]

const stats = [
  { value: 3, suffix: '', label: 'Access tiers', detail: 'Super Admin, Admin, Member' },
  { value: 100, suffix: '%', label: 'Offline capable', detail: 'No internet required' },
  { value: 6, suffix: '+', label: 'Core modules', detail: 'Members to analytics' },
  { value: 4, suffix: '', label: 'Status states', detail: 'Active to memorial records' }
]

const steps = [
  {
    icon: Mail,
    title: 'Receive your invite',
    description:
      'A super admin or administrator sends a secure invitation to the email already on file. There is no public sign up.'
  },
  {
    icon: Fingerprint,
    title: 'Activate your account',
    description:
      'Open the activation link, confirm your identity, and set a password. Your role and permissions are applied automatically.'
  },
  {
    icon: LayoutDashboard,
    title: 'Work from your dashboard',
    description:
      'Sign in to a workspace tailored to your role — members manage their own data while admins oversee the full system.'
  }
]

/* Analytics panel bars */
const analyticsBars = [
  { label: 'Active', height: 92, tone: 'bg-chart-2' },
  { label: 'Dormant', height: 58, tone: 'bg-chart-4' },
  { label: 'Inactive', height: 40, tone: 'bg-chart-3' },
  { label: 'New', height: 74, tone: 'bg-primary' }
]

/* ------------------------------------------------------------------ */
/* Building blocks                                                    */
/* ------------------------------------------------------------------ */

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null)
  const inView = useInView(nodeRef, { once: true, margin: '-40px' })

  useEffect(() => {
    if (!inView || !nodeRef.current) return
    const controls = animate(0, to, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate(value) {
        if (nodeRef.current) nodeRef.current.textContent = `${Math.round(value)}${suffix}`
      }
    })
    return () => controls.stop()
  }, [inView, to, suffix])

  return <span ref={nodeRef}>0{suffix}</span>
}

function SectionTitle({
  eyebrow,
  title,
  description,
  align = 'left'
}: {
  eyebrow: string
  title: string
  description: string
  align?: 'left' | 'center'
}) {
  return (
    <div
      className={cn(
        'mb-12 max-w-2xl space-y-3',
        align === 'center' && 'mx-auto text-center'
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">{eyebrow}</p>
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      <p className="text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
        {description}
      </p>
    </div>
  )
}

function FloatingBlob({ className }: { className: string }) {
  return (
    <motion.div
      className={cn('pointer-events-none absolute rounded-full blur-3xl', className)}
      animate={{ y: [0, 18, 0], x: [0, 12, 0], scale: [1, 1.06, 1] }}
      transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

function AnalyticsPanel() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <Card
      ref={ref}
      className="overflow-hidden border-border/80 bg-card/95 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur-sm dark:shadow-[0_28px_80px_rgba(2,6,23,0.4)]"
    >
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/70 bg-muted/40 space-y-0">
        <div>
          <CardDescription className="text-muted-foreground">Live membership overview</CardDescription>
          <CardTitle className="text-lg tracking-tight text-card-foreground">
            Analytics dashboard
          </CardTitle>
        </div>
        <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Gauge className="size-5" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* KPI row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-muted/40 p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Users className="size-4 text-primary" />
              Total members
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-card-foreground">
              <Counter to={1248} />
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs text-chart-2">
              <TrendingUp className="size-3.5" /> +12% this term
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-muted/40 p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <CreditCard className="size-4 text-primary" />
              Payments up to date
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-card-foreground">
              <Counter to={87} suffix="%" />
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs text-chart-2">
              <TrendingUp className="size-3.5" /> On track
            </p>
          </div>
        </div>

        {/* Animated bar chart */}
        <div className="rounded-2xl border border-border bg-muted/30 p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-card-foreground">Members by status</p>
            <PieChart className="size-4 text-muted-foreground" />
          </div>
          <div className="flex h-32 items-end justify-between gap-3">
            {analyticsBars.map((bar, index) => (
              <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-24 w-full items-end justify-center">
                  <motion.div
                    className={cn('w-full rounded-t-lg', bar.tone)}
                    initial={{ height: 0 }}
                    animate={inView ? { height: `${bar.height}%` } : { height: 0 }}
                    transition={{ duration: 0.9, delay: 0.2 + index * 0.12, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-[11px] font-medium text-muted-foreground">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="space-y-2">
          {[
            { icon: BellRing, text: 'Birthday reminders sent to 6 members' },
            { icon: FileSpreadsheet, text: 'Monthly report exported to PDF' }
          ].map((row, index) => (
            <motion.div
              key={row.text}
              initial={{ opacity: 0, x: -8 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.15 }}
              className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5 shadow-sm"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <row.icon className="size-4" />
              </div>
              <p className="text-sm text-muted-foreground">{row.text}</p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background text-foreground scroll-smooth">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),transparent_30%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_28%),radial-gradient(circle_at_bottom,rgba(99,102,241,0.05),transparent_26%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.14),transparent_28%),radial-gradient(circle_at_bottom,rgba(99,102,241,0.08),transparent_26%)]" />
      <FloatingBlob className="-left-24 top-16 h-72 w-72 bg-primary/10 dark:bg-primary/20" />
      <FloatingBlob className="-right-28 top-44 h-80 w-80 bg-chart-2/10 dark:bg-chart-2/20" />
      <FloatingBlob className="bottom-[-9rem] left-1/2 h-96 w-96 -translate-x-1/2 bg-chart-4/10 dark:bg-chart-4/15" />

      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            'mx-auto flex max-w-7xl items-center justify-between rounded-full border px-4 py-3 backdrop-blur-xl transition-all duration-300 sm:px-5',
            isScrolled
              ? 'border-border/80 bg-background/90 shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:shadow-[0_18px_45px_rgba(2,6,23,0.35)]'
              : 'border-border/50 bg-background/70'
          )}
        >
          <Link to="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
              <Logo className="size-5 text-primary" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-[0.28em] text-foreground">
                MEMBERSHIP ALLOCATION
              </div>
              <div className="text-xs text-muted-foreground">Role-based management system</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a className="transition hover:text-foreground" href="#roles">
              Roles
            </a>
            <a className="transition hover:text-foreground" href="#features">
              Features
            </a>
            <a className="transition hover:text-foreground" href="#how-it-works">
              How It Works
            </a>
            <a className="transition hover:text-foreground" href="#security">
              Security
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeSwitch />
            <Button
              asChild
              className="rounded-full px-5 shadow-sm transition-transform hover:scale-[1.02]"
            >
              <Link to={'/signin' as any}>
                Sign in
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 pt-28 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1.06fr_0.94fr] lg:py-18">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm">
              <ShieldCheck className="size-4 text-primary" />
              Role-based access for schools &amp; organizations
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Manage every member, payment, and record from one secure desktop app.
              </h1>
              <p className="max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
                Membership Allocation gives super admins, administrators, and members their own
                workspace — with member records, payments, messaging, and analytics that work
                entirely offline.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="rounded-full px-6 shadow-sm">
                <Link to={'/signin' as any}>
                  Sign in to your workspace
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-border px-6 shadow-none"
              >
                <a href="#features">Explore what&apos;s inside</a>
              </Button>
            </div>

            {/* Stat strip */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-border bg-card px-4 py-3 shadow-sm"
                >
                  <p className="text-2xl font-semibold tracking-tight text-foreground">
                    <Counter to={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-1 text-xs font-medium text-foreground">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">{stat.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, ease: 'easeOut', delay: 0.08 }}
            className="relative"
          >
            <AnalyticsPanel />
          </motion.div>
        </section>

        {/* Roles */}
        <section id="roles" className="py-14 sm:py-18 scroll-mt-28">
          <SectionTitle
            eyebrow="Role-based access"
            title="Three access levels, each with the right permissions"
            description="Everyone signs into the same system, but what they can see and do is governed by a strict three-tier permission model."
          />

          <div className="grid gap-5 lg:grid-cols-3">
            {roles.map((role, index) => (
              <motion.div
                key={role.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Card className="group h-full border-border/80 bg-card/90 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                      <role.icon className="size-6" />
                    </div>
                    <CardDescription className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80">
                      {role.tagline}
                    </CardDescription>
                    <CardTitle className="text-xl text-card-foreground">{role.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {role.points.map((point) => (
                      <div key={point} className="flex items-start gap-2.5">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                        <p className="text-sm leading-6 text-muted-foreground">{point}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-14 sm:py-18 scroll-mt-28">
          <SectionTitle
            eyebrow="Everything included"
            title="A complete toolkit for membership administration"
            description="From day-to-day record keeping to analytics and communication, every module works together in one offline desktop application."
          />

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {features.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.45, delay: (index % 4) * 0.06 }}
              >
                <Card className="group h-full border-border/80 bg-card/90 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-4 flex size-12 items-center justify-center rounded-2xl border border-border bg-muted text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                      <item.icon className="size-5" />
                    </div>
                    <CardTitle className="text-lg text-card-foreground">{item.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-14 sm:py-18 scroll-mt-28">
          <SectionTitle
            eyebrow="How it works"
            title="Invite-first onboarding keeps access controlled"
            description="There is no public sign up. Members join only after their organization sends an invitation, and each account inherits the permissions of its role."
          />

          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <Card className="h-full border-border/80 bg-card/90">
                  <CardContent className="space-y-4 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <step.icon className="size-5" />
                      </div>
                      <span className="text-3xl font-semibold tracking-tight text-muted-foreground/30">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground">{step.title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Security */}
        <section id="security" className="py-14 sm:py-18 scroll-mt-28">
          <div className="grid gap-8 rounded-[2rem] border border-border/80 bg-card/90 p-8 shadow-sm lg:grid-cols-[1fr_1fr] lg:p-12">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">
                Private &amp; secure
              </p>
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-card-foreground sm:text-4xl">
                Your records stay on your machine, protected end to end.
              </h2>
              <p className="text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                Because the app runs fully offline, sensitive membership data never leaves your
                device. Encryption, session management, and audit logging keep every action
                accountable.
              </p>
              <Button asChild size="lg" className="mt-2 rounded-full px-6 shadow-sm">
                <Link to={'/signin' as any}>
                  Get started
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: WifiOff, title: 'No internet needed', text: 'Operates completely offline.' },
                { icon: Lock, title: 'Encrypted at rest', text: 'Local data encryption built in.' },
                {
                  icon: Fingerprint,
                  title: 'Role permissions',
                  text: 'Access scoped to each role.'
                },
                {
                  icon: ServerOff,
                  title: 'Audit logging',
                  text: 'Every change is tracked.'
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                  className="rounded-2xl border border-border bg-background/60 p-5"
                >
                  <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <item.icon className="size-5" />
                  </div>
                  <p className="text-sm font-semibold text-card-foreground">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden border-border/80 bg-card/95 shadow-[0_22px_55px_rgba(15,23,42,0.08)]">
              <CardContent className="flex flex-col items-start justify-between gap-6 p-6 sm:p-8 lg:flex-row lg:items-center">
                <div className="max-w-2xl space-y-3">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">
                    <Sparkles className="size-4" />
                    Ready when you are
                  </p>
                  <h2 className="text-balance text-3xl font-semibold tracking-tight text-card-foreground sm:text-4xl">
                    Sign in to your membership workspace.
                  </h2>
                  <p className="text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                    Already have an invite? Sign in to manage members, payments, dependants, and
                    reports from one secure portal built for your role.
                  </p>
                </div>

                <Button asChild size="lg" className="rounded-full px-6 shadow-sm">
                  <Link to={'/signin' as any}>
                    Sign in
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/70 py-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-xl border border-border bg-card">
                <Logo className="size-4 text-primary" />
              </div>
              <span>Membership Allocation · Role-based management system</span>
            </div>
            <p>Invite-only access · No public sign up</p>
          </div>
        </footer>
      </div>
    </main>
  )
}
