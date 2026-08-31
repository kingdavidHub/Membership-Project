import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Users } from '@/features/users'
import { UsersPendingSkeleton } from '@/features/users/components/users-pending-skeleton'
import { roles } from '@/features/users/data/data'
import { usersService } from '@/api/services/users.service'

const usersSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  scope: z.enum(['unregistered']).optional(),
  // Facet filters
  role: z
    .array(z.enum(roles.map((r) => r.value as (typeof roles)[number]['value'])))
    .optional()
    .catch([]),
  // Per-column text filter
  name: z.string().optional().catch('')
})

export const Route = createFileRoute('/_authenticated/users/')({
  validateSearch: usersSearchSchema,
  loaderDeps: ({ search }) => ({
    page: search.page,
    pageSize: search.pageSize,
    scope: search.scope
  }),
  loader: async ({ deps }) => {
    // Get page and limit from search params, default to page 1 and limit 10
    const page = deps.page || 1
    const limit = deps.pageSize ?? 10

    const usersResponse =
      deps.scope === 'unregistered'
        ? await usersService.getUnregisteredUsers(page, limit)
        : await usersService.getUsers(page, limit)
    return { usersResponse }
  },
  component: Users,
  pendingComponent: UsersPendingSkeleton
})
