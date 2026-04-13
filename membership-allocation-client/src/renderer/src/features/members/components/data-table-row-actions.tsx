'use client'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { useNavigate } from '@tanstack/react-router'
import { ReceiptText, Trash2, UserPen, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useMembers } from './members-provider'
import { type Member } from '../data/schema'
import { useDependentsNavigationStore } from '@/stores/dependents-navigation-store'
import { usePaymentsNavigationStore } from '@/stores/payments-navigation-store'

type DataTableRowActionsProps = {
  row: Row<Member>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useMembers()
  const navigate = useNavigate()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original)
            setOpen('edit')
          }}
        >
          Edit
          <DropdownMenuShortcut>
            <UserPen size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            usePaymentsNavigationStore.getState().setData({
              memberId: row.original._id,
              memberName: `${row.original.firstName} ${row.original.lastName}`
            })
            navigate({
              to: '/members/$memberId/payments',
              params: { memberId: row.original._id }
            })
          }}
        >
          Payment summary
          <DropdownMenuShortcut>
            <ReceiptText size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            useDependentsNavigationStore.getState().setData({
              memberId: row.original._id,
              memberName: `${row.original.firstName} ${row.original.lastName}`,
              dependents: row.original.dependents || []
            })
            navigate({
              to: '/members/$memberId/dependents',
              params: { memberId: row.original._id }
            })
          }}
        >
          View Dependents
          <DropdownMenuShortcut>
            <Users size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original)
            setOpen('delete')
          }}
          className="text-red-500!"
        >
          Delete
          <DropdownMenuShortcut>
            <Trash2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
