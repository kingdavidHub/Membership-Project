'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { usersService } from '@/api/services/users.service'
import { type CreateMemberForUserRequest } from '@/api/types/user.types'
import { type User } from '../data/schema'

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  dob: z.string().min(1, 'Date of birth is required.'),
  membershipId: z.string().min(1, 'Membership ID is required.'),
  entryYear: z.string().min(1, 'Entry year is required.')
})

type CreateMemberForm = z.infer<typeof formSchema>

type UsersCreateMemberDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
}

export function UsersCreateMemberDialog({
  open,
  onOpenChange,
  user
}: UsersCreateMemberDialogProps) {
  const router = useRouter()
  const splitName = (fullName: string) => {
    const trimmed = fullName.trim()
    if (!trimmed) return { firstName: '', lastName: '' }
    const parts = trimmed.split(/\s+/)
    const firstName = parts.shift() ?? ''
    return { firstName, lastName: parts.join(' ') }
  }

  const nameParts = splitName(user.name)
  const form = useForm<CreateMemberForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: nameParts.firstName,
      lastName: nameParts.lastName,
      dob: '',
      membershipId: '',
      entryYear: String(new Date().getFullYear())
    }
  })

  const createMemberMutation = useMutation({
    mutationFn: (values: CreateMemberForm) => {
      const entryYear = Number(values.entryYear)
      const payload: CreateMemberForUserRequest = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        dob: values.dob,
        membershipId: values.membershipId.trim(),
        entryYear: Number.isFinite(entryYear) ? entryYear : new Date().getFullYear()
      }

      return usersService.createMemberForUser(user._id, payload)
    },
    onSuccess: () => {
      toast.success('Member created successfully.')
      form.reset()
      onOpenChange(false)
      router.invalidate()
    },
    onError: () => {
      toast.error('Failed to create member. Please try again.')
    }
  })

  const onSubmit = (values: CreateMemberForm) => {
    createMemberMutation.mutate(values)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset({
          firstName: nameParts.firstName,
          lastName: nameParts.lastName,
          dob: '',
          membershipId: '',
          entryYear: String(new Date().getFullYear())
        })
        onOpenChange(state)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle>Create Member</DialogTitle>
          <DialogDescription>
            Create a member profile for <span className="font-medium">{user.name}</span>.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="create-member-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
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
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
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
          </form>
        </Form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="create-member-form" disabled={createMemberMutation.isPending}>
            {createMemberMutation.isPending ? 'Creating...' : 'Create Member'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
