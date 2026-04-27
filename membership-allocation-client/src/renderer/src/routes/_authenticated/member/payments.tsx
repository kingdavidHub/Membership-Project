import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { MemberPayments } from '@/features/member-payments'
import { PaymentsPendingSkeleton } from '@/features/payments/components/payments-pending-skeleton'

const paymentsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10)
})

export const Route = createFileRoute('/_authenticated/member/payments')({
  validateSearch: paymentsSearchSchema,
  component: MemberPayments,
  pendingComponent: PaymentsPendingSkeleton
})
