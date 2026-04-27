'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { DataTableColumnHeader } from '@/components/data-table'
import { type Dependent } from '../data/schema'
import { useDependents } from './dependents-provider'
import { dependentRelationLabels } from '../data/dependent-relations'

export const columns: ColumnDef<Dependent>[] = [
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
  {
    accessorKey: 'firstName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="First Name" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue('firstName')}</div>
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Name" />,
    cell: ({ row }) => <div>{row.getValue('lastName')}</div>
  },
  {
    accessorKey: 'relationship',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Relationship" />,
    cell: ({ row }) => {
      const relationship = row.getValue('relationship') as string | undefined
      if (!relationship) return <div className="text-muted-foreground">-</div>
      return (
        <Badge variant="outline">
          {dependentRelationLabels[relationship] || relationship}
        </Badge>
      )
    }
  },
  {
    accessorKey: 'memberName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Member" />,
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue('memberName') || '-'}</div>
    )
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Added" />,
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string | undefined
      if (!date) return <div className="text-muted-foreground">-</div>
      return <div>{new Date(date).toLocaleDateString()}</div>
    }
  },
  {
    id: 'actions',
    cell: function CellComponent({ row }) {
      const { setOpen, setCurrentRow } = useDependents()
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(row.original)
                setOpen('edit')
              }}
            >
              <Pencil className="me-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(row.original)
                setOpen('delete')
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="me-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
