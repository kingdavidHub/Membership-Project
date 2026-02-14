import { CreditCard, CheckCircle, Clock, XCircle, UserCheck, UserX, UserMinus } from 'lucide-react'
import { type PaymentStatus, type MemberStatus } from './schema'

export const paymentStatusTypes = new Map<PaymentStatus, string>([
  ['paid', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['unpaid', 'bg-amber-100/30 text-amber-900 dark:text-amber-200 border-amber-200'],
  [
    'overdue',
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10'
  ],
  ['exempted', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300']
])

export const memberStatusTypes = new Map<MemberStatus, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
  [
    'suspended',
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10'
  ]
])

export const paymentStatuses = [
  {
    label: 'Paid',
    value: 'paid',
    icon: CheckCircle
  },
  {
    label: 'Unpaid',
    value: 'unpaid',
    icon: Clock
  },
  {
    label: 'Overdue',
    value: 'overdue',
    icon: XCircle
  },
  {
    label: 'Exempted',
    value: 'exempted',
    icon: CreditCard
  }
] as const

export const memberStatuses = [
  {
    label: 'Active',
    value: 'active',
    icon: UserCheck
  },
  {
    label: 'Inactive',
    value: 'inactive',
    icon: UserMinus
  },
  {
    label: 'Suspended',
    value: 'suspended',
    icon: UserX
  }
] as const
