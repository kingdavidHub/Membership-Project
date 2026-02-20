import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Dependent } from '../data/schema'

type DependentsDialogType = 'add' | 'edit' | 'delete' | 'bulk-delete'

type DependentsContextType = {
  open: DependentsDialogType | null
  setOpen: (str: DependentsDialogType | null) => void
  currentRow: Dependent | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Dependent | null>>
  memberId: string
  selectedRows: Dependent[]
  setSelectedRows: React.Dispatch<React.SetStateAction<Dependent[]>>
}

const DependentsContext = React.createContext<DependentsContextType | null>(null)

type DependentsProviderProps = {
  children: React.ReactNode
  memberId: string
}

export function DependentsProvider({ children, memberId }: DependentsProviderProps) {
  const [open, setOpen] = useDialogState<DependentsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Dependent | null>(null)
  const [selectedRows, setSelectedRows] = useState<Dependent[]>([])

  return (
    <DependentsContext
      value={{ open, setOpen, currentRow, setCurrentRow, memberId, selectedRows, setSelectedRows }}
    >
      {children}
    </DependentsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDependents = () => {
  const dependentsContext = React.useContext(DependentsContext)

  if (!dependentsContext) {
    throw new Error('useDependents has to be used within <DependentsContext>')
  }

  return dependentsContext
}
