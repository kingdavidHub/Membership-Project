import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Dependents } from '@/features/dependents'
import { DependentsPendingSkeleton } from '@/features/dependents/components/dependents-pending-skeleton'
import { membersService } from '@/api/services'

const dependentsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(50)
})

export const Route = createFileRoute('/_authenticated/members/dependents/')({
  validateSearch: dependentsSearchSchema,
  loaderDeps: ({ search }) => ({ page: search.page, pageSize: search.pageSize }),
  loader: async ({ deps }) => {
    // Fetch a page of members which includes their dependents
    const membersResponse = await membersService.getMembers(deps.page || 1, deps.pageSize || 50)
    return { membersResponse }
  },
  component: Dependents,
  pendingComponent: DependentsPendingSkeleton
})
