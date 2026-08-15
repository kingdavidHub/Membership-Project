import { useSearch } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })
  return (
    <AuthLayout>
      <Card className="gap-5 border-border/80 bg-card/95 p-2 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-4">
        <CardHeader>
          <CardTitle className="text-2xl tracking-tight">Sign in</CardTitle>
          <CardDescription>
            Use the email address and password from your invite to access your member portal.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8">
          <UserAuthForm redirectTo={redirect} />
        </CardContent>
        <CardFooter>
          <p className="px-4 text-center text-sm text-muted-foreground sm:px-8">
            Need help with access? Reach out to your organization if you have not received an invite.
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
