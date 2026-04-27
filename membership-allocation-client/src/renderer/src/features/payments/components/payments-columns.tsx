'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { type Payment } from '../data/schema'

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'amount',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => {
      const amount = Number(row.getValue('amount'))

      if (Number.isNaN(amount)) {
        return <div className="text-muted-foreground">-</div>
      }

      return <div>{amount.toLocaleString()}</div>
    },
    enableHiding: false
  },
  {
    accessorKey: 'duration',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Duration" />,
    cell: ({ row }) => <div>{row.getValue('duration')}</div>,
    enableHiding: false
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string | undefined

      if (!date) {
        return <div className="text-muted-foreground">-</div>
      }

      return <div>{new Date(date).toLocaleString()}</div>
    },
    enableHiding: false
  }
]
