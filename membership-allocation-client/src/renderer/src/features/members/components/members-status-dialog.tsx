'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { membersService } from '@/api/services'
import { SelectDropdown } from '@/components/select-dropdown'
import { memberStatuses, paymentStatuses } from '../data/data'
import { type Member } from '../data/schema'
import { type MemberStatus, type PaymentStatus } from '@/api/types/member.types'
import { useMembers } from './members-provider'

const formSchema = z.object({
  status: z.string().min(1, 'Status is required.')
})

type MemberStatusForm = z.infer<typeof formSchema>

type MembersStatusDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedMembers: Member[]
  mode?: 'member' | 'payment'
}

const formatMemberChip = (member: Member) => {
  const surnameInitial = member.lastName?.charAt(0)?.toUpperCase() || ''
  return `${member.firstName} ${surnameInitial}`.trim()
}

export function MembersStatusDialog({
  open,
  onOpenChange,
  selectedMembers,
  mode = 'member'
}: MembersStatusDialogProps) {
  const router = useRouter()
  const { requestSelectionReset } = useMembers()
  const isPaymentStatus = mode === 'payment'
  const statusLabel = isPaymentStatus ? 'Payment Status' : 'Member Status'
  const dialogTitle = isPaymentStatus ? 'Update Payment Status' : 'Update Member Status'
  const defaultStatusValue = isPaymentStatus ? 'unpaid' : 'inactive'
  const statusOptions = isPaymentStatus ? paymentStatuses : memberStatuses

  const defaultValues: MemberStatusForm = {
    status: defaultStatusValue
  }

  const form = useForm<MemberStatusForm>({
    resolver: zodResolver(formSchema),
    defaultValues
  })

  const memberIds = selectedMembers.map((member) => member._id)

  const updateStatusMutation = useMutation({
    mutationFn: (values: MemberStatusForm) => {
      if (isPaymentStatus) {
        return membersService.updateMemberPaymentStatusBulk({
          paymentStatus: values.status as PaymentStatus,
          memberIds
        })
      }

      return membersService.updateMemberStatusBulk({
        memberStatus: values.status as MemberStatus,
        memberIds
      })
    },
    onSuccess: () => {
      toast.success(`${statusLabel} updated successfully.`)
      form.reset(defaultValues)
      onOpenChange(false)
      requestSelectionReset()
      router.invalidate()
    },
    onError: () => {
      toast.error(`Failed to update ${statusLabel.toLowerCase()}. Please try again.`)
    }
  })

  const onSubmit = (values: MemberStatusForm) => {
    updateStatusMutation.mutate(values)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset(defaultValues)
        onOpenChange(state)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            Change the status for {selectedMembers.length} selected member
            {selectedMembers.length > 1 ? 's' : ''}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="member-status-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{statusLabel}</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder={`Select ${statusLabel.toLowerCase()}`}
                    items={statusOptions.map(({ label, value }) => ({ label, value }))}
                    isControlled
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="space-y-2">
          <p className="text-sm font-medium">Selected Members</p>
          <div className="flex flex-wrap gap-2">
            {selectedMembers.map((member) => (
              <Badge key={member._id} variant="outline" className="rounded-full px-3 py-1">
                {formatMemberChip(member)}
              </Badge>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="member-status-form" disabled={updateStatusMutation.isPending}>
            {updateStatusMutation.isPending ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
