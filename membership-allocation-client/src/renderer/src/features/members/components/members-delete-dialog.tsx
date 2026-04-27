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
import { type Member } from '../data/schema'
import { useMembers } from './members-provider'

type MemberDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Member
}

export function MembersDeleteDialog({ open, onOpenChange, currentRow }: MemberDeleteDialogProps) {
  const [value, setValue] = useState('')
  const router = useRouter()
  const { requestSelectionReset } = useMembers()
  const fullName = `${currentRow.firstName} ${currentRow.lastName}`

  const deleteMutation = useMutation({
    mutationFn: async () => {
      // TODO: Replace with actual members API call, e.g.:
      // await membersService.deleteMember(currentRow._id)
      // Until the API is available, explicitly fail to avoid a false success.
      throw new Error('Member deletion is not implemented yet.')
    },
    onSuccess: () => {
      toast.success(`Member "${fullName}" has been deleted successfully.`)
      onOpenChange(false)
      setValue('')
      requestSelectionReset()
      router.invalidate()
    },
    onError: () => {
      toast.error('Failed to delete member. Please try again.')
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
          <AlertTriangle className="me-1 inline-block stroke-destructive" size={18} /> Delete Member
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete <span className="font-bold">{fullName}</span>?
            <br />
            This action will permanently remove the member with membership ID{' '}
            <span className="font-bold">{currentRow.membershipId}</span> from the system. This
            cannot be undone.
          </p>

          <Label className="my-2">
            Full Name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter member's full name to confirm deletion."
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
