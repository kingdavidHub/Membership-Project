import { MailPlus, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMembers } from './members-provider'

export function MembersPrimaryButtons() {
  const { setOpen } = useMembers()
  return (
    <div className="flex gap-2">
      <Button variant="outline" className="space-x-1" onClick={() => setOpen('invite')}>
        <span>Invite Member</span> <MailPlus size={18} />
      </Button>
      <Button className="space-x-1" onClick={() => setOpen('add')}>
        <span>Add Member</span> <UserPlus size={18} />
      </Button>
    </div>
  )
}
