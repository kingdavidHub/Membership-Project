import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUsers } from './users-provider'

export function UsersPrimaryButtons() {
  const { setOpen, selectedRows } = useUsers()
  const selectedUser = selectedRows.length === 1 ? selectedRows[0] : null
  const canCreateMember =
    selectedUser?.role === 'member' && (selectedUser.member == null || selectedUser.member === '')
  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen('add')}>
        <span>Create User</span> <UserPlus size={18} />
      </Button>
      <Button
        variant="outline"
        className="space-x-1"
        onClick={() => setOpen('create-member')}
        disabled={!canCreateMember}
      >
        <span>Create Member</span> <UserPlus size={18} />
      </Button>
    </div>
  )
}
