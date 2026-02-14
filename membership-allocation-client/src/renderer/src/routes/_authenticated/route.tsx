import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { useAuthStore } from '@/stores/auth-store'
import { usersService } from '@/api/services/users.service'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    // TODO: Remove this check since the header contains auth token we should check for that rather than cookies
    const accessToken = useAuthStore.getState().auth.accessToken

    if (!accessToken) {
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: location.href
        }
      })
    }
  },
  loader: async () => {
    // Retrieve user profile for all authenticated routes
    const userProfile = await usersService.getUserProfile()
    return { userProfile }
  },
  component: AuthenticatedLayout
})
