import { Logo } from '@/assets/logo'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from '@tanstack/react-router'
import { ShieldCheck, Clock3, CreditCard, Users, ArrowLeft } from 'lucide-react'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const navigate = useNavigate()
  return (
    <div className="relative min-h-svh overflow-hidden bg-background text-foreground">
      <div className="absolute left-6 top-9 hidden lg:block">
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
      <div className="pointer-events-none absolute -left-24 top-16 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/2 -z-10 h-80 w-80 rounded-full bg-chart-2/10 blur-3xl" />

      <div className="mx-auto grid min-h-svh max-w-7xl lg:grid-cols-[1.05fr_480px]">
        <aside className="hidden border-r border-border/70 px-8 py-8 lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
                <Logo className="size-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">Membership Allocation</h1>
                <p className="text-sm text-muted-foreground">Member access portal</p>
              </div>
            </div>
            <ThemeSwitch />
          </div>

          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm">
              <ShieldCheck className="size-4 text-primary" />
              Invite-only access for members
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-semibold tracking-tight text-foreground">
                Sign in to a portal that follows your current theme.
              </h2>
              <p className="max-w-lg text-lg leading-8 text-muted-foreground">
                The sign-in experience uses the same design tokens as the rest of the app, so the
                transition between light and dark stays seamless.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-border/80 bg-card/90 shadow-sm">
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Clock3 className="size-5" />
                  </div>
                  <CardTitle className="text-base">Fast access</CardTitle>
                  <CardDescription>
                    Return to your account quickly from any device.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border/80 bg-card/90 shadow-sm">
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <CreditCard className="size-5" />
                  </div>
                  <CardTitle className="text-base">Payments</CardTitle>
                  <CardDescription>
                    Review payment history and current status in one place.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border/80 bg-card/90 shadow-sm sm:col-span-2">
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Users className="size-5" />
                  </div>
                  <CardTitle className="text-base">Dependents and profile</CardTitle>
                  <CardDescription>
                    Keep linked dependents and account details organized and easy to review.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Invite-only access. No public sign up.
          </p>
        </aside>

        <section className="flex flex-col px-4 py-6 sm:px-8 lg:justify-center">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
                <Logo className="size-5 text-primary" />
              </div>
              <div>
                <h1 className="text-base font-semibold">Membership Allocation</h1>
                <p className="text-xs text-muted-foreground">Member access portal</p>
              </div>
            </div>
            <ThemeSwitch />
          </div>

          <div className="mx-auto w-full max-w-md lg:max-w-none">
            {children}
          </div>
        </section>
      </div>
    </div>
  )
}
