'use client'

import { type Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMembers } from './members-provider'
import { type Member } from '../data/schema'

type DataTableBulkActionsProps = {
  table: Table<Member>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
  const { setOpen, setCurrentRow } = useMembers()
  const selectedRows = table.getFilteredSelectedRowModel().rows

  if (selectedRows.length === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{selectedRows.length} selected</span>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => {
          // For bulk delete, we can pass the first selected row
          // or handle bulk deletion separately
          if (selectedRows.length === 1) {
            setCurrentRow(selectedRows[0].original)
            setOpen('delete')
          } else {
            // TODO: Implement bulk delete functionality
            console.log(
              'Bulk delete:',
              selectedRows.map((r) => r.original._id)
            )
          }
        }}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete {selectedRows.length > 1 ? `(${selectedRows.length})` : ''}
      </Button>
    </div>
  )
}
