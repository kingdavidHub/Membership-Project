'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { usersService } from '@/api/services'
import { type UserRole } from '@/stores/auth-store'
import { UserPlus } from 'lucide-react'
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
import { PasswordInput } from '@/components/password-input'
import { SelectDropdown } from '@/components/select-dropdown'
import { roles } from '../data/data'
import { type User } from '../data/schema'

const formSchema = z.object({
  firstName: z.string().min(1, 'First Name is required.'),
  lastName: z.string().min(1, 'Last Name is required.'),
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Email is required.' : undefined)
  }),
  username: z.string().optional(),
  phoneNumber: z.string().optional(),
  password: z.string().optional(),
  role: z.string().optional(),
  confirmPassword: z.string().optional(),
  isEdit: z.boolean()
})
type UserForm = z.infer<typeof formSchema>

type UserActionDialogProps = {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({ currentRow, open, onOpenChange }: UserActionDialogProps) {
  const isEdit = !!currentRow
  const isCreate = !isEdit
  const router = useRouter()

  const createUserMutation = useMutation({
    mutationFn: (values: Pick<UserForm, 'firstName' | 'lastName' | 'email'>) =>
      usersService.createUser({
        name: `${values.firstName} ${values.lastName}`.replace(/\s+/g, ' ').trim(),
        email: values.email
      }),
    onSuccess: () => {
      toast.success('User created successfully.')
      form.reset()
      onOpenChange(false)
      router.invalidate()
    },
    onError: () => {
      toast.error('Failed to create user. Please try again.')
    }
  })

  const changeRoleMutation = useMutation({
    mutationFn: (role: string) => {
      if (!currentRow) {
        return Promise.reject(new Error('No user selected for role change.'))
      }

      return usersService.changeUserRole({
        id: currentRow._id,
        role: role as UserRole
      })
    },
    onSuccess: () => {
      toast.success('User role updated successfully.')
      router.invalidate()
    },
    onError: () => {
      toast.error('Failed to change user role. Please try again.')
    }
  })

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
        ...currentRow,
        password: '',
        confirmPassword: '',
        isEdit
      }
      : {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        role: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        isEdit
      }
  })

  const onSubmit = (values: UserForm) => {
    if (isCreate) {
      createUserMutation.mutate({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email
      })
      return
    }

    form.reset()
    showSubmittedData(values)
    onOpenChange(false)
  }

  const isPasswordTouched = !!form.formState.dirtyFields.password

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
          <DialogTitle>{isCreate ? 'Create New User' : 'Edit User'}</DialogTitle>
          <DialogDescription>
            {isCreate ? 'Create new user here. ' : 'Update the user here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="w-[calc(100%+0.75rem)] max-h-[calc(100vh-10rem)] overflow-y-auto py-1 pe-3">
          <Form {...form}>
            <form
              id="user-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 px-0.5"
            >
              {isCreate ? (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john.doe@gmail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" autoComplete="off" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" autoComplete="off" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <SelectDropdown
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder="Role is managed later"
                            className="w-full"
                            disabled
                            items={roles.map(({ label, value }) => ({
                              label,
                              value
                            }))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                        <FormLabel className="col-span-2 text-end">First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
                            className="col-span-4"
                            autoComplete="off"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="col-span-4 col-start-3" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                        <FormLabel className="col-span-2 text-end">Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            className="col-span-4"
                            autoComplete="off"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="col-span-4 col-start-3" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                        <FormLabel className="col-span-2 text-end">Username</FormLabel>
                        <FormControl>
                          <Input placeholder="john_doe" className="col-span-4" {...field} />
                        </FormControl>
                        <FormMessage className="col-span-4 col-start-3" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john.doe@gmail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                        <FormLabel className="col-span-2 text-end">Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+123456789" className="col-span-4" {...field} />
                        </FormControl>
                        <FormMessage className="col-span-4 col-start-3" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => {
                      const isRoleChanged = isEdit && field.value !== currentRow!.role
                      return (
                        <FormItem className="space-y-2">
                          <FormLabel>Role</FormLabel>
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <SelectDropdown
                                defaultValue={field.value ?? ''}
                                onValueChange={field.onChange}
                                placeholder="Select a role"
                                className="w-full"
                                items={roles.map(({ label, value }) => ({
                                  label,
                                  value
                                }))}
                              />
                            </FormControl>
                          </div>
                          {isEdit && (
                            <div className="flex justify-end">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={!isRoleChanged || changeRoleMutation.isPending}
                                onClick={() => changeRoleMutation.mutate(field.value ?? '')}
                              >
                                {changeRoleMutation.isPending ? 'Saving...' : 'Update'}
                              </Button>
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                        <FormLabel className="col-span-2 text-end">Password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="e.g., S3cur3P@ssw0rd"
                            className="col-span-4"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="col-span-4 col-start-3" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                        <FormLabel className="col-span-2 text-end">Confirm Password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            disabled={!isPasswordTouched}
                            placeholder="e.g., S3cur3P@ssw0rd"
                            className="col-span-4"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="col-span-4 col-start-3" />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </form>
          </Form>
        </div>
        <DialogFooter>
          {isCreate ? (
            <Button type="submit" form="user-form" disabled={createUserMutation.isPending}>
              {createUserMutation.isPending ? 'Creating...' : 'Create User'}
              <UserPlus className="me-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" form="user-form">
              Save changes
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
