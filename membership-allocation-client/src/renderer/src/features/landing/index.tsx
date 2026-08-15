import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, useInView, animate } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  BellRing,
  CalendarHeart,
  CreditCard,
  Fingerprint,
  Gauge,
  HeartHandshake,
  Lock,
  Mail,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRound,
  WalletCards,
  WifiOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeSwitch } from '@/components/theme-switch'
import { Logo } from '@/assets/logo'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Data — member facing only                                          */
/* ------------------------------------------------------------------ */

const features = [
  {
    icon: UserRound,
    title: 'Your personal profile',
    description:
      'Keep your biodata, contact details, and personal information accurate and up to date, anytime.'
  },
  {
    icon: HeartHandshake,
    title: 'Manage your dependants',
    description:
      'Add and update the people connected to your membership so your records always stay complete.'
  },
  {
    icon: WalletCards,
    title: 'Payment history',
    description:
      'See every due, renewal, and receipt in one place, with a clear record of your subscription.'
  },
  {
    icon: Gauge,
    title: 'Subscription status',
    description:
      'Know exactly where your membership stands and when your next renewal is coming up.'
  },
  {
    icon: Mail,
    title: 'Messages & announcements',
    description:
      'Receive important updates, notices, and birthday greetings without missing a thing.'
  },
  {
    icon: Lock,
    title: 'Private & secure',
    description:
      'Your data is protected with encrypted storage and secure sign-in that only you control.'
  }
]

const stats = [
  { value: 100, suffix: '%', label: 'Your data', detail: 'Always accessible to you' },
  { value: 1, suffix: '', label: 'Single portal', detail: 'Everything in one place' },
  { value: 24, suffix: '/7', label: 'Availability', detail: 'Works even offline' },
  { value: 0, suffix: '', label: 'Paperwork', detail: 'No forms to chase' }
]

const steps = [
  {
    icon: Mail,
    title: 'Receive your invite',
    description:
      'Your organization sends a secure invitation to the email already on file. There is no public sign up.'
  },
  {
    icon: Fingerprint,
    title: 'Activate your account',
    description:
      'Open the activation link, confirm your identity, and set a password to secure your account.'
  },
  {
    icon: UserRound,
    title: 'Manage your membership',
    description:
      'Sign in to your personal dashboard to view your profile, dependants, payments, and messages.'
  }
]

/* Personal dashboard preview bars — a member's own payment timeline */
const paymentBars = [
  { label: 'Jan', height: 70 },
  { label: 'Feb', height: 88 },
  { label: 'Mar', height: 64 },
  { label: 'Apr', height: 96 }
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

/* A member's personal dashboard preview */
function MemberPanel() {
  return (
    <Card className="overflow-hidden border-border/80 bg-card/95 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur-sm dark:shadow-[0_28px_80px_rgba(2,6,23,0.4)]">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/70 bg-muted/40 space-y-0 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UserRound className="size-5" />
          </div>
          <div>
            <CardDescription className="text-muted-foreground">Welcome back</CardDescription>
            <CardTitle className="text-lg tracking-tight text-card-foreground">
              Your membership
            </CardTitle>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-chart-2/15 px-2.5 py-1 text-xs font-medium text-chart-2">
          <span className="size-1.5 rounded-full bg-chart-2" />
          Active
        </span>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* KPI row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-muted/40 p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <HeartHandshake className="size-4 text-primary" />
              Dependants
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-card-foreground">
              <Counter to={4} />
            </p>
            <p className="mt-1 text-xs text-muted-foreground">All records complete</p>
          </div>
          <div className="rounded-2xl border border-border bg-muted/40 p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <CreditCard className="size-4 text-primary" />
              Subscription
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-card-foreground">
              <Counter to={100} suffix="%" />
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs text-chart-2">
              <TrendingUp className="size-3.5" /> Paid &amp; up to date
            </p>
          </div>
        </div>

        {/* Payment history */}
        <div className="rounded-2xl border border-border bg-muted/30 p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-card-foreground">Your payment history</p>
            <ReceiptText className="size-4 text-muted-foreground" />
          </div>
          <div className="flex h-32 items-end justify-between gap-3">
            {paymentBars.map((bar) => (
              <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-24 w-full items-end justify-center">
                  <div
                    className="w-full rounded-t-lg bg-primary"
                    style={{ height: `${bar.height}%` }}
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
            { icon: CalendarHeart, text: 'Happy birthday! A greeting is on its way' },
            { icon: BellRing, text: 'New announcement from your organization' }
          ].map((row) => (
            <div
              key={row.text}
              className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5 shadow-sm"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <row.icon className="size-4" />
              </div>
              <p className="text-sm text-muted-foreground">{row.text}</p>
            </div>
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
    <main className="relative isolate min-h-screen overflow-clip bg-background text-foreground">
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
              <div className="text-xs text-muted-foreground">Your membership portal</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
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

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 pt-20 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="grid flex-1 items-center gap-12 py-8 lg:grid-cols-[1.06fr_0.94fr] lg:py-10">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm">
              <ShieldCheck className="size-4 text-primary" />
              Your membership, all in one place
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Everything about your membership, right at your fingertips.
              </h1>
              <p className="max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
                View your profile, keep your dependants up to date, follow your payment history, and
                stay in the loop with announcements — all from one secure portal that works even
                offline.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="rounded-full px-6 shadow-sm">
                <Link to={'/signin' as any}>
                  Sign in to your portal
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-border px-6 shadow-none"
              >
                <a href="#features">See what you can do</a>
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
          </div>

          <div className="relative">
            <MemberPanel />
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-14 sm:py-18">
          <SectionTitle
            eyebrow="What you can do"
            title="Your membership, fully in your hands"
            description="Everything you need to stay on top of your membership lives in a single, easy-to-use portal built just for you."
          />

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {features.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.45, delay: (index % 3) * 0.06 }}
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
        <section id="how-it-works" className="py-14 sm:py-18">
          <SectionTitle
            eyebrow="How it works"
            title="Getting started takes just three steps"
            description="There is no public sign up. You join once your organization invites you, then your personal portal is ready to go."
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
        <section id="security" className="py-14 sm:py-18">
          <div className="grid gap-8 rounded-[2rem] border border-border/80 bg-card/90 p-8 shadow-sm lg:grid-cols-[1fr_1fr] lg:p-12">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">
                Private &amp; secure
              </p>
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-card-foreground sm:text-4xl">
                Your information stays protected, every step of the way.
              </h2>
              <p className="text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                Your personal details and payment records are kept safe with encrypted storage and
                secure sign-in. And because the portal works offline, your information is always
                available when you need it.
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
                { icon: WifiOff, title: 'Works offline', text: 'Access your details anytime.' },
                { icon: Lock, title: 'Encrypted data', text: 'Your records stay private.' },
                {
                  icon: Fingerprint,
                  title: 'Secure sign-in',
                  text: 'Only you can access your account.'
                },
                {
                  icon: ReceiptText,
                  title: 'Clear records',
                  text: 'Every payment neatly tracked.'
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
                    Sign in to your membership portal.
                  </h2>
                  <p className="text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                    Already have an invite? Sign in to view your profile, dependants, payments, and
                    messages — all in one secure place.
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
              <span>Membership Allocation · Your membership portal</span>
            </div>
            <p>Invite-only access · No public sign up</p>
          </div>
        </footer>
      </div>
    </main>
  )
}
