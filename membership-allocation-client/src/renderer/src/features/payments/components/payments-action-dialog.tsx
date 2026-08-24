'use client'

import { useEffect, useMemo, useState } from 'react'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  addMonths,
  format,
  endOfMonth,
  getDay,
  getDaysInMonth,
  startOfMonth
} from 'date-fns'
import { CalendarDays, Info, Calendar } from 'lucide-react'
import { membersService, settingsService } from '@/api/services'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

type PaymentsActionDialogProps = {
  memberId: string
  memberName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Mini calendar grid showing days in a month */
function MiniMonthCalendar({ date }: { date: Date }) {
  const daysInMonth = getDaysInMonth(date)
  const firstDayOfWeek = getDay(startOfMonth(date))

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <div className="rounded-md border bg-background p-2.5">
      <div className="mb-1.5 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {format(date, 'MMM yyyy')}
      </div>
      <div className="mb-0.5 grid grid-cols-7 gap-0.5">
        {dayLabels.map((d, i) => (
          <div key={i} className="text-center text-[8px] text-muted-foreground">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => (
          <div
            key={i}
            className={`flex h-4 items-center justify-center rounded text-[9px] ${
              day ? 'font-medium text-foreground' : ''
            }`}
          >
            {day ?? ''}
          </div>
        ))}
      </div>
    </div>
  )
}


/** Compact coverage display for 3-12 months: start → dotted line → end */
function CompactCoverage({ start, end }: { start: Date; end: Date }) {
  return (
    <div className="flex items-stretch gap-0">
      {/* Start date */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2.5">
          <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="whitespace-nowrap text-sm font-medium">{format(start, 'd MMM yyyy')}</span>
        </div>
      </div>

      {/* Vertical dotted connector */}
      <div className="flex flex-1 flex-col items-center px-1">
        <div className="h-full border-l-2 border-dashed border-muted-foreground/40" />
      </div>

      {/* End date */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2.5">
          <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="whitespace-nowrap text-sm font-medium">{format(end, 'd MMM yyyy')}</span>
        </div>
      </div>
    </div>
  )
}

export function PaymentsActionDialog({
  memberId,
  memberName,
  open,
  onOpenChange
}: PaymentsActionDialogProps) {
  const queryClient = useQueryClient()
  const { data: settingsData } = useQuery({
    queryKey: ['default-monthly-payment'],
    queryFn: () => settingsService.getDefaultMonthlyPayment(),
    enabled: open,
    refetchOnMount: 'always'
  })

  const defaultMonthly = settingsData?.data?.defaultMonthlyPayment ?? 0

  const [duration, setDuration] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ duration?: string; amount?: string }>({})

  // Auto-fill duration to 1 when dialog opens and default is available
  useEffect(() => {
    if (open && defaultMonthly > 0 && !duration) {
      setDuration('1')
      setAmount(String(defaultMonthly))
    }
  }, [open, defaultMonthly])

  // Reset on close
  useEffect(() => {
    if (!open) {
      setDuration('')
      setAmount('')
      setErrors({})
      setIsSubmitting(false)
    }
  }, [open])

  // Auto-calculate amount when duration changes
  const handleDurationChange = (value: string) => {
    setDuration(value)
    setErrors((prev) => ({ ...prev, duration: undefined }))
    const dur = parseInt(value, 10)
    if (!isNaN(dur) && dur > 0 && defaultMonthly > 0) {
      setAmount(String(dur * defaultMonthly))
    } else {
      setAmount('')
    }
  }

  const handleAmountChange = (value: string) => {
    setAmount(value)
    setErrors((prev) => ({ ...prev, amount: undefined }))
  }

  // Calculate coverage dates
  const coverage = useMemo(() => {
    const dur = parseInt(duration, 10)
    if (isNaN(dur) || dur <= 0) return null

    const now = new Date()
    const start = now
    const end = addMonths(now, dur)
    return { start, end, dur }
  }, [duration])

  // Validate and submit
  const handleSubmit = async () => {
    const dur = parseInt(duration, 10)
    const amt = parseInt(amount, 10)
    const newErrors: { duration?: string; amount?: string } = {}

    if (isNaN(dur) || dur < 1) {
      newErrors.duration = 'Duration must be at least 1 month.'
    } else if (dur > 12) {
      newErrors.duration = 'Duration cannot exceed 12 months.'
    }
    if (isNaN(amt) || amt <= 0) {
      newErrors.amount = 'Amount is required.'
    } else if (defaultMonthly > 0 && amt % defaultMonthly !== 0) {
      newErrors.amount = `Amount must be a multiple of ${defaultMonthly.toLocaleString()} (default monthly payment).`
    } else if (defaultMonthly > 0 && dur > 0 && amt < dur * defaultMonthly) {
      newErrors.amount = `Minimum amount for ${dur} month(s) is ${(dur * defaultMonthly).toLocaleString()}.`
    }

    if (newErrors.duration || newErrors.amount) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    try {
      await membersService.createMemberPayment(memberId, { amount: amt, duration: dur })
      toast.success('Payment added successfully.')
      queryClient.invalidateQueries({ queryKey: ['member-payments', memberId] })
      onOpenChange(false)
    } catch {
      // Error is handled by the global interceptor toast
    } finally {
      setIsSubmitting(false)
    }
  }

  const dur = parseInt(duration, 10)
  const isSingleMonth = !isNaN(dur) && dur === 1
  const isMultiMonth = !isNaN(dur) && dur >= 2

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="text-start">
          <DialogTitle>Add Payment</DialogTitle>
          <DialogDescription>
            Add a payment for {memberName}. Coverage starts from today.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 py-4 sm:grid-cols-2">
          {/* Left: Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (months)</Label>
              <Input
                id="duration"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="1"
                value={duration}
                onChange={(e) => handleDurationChange(e.target.value.replace(/[^0-9]/g, ''))}
              />
              {errors.duration && (
                <p className="text-sm text-destructive">{errors.duration}</p>
              )}
              {!errors.duration && (
                <p className="text-xs text-muted-foreground">
                  Minimum 1, maximum 12 months
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="0"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value.replace(/[^0-9]/g, ''))}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount}</p>
              )}
              {defaultMonthly > 0 && (
                <p className="text-xs text-muted-foreground">
                  Must be a multiple of {defaultMonthly.toLocaleString()} and at least{' '}
                  {defaultMonthly.toLocaleString()} × {duration || 0} ={' '}
                  {(parseInt(duration || '0', 10) * defaultMonthly).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          {/* Right: Coverage period visual */}
          <div className="flex flex-col rounded-lg border bg-muted/30 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium">
              <CalendarDays className="h-4 w-4" />
              Coverage Period
            </div>

            {!coverage ? (
              <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                Enter a duration to see coverage
              </div>
            ) : isSingleMonth ? (
              /* 1 month: mini calendar with day grid */
              <div className="space-y-2">
                <MiniMonthCalendar date={coverage.start} />
                <Separator className="my-1" />
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>
                    Coverage: {format(coverage.start, 'MMMM d')} – {format(endOfMonth(coverage.start), 'MMMM d, yyyy')}
                  </span>
                </div>
              </div>
            ) : isMultiMonth ? (
              /* 2+ months: compact start → dotted line → end */
              <div className="space-y-2">
                <CompactCoverage start={coverage.start} end={coverage.end} />
                <Separator className="my-1" />
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>
                    {coverage.dur} months of coverage: {format(coverage.start, 'd MMM yyyy')} → {format(coverage.end, 'd MMM yyyy')}
                  </span>
                </div>
              </div>
            ) : null}

            {defaultMonthly > 0 && (
              <>
                <Separator className="my-3" />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Default monthly</span>
                  <span className="font-medium">{defaultMonthly.toLocaleString()}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting || defaultMonthly === 0}>
            {isSubmitting ? 'Saving...' : 'Save Payment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
