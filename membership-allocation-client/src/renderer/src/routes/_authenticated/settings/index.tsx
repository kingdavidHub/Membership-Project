import { createFileRoute } from '@tanstack/react-router'
import { SettingsProfile } from '@/features/settings/profile'
import { usersService } from '@/api/services'

export const Route = createFileRoute('/_authenticated/settings/')({
  loader: async () => {
    // * Get the user data and pass it to the component as a prop
    const userProfile = await usersService.getCurrentUserProfile()
    console.log('Loaded User Profile:', userProfile) // Log the loaded user profile to verify it's being fetched correctly
    return { userProfile }
  },
  component: SettingsProfile
})
