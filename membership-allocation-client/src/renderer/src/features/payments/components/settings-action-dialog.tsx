'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { settingsService } from '@/api/services'
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
  defaultMonthlyPayment: z
    .coerce
    .number()
    .int('Amount must be a whole number.')
    .positive('Amount is required.')
})

type SettingsFormInput = z.input<typeof formSchema>
type SettingsForm = z.output<typeof formSchema>

const normalizeNumericInputValue = (value: unknown) => {
  if (typeof value === 'number') {
    return String(value)
  }
  if (typeof value === 'string') {
    return value
  }
  return ''
}

type SettingsActionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsActionDialog({ open, onOpenChange }: SettingsActionDialogProps) {
  const form = useForm<SettingsFormInput, unknown, SettingsForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      defaultMonthlyPayment: undefined
    }
  })

  const updateMutation = useMutation({
    mutationFn: (values: SettingsForm) =>
      settingsService.updateDefaultMonthlyPayment({
        defaultMonthlyPayment: values.defaultMonthlyPayment
      }),
    onSuccess: (response) => {
      toast.success(
        `Default monthly payment updated to ${response.data.currency} ${response.data.defaultMonthlyPayment.toLocaleString()}.`
      )
      form.reset()
      onOpenChange(false)
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const message = error?.response?.data?.message || 'Failed to update default monthly payment. Please try again.'
      toast.error(message)
    }
  })

  const onSubmit = (values: SettingsForm) => {
    updateMutation.mutate(values)
  }

  const isPending = updateMutation.isPending

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
          <DialogTitle>Update Default Monthly Payment</DialogTitle>
          <DialogDescription>
            Set the default monthly payment amount for all members. This is used as the
            standard payment expectation across the system.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="settings-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="defaultMonthlyPayment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Monthly Payment</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="1000"
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
          <Button type="submit" form="settings-form" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
