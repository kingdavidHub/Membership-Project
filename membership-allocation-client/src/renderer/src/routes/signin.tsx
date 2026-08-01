import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/signin' as any)({
  beforeLoad: () => {
    throw redirect({ to: '/sign-in' })
  }
})