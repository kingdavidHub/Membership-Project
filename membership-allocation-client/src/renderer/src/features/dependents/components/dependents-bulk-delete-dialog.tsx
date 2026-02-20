'use client'

import { AlertTriangle } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { membersService } from '@/api/services'
import { type Dependent } from '../data/schema'
import { useDependents } from './dependents-provider'

type DependentsBulkDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedRows: Dependent[]
}

export function DependentsBulkDeleteDialog({
  open,
  onOpenChange,
  selectedRows
}: DependentsBulkDeleteDialogProps) {
  const router = useRouter()
  const { memberId, setSelectedRows } = useDependents()
  const count = selectedRows.length

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const ids = selectedRows.map((row) => row._id)
      await membersService.deleteDependents(memberId, ids)
    },
    onSuccess: () => {
      toast.success(`${count} dependent${count > 1 ? 's' : ''} deleted successfully.`)
      onOpenChange(false)
      setSelectedRows([])
      router.invalidate()
    },
    onError: () => {
      toast.error('Failed to delete dependents. Please try again.')
    }
  })

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={() => deleteMutation.mutate()}
      disabled={deleteMutation.isPending}
      title={
        <span className="text-destructive">
          <AlertTriangle className="me-1 inline-block stroke-destructive" size={18} /> Delete{' '}
          {count} Dependent{count > 1 ? 's' : ''}
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete{' '}
            <span className="font-bold">
              {count} dependent{count > 1 ? 's' : ''}
            </span>
            ?
            <br />
            This action will permanently remove {count > 1
              ? 'these dependents'
              : 'this dependent'}{' '}
            from the system. This cannot be undone.
          </p>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={deleteMutation.isPending ? 'Deleting...' : `Delete (${count})`}
      destructive
    />
  )
}
