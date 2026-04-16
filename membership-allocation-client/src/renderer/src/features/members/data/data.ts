import { CheckCircle, Clock, UserCheck, UserMinus, Skull, LoaderCircle } from 'lucide-react'
import { type PaymentStatus, type MemberStatus } from './schema'

export const paymentStatusTypes = new Map<PaymentStatus, string>([
  ['pending', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
  ['paid', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['unpaid', 'bg-amber-100/30 text-amber-900 dark:text-amber-200 border-amber-200']
])

export const memberStatusTypes = new Map<MemberStatus, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
  ['deceased', 'bg-slate-300/40 text-slate-900 dark:text-slate-200 border-slate-300']
])

export const paymentStatuses = [
  {
    label: 'Pending',
    value: 'pending',
    icon: LoaderCircle
  },
  {
    label: 'Paid',
    value: 'paid',
    icon: CheckCircle
  },
  {
    label: 'Unpaid',
    value: 'unpaid',
    icon: Clock
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
    label: 'Deceased',
    value: 'deceased',
    icon: Skull
  }
] as const
