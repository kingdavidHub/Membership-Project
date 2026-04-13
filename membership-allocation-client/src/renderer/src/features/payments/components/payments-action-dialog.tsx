'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { membersService } from '@/api/services'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  amount: z.coerce.number().int().positive('Amount is required.'),
  duration: z.coerce.number().int().positive('Duration is required.')
})

type PaymentFormInput = z.input<typeof formSchema>
type PaymentForm = z.output<typeof formSchema>

type PaymentsActionDialogProps = {
  memberId: string
  memberName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}


const normalizeNumericInputValue = (value: unknown) => {
  if (typeof value === 'number') {
    return String(value)
  }

  if (typeof value === 'string') {
    return value
  }

  return ''
}

export function PaymentsActionDialog({
  memberId,
  memberName,
  open,
  onOpenChange
}: PaymentsActionDialogProps) {
  const queryClient = useQueryClient()

  const form = useForm<PaymentFormInput, unknown, PaymentForm>({
    resolver: zodResolver(formSchema),
  })

  const createMutation = useMutation({
    mutationFn: (values: PaymentForm) => membersService.createMemberPayment(memberId, values),
    onSuccess: () => {
      toast.success('Payment added successfully.')
      form.reset()
      onOpenChange(false)
      queryClient.invalidateQueries({ queryKey: ['member-payments', memberId] })
    },
    onError: () => {
      toast.error('Failed to add payment. Please try again.')
    }
  })

  const onSubmit = (values: PaymentForm) => {
    createMutation.mutate(values)
  }

  const isPending = createMutation.isPending

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-start">
          <DialogTitle>Add Payment</DialogTitle>
          <DialogDescription>
            Add a payment for {memberName}. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="payment-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="5000"
                      value={normalizeNumericInputValue(field.value)}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="2"
                      value={normalizeNumericInputValue(field.value)}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="payment-form" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Payment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
