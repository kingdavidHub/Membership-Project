import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Dependent } from '../data/schema'

type DependentsDialogType = 'edit' | 'delete'

type DependentsContextType = {
  open: DependentsDialogType | null
  setOpen: (str: DependentsDialogType | null) => void
  currentRow: Dependent | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Dependent | null>>
}

const DependentsContext = React.createContext<DependentsContextType | null>(null)

type DependentsProviderProps = {
  children: React.ReactNode
}

export function DependentsProvider({ children }: DependentsProviderProps) {
  const [open, setOpen] = useDialogState<DependentsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Dependent | null>(null)

  return (
    <DependentsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
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
