import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type User } from '../data/schema'

type UsersDialogType = 'invite' | 'add' | 'change-role' | 'create-member' | 'delete'

type UsersContextType = {
  open: UsersDialogType | null
  setOpen: (str: UsersDialogType | null) => void
  currentRow: User | null
  setCurrentRow: React.Dispatch<React.SetStateAction<User | null>>
  selectedRows: User[]
  setSelectedRows: React.Dispatch<React.SetStateAction<User[]>>
  selectionResetKey: number
  requestSelectionReset: () => void
}

const UsersContext = React.createContext<UsersContextType | null>(null)

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<UsersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<User | null>(null)
  const [selectedRows, setSelectedRows] = useState<User[]>([])
  const [selectionResetKey, setSelectionResetKey] = useState(0)
  const requestSelectionReset = () => setSelectionResetKey((prev) => prev + 1)

  return (
    <UsersContext
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
    </UsersContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUsers = () => {
  const usersContext = React.useContext(UsersContext)

  if (!usersContext) {
    throw new Error('useUsers has to be used within <UsersContext>')
  }

  return usersContext
}
