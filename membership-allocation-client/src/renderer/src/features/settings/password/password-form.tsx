import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { authService } from '@/api/services/auth.service'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { PasswordInput } from '@/components/password-input'

const passwordFormSchema = z.object({
  oldPassword: z.string().min(1, 'Please enter your current password.'),
  newPassword: z
    .string()
    .min(1, 'Please enter a new password.')
    .min(8, 'New password must be at least 8 characters.')
})

type PasswordFormValues = z.infer<typeof passwordFormSchema>

export function PasswordForm() {
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: ''
    }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: authService.updatePassword,
    onSuccess: () => {
      toast.success('Password updated successfully.')
      form.reset()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update password.')
    }
  })

  function onSubmit(data: PasswordFormValues) {
    mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Enter current password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Enter new password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Updating...' : 'Update password'}
        </Button>
      </form>
    </Form>
  )
}
