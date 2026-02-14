'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { membersService } from '@/api/services'
import { type Dependent } from '../data/schema'

type DependentDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Dependent
}

export function DependentsDeleteDialog({
  open,
  onOpenChange,
  currentRow
}: DependentDeleteDialogProps) {
  const [value, setValue] = useState('')
  const router = useRouter()
  // Use the member ID from the current row (dependent's member reference)
  const memberId = currentRow.member
  const fullName = `${currentRow.firstName} ${currentRow.lastName}`

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await membersService.deleteDependent(memberId, currentRow._id)
    },
    onSuccess: () => {
      toast.success(`Dependent "${fullName}" has been deleted successfully.`)
      onOpenChange(false)
      setValue('')
      router.invalidate()
    },
    onError: () => {
      toast.error('Failed to delete dependent. Please try again.')
    }
  })

  const handleDelete = () => {
    if (value.trim() !== fullName) return
    deleteMutation.mutate()
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== fullName || deleteMutation.isPending}
      title={
        <span className="text-destructive">
          <AlertTriangle className="me-1 inline-block stroke-destructive" size={18} /> Delete
          Dependent
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete <span className="font-bold">{fullName}</span>?
            <br />
            This action will permanently remove this dependent from the system. This cannot be
            undone.
          </p>

          <Label className="my-2">
            Full Name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter dependent's full name to confirm deletion."
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
