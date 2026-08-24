'use client'

import { type Table } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { type Dependent } from '../data/schema'

const columnConfig = [
  { columnId: 'firstName', label: 'First Name' },
  { columnId: 'lastName', label: 'Last Name' },
  { columnId: 'relationship', label: 'Relationship' },
  { columnId: 'memberName', label: 'Member' },
  { columnId: 'createdAt', label: 'Added' }
] as const

type DependentsViewDialogProps = {
  table: Table<Dependent>
}

export function DependentsViewDialog({ table }: DependentsViewDialogProps) {
  const hiddenCount = columnConfig.filter((col) => {
    const column = table.getColumn(col.columnId)
    return column && !column.getIsVisible()
  }).length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5">
          <Eye className="h-3.5 w-3.5" />
          <span>View</span>
          {hiddenCount > 0 && (
            <span className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {hiddenCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="end">
        <div className="space-y-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              columnConfig.forEach((col) => {
                const column = table.getColumn(col.columnId)
                if (column && !column.getIsVisible()) {
                  column.toggleVisibility(true)
                }
              })
            }}
          >
            Show All
          </Button>

          <Separator />

          <div className="space-y-1.5">
            <p className="px-1 text-xs font-medium text-muted-foreground">Columns</p>
            <div className="flex flex-wrap gap-1.5">
              {columnConfig.map((col) => {
                const column = table.getColumn(col.columnId)
                if (!column) return null
                const isVisible = column.getIsVisible()
                return (
                  <Button
                    key={col.columnId}
                    variant={isVisible ? 'default' : 'outline'}
                    size="sm"
                    className={cn('h-7 text-xs')}
                    onClick={() => column.toggleVisibility(!isVisible)}
                  >
                    {col.label}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
