import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Dependents } from '@/features/dependents'
import { DependentsPendingSkeleton } from '@/features/dependents/components/dependents-pending-skeleton'

const dependentsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(50)
})

export const Route = createFileRoute('/_authenticated/members/$memberId/dependents')({
  validateSearch: dependentsSearchSchema,
  component: Dependents,
  pendingComponent: DependentsPendingSkeleton
})
