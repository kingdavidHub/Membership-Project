import { MembersActionDialog } from './members-action-dialog'
import { MembersDeleteDialog } from './members-delete-dialog'
import { MembersInviteDialog } from './members-invite-dialog'
import { useMembers } from './members-provider'

export function MembersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useMembers()
  return (
    <>
      <MembersActionDialog
        key="member-add"
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      <MembersInviteDialog
        key="member-invite"
        open={open === 'invite'}
        onOpenChange={() => setOpen('invite')}
      />

      {currentRow && (
        <>
          <MembersActionDialog
            key={`member-edit-${currentRow._id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <MembersDeleteDialog
            key={`member-delete-${currentRow._id}`}
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
    </>
  )
}
