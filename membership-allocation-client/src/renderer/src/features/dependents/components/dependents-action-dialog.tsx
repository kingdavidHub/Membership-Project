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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { membersService } from '@/api/services'
import { type Dependent } from '../data/schema'
import { useDependents } from './dependents-provider'

const formSchema = z.object({
  firstName: z.string().min(1, 'First Name is required.'),
  lastName: z.string().min(1, 'Last Name is required.')
})

type DependentForm = z.infer<typeof formSchema>

type DependentActionDialogProps = {
  currentRow?: Dependent
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DependentsActionDialog({
  currentRow,
  open,
  onOpenChange
}: DependentActionDialogProps) {
  const isEdit = !!currentRow
  const router = useRouter()
  const { memberId } = useDependents()

  const form = useForm<DependentForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          firstName: currentRow.firstName,
          lastName: currentRow.lastName
        }
      : {
          firstName: '',
          lastName: ''
        }
  })

  const createMutation = useMutation({
    mutationFn: (data: DependentForm) => membersService.createDependent(memberId, data),
    onSuccess: () => {
      toast.success('Dependent created successfully.')
      form.reset()
      onOpenChange(false)
      router.invalidate()
    },
    onError: () => {
      toast.error('Failed to create dependent. Please try again.')
    }
  })

  const updateMutation = useMutation({
    mutationFn: (data: DependentForm) =>
      membersService.updateDependent(memberId, currentRow!._id, data),
    onSuccess: () => {
      toast.success('Dependent updated successfully.')
      form.reset()
      onOpenChange(false)
      router.invalidate()
    },
    onError: () => {
      toast.error('Failed to update dependent. Please try again.')
    }
  })

  const onSubmit = (values: DependentForm) => {
    if (isEdit) {
      updateMutation.mutate(values)
    } else {
      createMutation.mutate(values)
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

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
          <DialogTitle>{isEdit ? 'Edit Dependent' : 'Add New Dependent'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the dependent here. ' : 'Create new dependent here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="dependent-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
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
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="dependent-form" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
