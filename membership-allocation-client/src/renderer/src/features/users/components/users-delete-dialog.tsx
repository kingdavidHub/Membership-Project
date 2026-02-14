'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { usersService } from '@/api/services/users.service'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type User } from '../data/schema'

type UserDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

export function UsersDeleteDialog({ open, onOpenChange, currentRow }: UserDeleteDialogProps) {
  const [value, setValue] = useState('')
  const router = useRouter()

  const deleteMutation = useMutation({
    mutationFn: () => usersService.deleteUser(currentRow._id),
    onSuccess: () => {
      toast.success(`User "${currentRow.name}" has been deleted successfully.`)
      onOpenChange(false)
      setValue('')
      // Invalidate and refetch users list
      router.invalidate()
    },
    onError: () => {
      toast.error('Failed to delete user. Please try again.')
    }
  })

  const handleDelete = () => {
    if (value.trim() !== currentRow.name) return
    deleteMutation.mutate()
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.name || deleteMutation.isPending}
      title={
        <span className="text-destructive">
          <AlertTriangle className="me-1 inline-block stroke-destructive" size={18} /> Delete User
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete <span className="font-bold">{currentRow.name}</span>
            ?
            <br />
            This action will permanently remove the user with the role of{' '}
            <span className="font-bold">{currentRow.role.toUpperCase()}</span> from the system. This
            cannot be undone.
          </p>

          <Label className="my-2">
            Name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter user name to confirm deletion."
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={deleteMutation.isPending ? 'Deleting...' : 'Delete'}
      destructive
    />
  )
}
