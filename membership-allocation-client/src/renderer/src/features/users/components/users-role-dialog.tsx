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
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { SelectDropdown } from '@/components/select-dropdown'
import { usersService } from '@/api/services'
import { type UserRole } from '@/stores/auth-store'
import { roles } from '../data/data'
import { type User } from '../data/schema'

const formSchema = z.object({
  role: z.string().min(1, 'Role is required.')
})

type RoleForm = z.infer<typeof formSchema>

type UsersRoleDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

export function UsersRoleDialog({ open, onOpenChange, currentRow }: UsersRoleDialogProps) {
  const router = useRouter()
  const form = useForm<RoleForm>({
    resolver: zodResolver(formSchema),
    defaultValues: { role: currentRow.role }
  })

  const updateRoleMutation = useMutation({
    mutationFn: (role: string) =>
      usersService.changeUserRole({
        id: currentRow._id,
        role: role as UserRole
      }),
    onSuccess: () => {
      toast.success('User role updated successfully.')
      onOpenChange(false)
      router.invalidate()
    },
    onError: () => {
      toast.error('Failed to change user role. Please try again.')
    }
  })

  const onSubmit = (values: RoleForm) => {
    updateRoleMutation.mutate(values.role)
  }

  const selectedRole = form.watch('role')
  const isRoleChanged = selectedRole !== currentRow.role

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset({ role: currentRow.role })
        onOpenChange(state)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-start">
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>
            Update the role for <span className="font-medium">{currentRow.name}</span>.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="user-role-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Role</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select a role"
                    items={roles.map(({ label, value }) => ({ label, value }))}
                    isControlled
                  />
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
          <Button
            type="submit"
            form="user-role-form"
            disabled={!isRoleChanged || updateRoleMutation.isPending}
          >
            {updateRoleMutation.isPending ? 'Saving...' : 'Update Role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
