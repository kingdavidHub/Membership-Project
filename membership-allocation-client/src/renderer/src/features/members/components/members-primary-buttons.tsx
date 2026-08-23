import { MessageSquare, UserCog } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useUserProfile } from '@/hooks/use-user-profile'
import { UserRole } from '@/stores/auth-store'
import { useMembers } from './members-provider'

export function MembersPrimaryButtons() {
  const { setOpen, selectedRows, setCurrentRow } = useMembers()
  const { userProfile } = useUserProfile()
  const isAdminOrSuperAdmin =
    userProfile?.role === UserRole.ADMIN || userProfile?.role === UserRole.SUPER_ADMIN

  const openWithSelection = (
    dialog: 'update-status' | 'update-payment-status' | 'send-message'
  ) => {
    if (selectedRows.length === 0) {
      toast.info('Please select members from the table first.')
      return
    }
    setOpen(dialog)
  }

  const handleDelete = () => {
    if (selectedRows.length === 0) {
      toast.info('Please select members from the table first.')
      return
    }

    if (selectedRows.length === 1) {
      setCurrentRow(selectedRows[0])
      setOpen('delete')
      return
    }

    toast.info('Bulk delete is not available yet.')
  }

  return (
    <div className="flex flex-col gap-2">
      {isAdminOrSuperAdmin && (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="space-x-1"
              onClick={() => openWithSelection('update-status')}
            >
              <span>Update Member Status</span> <UserCog size={18} />
            </Button>
            <Button
              variant="outline"
              className="space-x-1"
              disabled
              title="Payment status is now updated automatically by the backend"
              onClick={() => openWithSelection('update-payment-status')}
            >
              <span>Update Payment Status</span> <UserCog size={18} />
            </Button>
          </div>
          {selectedRows.length > 0 && (
            <div className="flex flex-wrap items-center justify-end gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedRows.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openWithSelection('send-message')}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Message
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                Delete {selectedRows.length > 1 ? `(${selectedRows.length})` : ''}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
