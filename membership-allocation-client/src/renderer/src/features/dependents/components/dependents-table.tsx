'use client'

import * as React from 'react'
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { getRouteApi } from '@tanstack/react-router'
import { Trash2 } from 'lucide-react'
import { useTableUrlState } from '@/hooks/use-table-url-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { type Dependent } from '../data/schema'
import { useDependents } from './dependents-provider'

const route = getRouteApi('/_authenticated/members/$memberId/dependents')

type DependentsTableProps = {
  columns: ColumnDef<Dependent>[]
  data: Dependent[]
}

export function DependentsTable({ columns, data }: DependentsTableProps) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [sorting, setSorting] = React.useState<SortingState>([])
  const { setOpen, setSelectedRows } = useDependents()

  const {
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
    displayPageSize,
    setDisplayPageSize
  } = useTableUrlState({
    search: route.useSearch(),
    navigate: route.useNavigate(),
    pagination: { defaultPage: 1, defaultPageSize: 10, localPagination: true },
    globalFilter: { enabled: false },
    columnFilters: [
      { columnId: 'firstName', searchKey: 'firstName', type: 'string' }
    ]
  })

  // Filter the full data BEFORE slicing for pagination.
  const filteredData = React.useMemo(() => {
    if (columnFilters.length === 0) return data
    return data.filter((row) => {
      return columnFilters.every((filter) => {
        const value = row[filter.id as keyof typeof row]
        if (Array.isArray(filter.value)) {
          return filter.value.length === 0 || filter.value.includes(value as never)
        }
        if (typeof filter.value === 'string') {
          return !filter.value || String(value).toLowerCase().includes(filter.value.toLowerCase())
        }
        return true
      })
    })
  }, [data, columnFilters])

  // Slice the filtered data for the current page.
  const safeData = React.useMemo(
    () => filteredData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize),
    [filteredData, pagination.pageIndex, pagination.pageSize]
  )

  const displayPageCount = Math.max(Math.ceil(filteredData.length / pagination.pageSize), 1)

  const table = useReactTable({
    data: safeData,
    columns,
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
      rowSelection
    },
    enableRowSelection: true,
    manualPagination: true,
    pageCount: displayPageCount,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  })

  React.useEffect(() => {
    ensurePageInRange(displayPageCount)
  }, [ensurePageInRange, displayPageCount])

  const selectedRowsData = table.getFilteredSelectedRowModel().rows

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <DataTableToolbar
            table={table}
            filters={[]}
            searchKey="firstName"
            searchPlaceholder="Filter dependents..."
          />
        </div>
        {selectedRowsData.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedRowsData.length} selected
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setSelectedRows(selectedRowsData.map((r) => r.original))
                setOpen('bulk-delete')
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete {selectedRowsData.length > 1 ? `(${selectedRowsData.length})` : ''}
            </Button>
          </div>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No dependents found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} displayPageSize={displayPageSize} onDisplayPageSizeChange={setDisplayPageSize} />
    </div>
  )
}
