import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Users } from '@/features/users'
import { roles } from '@/features/users/data/data'
import { usersService } from '@/api/services/users.service'

const usersSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Facet filters
  status: z
    .array(
      z.union([
        z.literal('active'),
        z.literal('inactive'),
        z.literal('invited'),
        z.literal('suspended')
      ])
    )
    .optional()
    .catch([]),
  role: z
    .array(z.enum(roles.map((r) => r.value as (typeof roles)[number]['value'])))
    .optional()
    .catch([]),
  // Per-column text filter
  name: z.string().optional().catch('')
})

export const Route = createFileRoute('/_authenticated/users/')({
  validateSearch: usersSearchSchema,
  loaderDeps: ({ search }) => ({ page: search.page, pageSize: search.pageSize }),
  loader: async ({ deps }) => {
    // Get page and limit from search params, default to page 1 and limit 10
    const page = deps.page || 1
    const limit = deps.pageSize || 10

    const usersResponse = await usersService.getUsers(page, limit)
    return { usersResponse }
  },
  component: Users
})
