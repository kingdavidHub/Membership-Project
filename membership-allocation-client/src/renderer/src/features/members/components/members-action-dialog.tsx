'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { showSubmittedData } from '@/lib/show-submitted-data'
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
import { SelectDropdown } from '@/components/select-dropdown'
import { membersService } from '@/api/services'
import {
  type MemberStatus,
  type PaymentStatus,
  type UpdateMemberRequest
} from '@/api/types/member.types'
import { paymentStatuses, memberStatuses } from '../data/data'
import { type Member } from '../data/schema'

const formSchema = z.object({
  firstName: z.string().min(1, 'First Name is required.'),
  lastName: z.string().min(1, 'Last Name is required.'),
  membershipId: z.string().min(1, 'Membership ID is required.'),
  entryYear: z.string().min(1, 'Entry year is required.'),
  dob: z.string().optional(),
  paymentStatus: z.string().min(1, 'Payment status is required.'),
  memberStatus: z.string().min(1, 'Member status is required.'),
  isEdit: z.boolean()
})

type MemberForm = z.infer<typeof formSchema>

type MemberActionDialogProps = {
  currentRow?: Member
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MembersActionDialog({ currentRow, open, onOpenChange }: MemberActionDialogProps) {
  const isEdit = !!currentRow
  const router = useRouter()

  const maskMembershipId = (value: string) => {
    const trimmed = value.trim()
    if (trimmed.length < 4) return trimmed
    return `${trimmed.slice(0, 2)}*****${trimmed.slice(-2)}`
  }

  const normalizeDateInput = (value?: string) => {
    if (!value) return ''
    return value.split('T')[0] ?? value
  }

  const form = useForm<MemberForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
        firstName: currentRow.firstName,
        lastName: currentRow.lastName,
        membershipId: currentRow.membershipId,
        entryYear: String(currentRow.entryYear),
        dob: normalizeDateInput(currentRow.dob),
        paymentStatus: currentRow.paymentStatus,
        memberStatus: currentRow.memberStatus,
        isEdit
      }
      : {
        firstName: '',
        lastName: '',
        membershipId: '',
        entryYear: String(new Date().getFullYear()),
        dob: '',
        paymentStatus: '',
        memberStatus: '',
        isEdit
      }
  })

  const updateMemberMutation = useMutation({
    mutationFn: (values: MemberForm) => {
      if (!currentRow) {
        return Promise.reject(new Error('No member selected for update.'))
      }

      const entryYear = Number(values.entryYear)
      const payload: UpdateMemberRequest = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        dob: values.dob ? values.dob : undefined,
        entryYear: Number.isFinite(entryYear) ? entryYear : undefined,
        paymentStatus: values.paymentStatus as PaymentStatus,
        memberStatus: values.memberStatus as MemberStatus
      }

      return membersService.updateMember(currentRow._id, payload)
    },
    onSuccess: () => {
      toast.success('Member updated successfully.')
      form.reset()
      onOpenChange(false)
      router.invalidate()
    },
    onError: () => {
      toast.error('Failed to update member. Please try again.')
    }
  })

  const onSubmit = (values: MemberForm) => {
    if (isEdit) {
      updateMemberMutation.mutate(values)
      return
    }
    form.reset()
    showSubmittedData(values)
    onOpenChange(false)
  }

  const isPending = updateMemberMutation.isPending

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle>{isEdit ? 'Edit Member' : 'Add New Member'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the member here. ' : 'Create new member here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto py-1 pe-3">
          <Form {...form}>
            <form
              id="member-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 p-0.5"
            >
              <div className="grid grid-cols-6 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-6 gap-4">
                <FormField
                  control={form.control}
                  name="membershipId"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Membership ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="MEM-001"
                          {...field}
                          value={isEdit ? maskMembershipId(String(field.value ?? '')) : field.value}
                          disabled={isEdit}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="entryYear"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Entry Year</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="2024" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-6 gap-4">
                <FormField
                  control={form.control}
                  name="paymentStatus"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Payment Status</FormLabel>
                      <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select payment status"
                        items={paymentStatuses.map(({ label, value }) => ({ label, value }))}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="memberStatus"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Member Status</FormLabel>
                      <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select member status"
                        items={memberStatuses.map(({ label, value }) => ({ label, value }))}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type="submit" form="member-form" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
