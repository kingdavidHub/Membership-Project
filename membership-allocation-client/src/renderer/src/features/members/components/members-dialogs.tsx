import { MembersActionDialog } from './members-action-dialog'
import { MembersDeleteDialog } from './members-delete-dialog'
import { MembersInviteDialog } from './members-invite-dialog'
import { SendMessageDialog } from './send-message-dialog'
import { useMembers } from './members-provider'

export function MembersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow, selectedRows } = useMembers()
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

      {/* Send Message dialog */}
      {selectedRows.length > 0 && (
        <SendMessageDialog
          key="member-send-message"
          open={open === 'send-message'}
          onOpenChange={() => setOpen('send-message')}
          selectedMembers={selectedRows}
        />
      )}

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
