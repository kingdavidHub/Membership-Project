import { createFileRoute } from '@tanstack/react-router'
import { Dependents } from '@/features/dependents'
import { membersService } from '@/api/services'

export const Route = createFileRoute('/_authenticated/members/dependents/')({
  loader: async () => {
    // Fetch all members which includes their dependents
    const membersResponse = await membersService.getMembers(1, 1000) // Get all members
    return { membersResponse }
  },
  component: Dependents
})
