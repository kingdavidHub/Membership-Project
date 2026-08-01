import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CreditCard,
  LayoutDashboard,
  Sparkles,
  UserRound,
  Users,
  PanelTop,
  ShieldCheck,
  Clock3,
  ArrowUpRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeSwitch } from '@/components/theme-switch'
import { Logo } from '@/assets/logo'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: UserRound,
    title: 'Profile overview',
    description: 'See your member name, membership ID, entry year, and account status at a glance.'
  },
  {
    icon: CreditCard,
    title: 'Payment history',
    description: 'Review payment status, last paid date, and your current payment expiry window.'
  },
  {
    icon: Users,
    title: 'Dependent records',
    description: 'Keep linked dependents organized with an easy-to-scan table view.'
  },
  {
    icon: PanelTop,
    title: 'Account controls',
    description: 'Adjust profile details and password settings from one member workspace.'
  }
]

const steps = [
  {
    title: 'Invitation arrives',
    description: 'Your organization sends a secure invite to the email address already on file.'
  },
  {
    title: 'Activate access',
    description: 'Open the activation link, confirm your account, and set your password.'
  },
  {
    title: 'Sign in and manage',
    description: 'Use the portal to check your membership, payments, dependents, and settings.'
  }
]

const quotes = [
  {
    quote: 'The portal is clean, fast, and puts everything I need in one place.',
    label: 'Member feedback'
  },
  {
    quote: 'It is easy to check my payment status and get back to work.',
    label: 'Member feedback'
  },
  {
    quote: 'Invite-only access makes the whole flow feel simple and secure.',
    label: 'Member feedback'
  }
]

function SectionTitle({
  eyebrow,
  title,
  description
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="mb-10 max-w-2xl space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
    </div>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail
}: {
  icon: typeof LayoutDashboard
  label: string
  value: string
  detail: string
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-4 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-3 flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-card-foreground">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
    </div>
  )
}

function FloatingPanel({ className }: { className: string }) {
  return (
    <motion.div
      className={cn('pointer-events-none absolute rounded-full blur-3xl', className)}
      animate={{ y: [0, 16, 0], x: [0, 10, 0] }}
      transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

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
      <FloatingPanel className="-left-24 top-16 h-72 w-72 bg-primary/10 dark:bg-primary/20" />
      <FloatingPanel className="-right-28 top-44 h-80 w-80 bg-chart-2/10 dark:bg-chart-2/20" />
      <FloatingPanel className="bottom-[-9rem] left-1/2 h-96 w-96 -translate-x-1/2 bg-chart-4/10 dark:bg-chart-4/15" />

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
              <div className="text-sm font-semibold tracking-[0.3em] text-foreground">
                MEMBERSHIP ALLOCATION
              </div>
              <div className="text-xs text-muted-foreground">Member access portal</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a className="transition hover:text-foreground" href="#features">
              Features
            </a>
            <a className="transition hover:text-foreground" href="#how-it-works">
              How It Works
            </a>
            <a className="transition hover:text-foreground" href="#stories">
              Stories
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeSwitch />
            <Button asChild className="rounded-full px-5 shadow-sm transition-transform hover:scale-[1.02]">
              <Link to={'/signin' as any}>
                Sign in
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 pt-28 sm:px-6 lg:px-8">
        <section className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1.06fr_0.94fr] lg:py-18">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm">
              <ShieldCheck className="size-4 text-primary" />
              Invite-only access for members
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Your membership portal, organized for real use.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                Check your profile, payment history, dependents, and account details in one
                streamlined experience that follows the app&apos;s current theme automatically.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="rounded-full px-6 shadow-sm">
                <Link to={'/signin' as any}>
                  Sign in
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-border px-6 shadow-none"
              >
                <a href="#features">Explore features</a>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-border bg-card px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Clock3 className="size-4 text-primary" />
                  Fast access
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Return to your account in seconds.</p>
              </div>
              <div className="rounded-3xl border border-border bg-card px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <BadgeCheck className="size-4 text-primary" />
                  Invite-only
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Access starts with an organization invite.</p>
              </div>
              <div className="rounded-3xl border border-border bg-card px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Sparkles className="size-4 text-primary" />
                  Theme aware
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Matches light or dark mode instantly.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, ease: 'easeOut', delay: 0.08 }}
            className="relative"
          >
            <Card className="overflow-hidden border-border/80 bg-card/95 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-sm dark:shadow-[0_24px_70px_rgba(2,6,23,0.35)]">
              <CardHeader className="border-b border-border/70 bg-muted/40">
                <CardDescription className="text-muted-foreground">Member dashboard preview</CardDescription>
                <CardTitle className="text-2xl tracking-tight text-card-foreground">
                  Everything a member needs in one place
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <MetricCard
                    icon={UserRound}
                    label="Profile"
                    value="Ready"
                    detail="Membership ID, entry year, and account information."
                  />
                  <MetricCard
                    icon={CreditCard}
                    label="Payments"
                    value="Up to date"
                    detail="See payment status, last paid date, and expiry."
                  />
                </div>

                <div className="rounded-3xl border border-border bg-muted/40 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Member summary</p>
                      <p className="mt-1 text-2xl font-semibold tracking-tight text-card-foreground">
                        Designed for quick checks
                      </p>
                    </div>
                    <div className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                      Invite only
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
                        <CalendarClock className="size-4 text-primary" />
                        Simple activation
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        Open the invite, activate the account, and sign in with confidence.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
                        <Users className="size-4 text-primary" />
                        Dependents
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        Keep linked dependents visible and easy to review.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    'Membership ID',
                    'Payment history',
                    'Account settings'
                  ].map((label) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm"
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        <section className="py-14 sm:py-18">
          <SectionTitle
            eyebrow="Features"
            title="A member portal that focuses on the essentials"
            description="The experience is built around the surfaces members actually use: their profile, payments, dependents, and account settings."
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {features.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
              >
                <Card className="h-full border-border/80 bg-card/90 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-4 flex size-12 items-center justify-center rounded-2xl border border-border bg-muted text-primary">
                      <item.icon className="size-5" />
                    </div>
                    <CardTitle className="text-xl text-card-foreground">{item.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="py-14 sm:py-18 scroll-mt-28">
          <SectionTitle
            eyebrow="How it works"
            title="Invite-first onboarding keeps the flow simple"
            description="There is no public sign up. Members join only after their organization sends an invitation and the account is activated."
          />

          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="grid gap-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                >
                  <Card className="border-border/80 bg-card/90">
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                        0{index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-card-foreground">{step.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card className="border-border/80 bg-card/90">
              <CardHeader>
                <CardDescription className="text-muted-foreground">Member journey</CardDescription>
                <CardTitle className="text-2xl tracking-tight text-card-foreground">
                  A clear path from invite to portal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {[
                  'Secure invite reaches the member email inbox.',
                  'Activation confirms the account and creates access.',
                  'Sign in opens the personalized member dashboard.'
                ].map((line, index) => (
                  <div
                    key={line}
                    className="flex items-start gap-3 rounded-2xl border border-border bg-muted/35 p-4"
                  >
                    <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{line}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="stories" className="py-14 sm:py-18 scroll-mt-28">
          <SectionTitle
            eyebrow="Member stories"
            title="A calm interface with enough detail to feel trustworthy"
            description="Placeholder feedback that keeps the tone simple, useful, and grounded in the member experience."
          />

          <div className="grid gap-5 lg:grid-cols-3">
            {quotes.map((item, index) => (
              <motion.div
                key={item.quote}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
              >
                <Card className="h-full border-border/80 bg-card/90 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="space-y-4 p-6">
                    <div className="text-4xl leading-none text-primary/80">&ldquo;</div>
                    <p className="text-base leading-7 text-card-foreground">{item.quote}</p>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      {item.label}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

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
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">
                    Ready when you are
                  </p>
                  <h2 className="text-3xl font-semibold tracking-tight text-card-foreground sm:text-4xl">
                    Sign in to access your membership workspace.
                  </h2>
                  <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                    If you already have an invite, sign in to review your profile, payments, and
                    dependents from one polished portal.
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
      </div>
    </main>
  )
}