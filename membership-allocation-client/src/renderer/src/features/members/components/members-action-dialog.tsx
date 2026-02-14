'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { paymentStatuses, memberStatuses } from '../data/data'
import { type Member } from '../data/schema'

const formSchema = z.object({
  firstName: z.string().min(1, 'First Name is required.'),
  lastName: z.string().min(1, 'Last Name is required.'),
  email: z.string().optional(),
  phoneNumber: z.string().optional(),
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
  const form = useForm<MemberForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          firstName: currentRow.firstName,
          lastName: currentRow.lastName,
          email: currentRow.email || '',
          phoneNumber: currentRow.phoneNumber || '',
          membershipId: currentRow.membershipId,
          entryYear: String(currentRow.entryYear),
          dob: currentRow.dob || '',
          paymentStatus: currentRow.paymentStatus,
          memberStatus: currentRow.memberStatus,
          isEdit
        }
      : {
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          membershipId: '',
          entryYear: String(new Date().getFullYear()),
          dob: '',
          paymentStatus: '',
          memberStatus: '',
          isEdit
        }
  })

  const onSubmit = (values: MemberForm) => {
    form.reset()
    showSubmittedData(values)
    onOpenChange(false)
  }

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

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Optional)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="+1-234-567-8900" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-6 gap-4">
                <FormField
                  control={form.control}
                  name="membershipId"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Membership ID</FormLabel>
                      <FormControl>
                        <Input placeholder="MEM-001" {...field} />
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
          <Button type="submit" form="member-form">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
