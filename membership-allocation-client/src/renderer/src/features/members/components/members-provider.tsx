import useDialogState from '@/hooks/use-dialog-state'
import React, { useState } from 'react'
import { type Member } from '../data/schema'

type MembersDialogType =
  | 'invite'
  | 'add'
  | 'edit'
  | 'delete'
  | 'send-message'
  | 'update-status'
  | 'update-payment-status'

type MembersContextType = {
  open: MembersDialogType | null
  setOpen: (str: MembersDialogType | null) => void
  currentRow: Member | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Member | null>>
  selectedRows: Member[]
  setSelectedRows: React.Dispatch<React.SetStateAction<Member[]>>
  selectionResetKey: number
  requestSelectionReset: () => void
}

const MembersContext = React.createContext<MembersContextType | null>(null)

export function MembersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<MembersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Member | null>(null)
  const [selectedRows, setSelectedRows] = useState<Member[]>([])
  const [selectionResetKey, setSelectionResetKey] = useState(0)
  const requestSelectionReset = () => setSelectionResetKey((prev) => prev + 1)

  return (
    <MembersContext
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        selectedRows,
        setSelectedRows,
        selectionResetKey,
        requestSelectionReset
      }}
    >
      {children}
    </MembersContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMembers = () => {
  const membersContext = React.useContext(MembersContext)

  if (!membersContext) {
    throw new Error('useMembers has to be used within <MembersContext>')
  }

  return membersContext
}
