import { createFileRoute } from '@tanstack/react-router'
import { Dashboard } from '@/features/dashboard'
import { usersService } from '@/api/services/users.service'

export const Route = createFileRoute('/_authenticated/')({
  component: Dashboard
  // loader: async () => {
  //   // Retrieve user profile
  //   const userProfile = await usersService.getUserProfile()
  //   return { userProfile }
  // }
})
