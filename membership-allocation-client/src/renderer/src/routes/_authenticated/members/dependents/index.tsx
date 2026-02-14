import { createFileRoute } from '@tanstack/react-router'
import { Dependents } from '@/features/dependents'
import { membersService } from '@/api/services'

export const Route = createFileRoute('/_authenticated/members/dependents/')({
  validateSearch: (search: Record<string, unknown>) => {
    const rawPage = search.page
    const rawPageSize = search.pageSize

    const page =
      typeof rawPage === 'number'
        ? rawPage
        : Number(rawPage) > 0
          ? Number(rawPage)
          : 1

    const pageSize =
      typeof rawPageSize === 'number'
        ? rawPageSize
        : Number(rawPageSize) > 0
          ? Number(rawPageSize)
          : 50

    return {
      ...search,
      page,
      pageSize
    }
  },
  loader: async ({ search }) => {
    const { page, pageSize } = search as { page: number; pageSize: number }

    // Fetch a page of members which includes their dependents
    const membersResponse = await membersService.getMembers(page, pageSize)
    return { membersResponse }
  },
  component: Dependents
})
