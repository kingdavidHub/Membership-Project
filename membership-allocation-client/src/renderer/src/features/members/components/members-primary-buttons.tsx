import { MailPlus, MessageSquare, UserCog } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useUserProfile } from '@/hooks/use-user-profile'
import { UserRole } from '@/stores/auth-store'
import { useMembers } from './members-provider'

export function MembersPrimaryButtons() {
  const { setOpen, selectedRows } = useMembers()
  const { userProfile } = useUserProfile()
  const isAdminOrSuperAdmin =
    userProfile?.role === UserRole.ADMIN || userProfile?.role === UserRole.SUPER_ADMIN

  return (
    <div className="flex flex-col gap-2">
      {isAdminOrSuperAdmin && (
        <>
          {selectedRows.length > 0 ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="space-x-1"
                onClick={() => setOpen('update-status')}
              >
                <span>Update Member Status</span> <UserCog size={18} />
              </Button>
              <Button
                variant="outline"
                className="space-x-1"
                onClick={() => setOpen('update-payment-status')}
              >
                <span>Update Payment Status</span> <UserCog size={18} />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="space-x-1"
                onClick={() => {
                  if (selectedRows.length === 0) {
                    toast.info('Please select members from the table first.')
                    return
                  }
                  setOpen('send-message')
                }}
              >
                <span>Send Message</span> <MessageSquare size={18} />
              </Button>

              <Button variant="outline" className="space-x-1" onClick={() => setOpen('invite')}>
                <span>Invite Member</span> <MailPlus size={18} />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
