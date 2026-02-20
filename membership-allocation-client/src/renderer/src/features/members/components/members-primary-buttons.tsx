import { MailPlus, MessageSquare, UserPlus } from 'lucide-react'
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
    <div className="flex gap-2">
      {isAdminOrSuperAdmin && (
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
      )}
      <Button variant="outline" className="space-x-1" onClick={() => setOpen('invite')}>
        <span>Invite Member</span> <MailPlus size={18} />
      </Button>
      <Button className="space-x-1" onClick={() => setOpen('add')}>
        <span>Add Member</span> <UserPlus size={18} />
      </Button>
    </div>
  )
}
