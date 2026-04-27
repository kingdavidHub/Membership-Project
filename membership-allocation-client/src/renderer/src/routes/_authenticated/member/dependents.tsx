import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { MemberDependents } from '@/features/member-dependents'
import { DependentsPendingSkeleton } from '@/features/dependents/components/dependents-pending-skeleton'
import { usersService, membersService } from '@/api/services'

const dependentsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(50)
})

export const Route = createFileRoute('/_authenticated/member/dependents')({
  validateSearch: dependentsSearchSchema,
  loader: async ({ context }) => {
    const userProfile = await context.queryClient.ensureQueryData({
      queryKey: ['userProfile'],
      queryFn: () => usersService.getUserProfile(),
      staleTime: 5 * 60 * 1000
    })

    const memberId = userProfile?.member?._id

    if (memberId) {
      await context.queryClient.ensureQueryData({
        queryKey: ['dependents', memberId],
        queryFn: () => membersService.getMemberDependents(memberId)
      })
    }

    return null
  },
  component: MemberDependents,
  pendingComponent: DependentsPendingSkeleton
})
