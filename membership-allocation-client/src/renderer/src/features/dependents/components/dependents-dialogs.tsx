import { DependentsActionDialog } from './dependents-action-dialog'
import { DependentsDeleteDialog } from './dependents-delete-dialog'
import { useDependents } from './dependents-provider'

export function DependentsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useDependents()

  return (
    <>
      {/* Add dialog (no currentRow needed) */}
      <DependentsActionDialog
        key="dependent-add"
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <DependentsActionDialog
            key={`dependent-edit-${currentRow._id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <DependentsDeleteDialog
            key={`dependent-delete-${currentRow._id}`}
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
