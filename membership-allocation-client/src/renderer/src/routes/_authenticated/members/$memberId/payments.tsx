import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Payments } from '@/features/payments'
import { PaymentsPendingSkeleton } from '@/features/payments/components/payments-pending-skeleton'

const paymentsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10)
})

export const Route = createFileRoute('/_authenticated/members/$memberId/payments')({
  validateSearch: paymentsSearchSchema,
  component: Payments,
  pendingComponent: PaymentsPendingSkeleton
})
