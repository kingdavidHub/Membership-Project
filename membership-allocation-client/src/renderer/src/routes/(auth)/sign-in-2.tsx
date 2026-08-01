import { createFileRoute, redirect } from '@tanstack/react-router'
import { SignIn2 } from '@/features/auth/sign-in/sign-in-2'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/(auth)/sign-in-2')({
  beforeLoad: () => {
    if (import.meta.env.PROD) {
      const accessToken = useAuthStore.getState().auth.accessToken
      throw redirect({ to: accessToken ? ('/dashboard' as any) : '/sign-in' })
    }

    return undefined
  },
  component: SignIn2
})
