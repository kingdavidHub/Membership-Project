'use client'

import { type Table } from '@tanstack/react-table'
import { SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { paymentStatuses, memberStatuses } from '../data/data'
import { type Member } from '../data/schema'

type MembersAttributeDialogProps = {
  table: Table<Member>
}

export function MembersAttributeDialog({ table }: MembersAttributeDialogProps) {
  const paymentColumn = table.getColumn('paymentStatus')
  const memberColumn = table.getColumn('memberStatus')

  const rawPayment = paymentColumn?.getFilterValue()
  const rawMember = memberColumn?.getFilterValue()

  const activePayment: string[] = Array.isArray(rawPayment)
    ? rawPayment
    : rawPayment
      ? [rawPayment as string]
      : []

  const activeMember: string[] = Array.isArray(rawMember)
    ? rawMember
    : rawMember
      ? [rawMember as string]
      : []

  const isAll = activePayment.length === 0 && activeMember.length === 0
  const activeCount = activePayment.length + activeMember.length

  const setPaymentFilter = (value: string) => {
    paymentColumn?.setFilterValue([value])
  }

  const setMemberFilter = (value: string) => {
    memberColumn?.setFilterValue([value])
  }

  const clearAll = () => {
    table.setColumnFilters([])
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Attribute</span>
          {activeCount > 0 && (
            <span className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="start">
        <div className="space-y-3">
          {/* All Members */}
          <Button
            variant={isAll ? 'default' : 'ghost'}
            size="sm"
            className="w-full justify-start"
            onClick={clearAll}
          >
            All Members
          </Button>

          <Separator />

          {/* Payment */}
          <div className="space-y-1.5">
            <p className="px-1 text-xs font-medium text-muted-foreground">Payment</p>
            <div className="flex flex-wrap gap-1.5">
              {paymentStatuses.map((status) => {
                const isActive = activePayment.includes(status.value)
                return (
                  <Button
                    key={status.value}
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    className={cn('h-7 text-xs', isActive && 'pointer-events-none')}
                    onClick={() => setPaymentFilter(status.value)}
                  >
                    {status.label}
                  </Button>
                )
              })}
            </div>
          </div>

          <Separator />

          {/* Status */}
          <div className="space-y-1.5">
            <p className="px-1 text-xs font-medium text-muted-foreground">Status</p>
            <div className="flex flex-wrap gap-1.5">
              {memberStatuses.map((status) => {
                const isActive = activeMember.includes(status.value)
                return (
                  <Button
                    key={status.value}
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    className={cn('h-7 text-xs', isActive && 'pointer-events-none')}
                    onClick={() => setMemberFilter(status.value)}
                  >
                    {status.label}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
