import { createFileRoute, redirect } from '@tanstack/react-router'
import { Otp } from '@/features/auth/otp'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/(auth)/otp')({
  beforeLoad: () => {
    if (import.meta.env.PROD) {
      const accessToken = useAuthStore.getState().auth.accessToken
      throw redirect({ to: accessToken ? '/' : '/sign-in' })
    }

    return undefined
  },
  component: Otp
})
