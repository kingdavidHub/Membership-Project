'use client'

import { type Table } from '@tanstack/react-table'
import { MessageSquare, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUserProfile } from '@/hooks/use-user-profile'
import { UserRole } from '@/stores/auth-store'
import { useMembers } from './members-provider'
import { type Member } from '../data/schema'

type DataTableBulkActionsProps = {
  table: Table<Member>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
  const { setOpen, setCurrentRow, setSelectedRows } = useMembers()
  const { userProfile } = useUserProfile()
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const isAdminOrSuperAdmin =
    userProfile?.role === UserRole.ADMIN || userProfile?.role === UserRole.SUPER_ADMIN

  if (selectedRows.length === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{selectedRows.length} selected</span>
      {isAdminOrSuperAdmin && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedRows(selectedRows.map((r) => r.original))
            setOpen('send-message')
          }}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Send Message
        </Button>
      )}
      <Button
        variant="destructive"
        size="sm"
        onClick={() => {
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
