import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Members } from '@/features/members'
import { MembersPendingSkeleton } from '@/features/members/components/members-pending-skeleton'
import { membersService } from '@/api/services'

const membersSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Facet filters
  paymentStatus: z
    .array(
      z.union([z.literal('unpaid'), z.literal('paid'), z.literal('overdue'), z.literal('exempted')])
    )
    .optional()
    .catch([]),
  memberStatus: z
    .array(z.union([z.literal('active'), z.literal('inactive'), z.literal('suspended')]))
    .optional()
    .catch([]),
  // Per-column text filter
  name: z.string().optional().catch('')
})

export const Route = createFileRoute('/_authenticated/members/')({
  validateSearch: membersSearchSchema,
  loaderDeps: ({ search }) => ({ page: search.page, pageSize: search.pageSize }),
  loader: async ({ deps }) => {
    const membersResponse = await membersService.getMembers(deps.page || 1, deps.pageSize || 10)
    return { membersResponse }
  },
  component: Members,
  pendingComponent: MembersPendingSkeleton
})
