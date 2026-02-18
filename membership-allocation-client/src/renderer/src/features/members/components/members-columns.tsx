'use client'

import { Link } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'
import { Users } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { LongText } from '@/components/long-text'
import { DataTableColumnHeader } from '@/components/data-table'
import { DataTableRowActions } from './data-table-row-actions'
import { paymentStatuses, memberStatuses } from '../data/data'
import { type Member } from '../data/schema'
import { useDependentsNavigationStore } from '@/stores/dependents-navigation-store'

export const columns: ColumnDef<Member>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  // {
  //   accessorKey: 'membershipId',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title="Member ID" />,
  //   cell: ({ row }) => <div className="w-20">{row.getValue('membershipId')}</div>,
  //   enableSorting: false,
  //   enableHiding: false
  // },
  {
    id: 'name',
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <LongText className="max-w-36">{row.getValue('name')}</LongText>,
    enableHiding: false
  },
  // {
  //   accessorKey: 'email',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  //   cell: ({ row }) => <div className="w-45">{row.getValue('email') || '-'}</div>
  // },
  // {
  //   accessorKey: 'phoneNumber',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title="Phone Number" />,
  //   cell: ({ row }) => <div>{row.getValue('phoneNumber') || '-'}</div>
  // },
  {
    accessorKey: 'entryYear',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Entry Year" />,
    cell: ({ row }) => <div>{row.getValue('entryYear')}</div>
  },
  {
    accessorKey: 'paymentStatus',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Payment Status" />,
    cell: ({ row }) => {
      const status = paymentStatuses.find(
        (status) => status.value === row.getValue('paymentStatus')
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex w-25 items-center">
          {status.icon && <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    }
  },
  {
    accessorKey: 'memberStatus',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = memberStatuses.find((status) => status.value === row.getValue('memberStatus'))

      if (!status) {
        return null
      }

      return (
        <div className="flex w-25 items-center">
          {status.icon && <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    }
  },
  {
    id: 'dependents',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Dependents" />,
    cell: ({ row }) => {
      const dependentsCount = row.original.dependents?.length || 0

      return (
        <Link
          to="/members/$memberId/dependents"
          params={{ memberId: row.original._id }}
          onClick={() => {
            useDependentsNavigationStore.getState().setData({
              memberId: row.original._id,
              memberName: `${row.original.firstName} ${row.original.lastName}`,
              dependents: row.original.dependents || []
            })
          }}
        >
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{dependentsCount}</span>
          </Button>
        </Link>
      )
    },
    enableSorting: false
  },
  {
    id: 'actions',
    cell: DataTableRowActions
  }
]
