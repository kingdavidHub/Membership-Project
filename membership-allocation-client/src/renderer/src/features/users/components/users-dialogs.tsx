import { UsersActionDialog } from './users-action-dialog'
import { UsersCreateMemberDialog } from './users-create-member-dialog'
import { UsersDeleteDialog } from './users-delete-dialog'
import { UsersInviteDialog } from './users-invite-dialog'
import { UsersRoleDialog } from './users-role-dialog'
import { useUsers } from './users-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow, selectedRows } = useUsers()
  const selectedUser = selectedRows.length === 1 ? selectedRows[0] : null
  const canCreateMember =
    selectedUser?.role === 'member' && (selectedUser.member == null || selectedUser.member === '')
  return (
    <>
      <UsersActionDialog key="user-add" open={open === 'add'} onOpenChange={() => setOpen('add')} />

      <UsersInviteDialog
        key="user-invite"
        open={open === 'invite'}
        onOpenChange={() => setOpen('invite')}
      />

      {currentRow && (
        <>
          <UsersRoleDialog
            key={`user-change-role-${currentRow._id}`}
            open={open === 'change-role'}
            onOpenChange={() => {
              setOpen('change-role')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <UsersDeleteDialog
            key={`user-delete-${currentRow._id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}

      {selectedUser && canCreateMember && (
        <UsersCreateMemberDialog
          key={`user-create-member-${selectedUser._id}`}
          open={open === 'create-member'}
          onOpenChange={() => setOpen('create-member')}
          user={selectedUser}
        />
      )}
    </>
  )
}
