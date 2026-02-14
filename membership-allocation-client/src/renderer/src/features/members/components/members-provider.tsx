import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Member } from '../data/schema'

type MembersDialogType = 'invite' | 'add' | 'edit' | 'delete'

type MembersContextType = {
  open: MembersDialogType | null
  setOpen: (str: MembersDialogType | null) => void
  currentRow: Member | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Member | null>>
}

const MembersContext = React.createContext<MembersContextType | null>(null)

export function MembersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<MembersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Member | null>(null)

  return (
    <MembersContext value={{ open, setOpen, currentRow, setCurrentRow }}>{children}</MembersContext>
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
