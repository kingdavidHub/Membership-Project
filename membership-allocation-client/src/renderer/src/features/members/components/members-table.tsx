'use client'

import * as React from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
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
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
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
import { useMembers } from './members-provider'
import { type Member } from '../data/schema'
import { MembersAttributeDialog } from './members-attribute-dialog'
import { MembersViewDialog } from './members-view-dialog'

type MembersTableProps = {
  columns: ColumnDef<Member>[]
  data: Member[]
  pageCount: number
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function MembersTable({ columns, data, pageCount, search, navigate }: MembersTableProps) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [sorting, setSorting] = React.useState<SortingState>([])
  const { setSelectedRows, selectionResetKey } = useMembers()

  const {
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
    fetchSize,
    setFetchSize,
    displayPageSize,
    setDisplayPageSize
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10, localPagination: true },
    globalFilter: { enabled: false },
    columnFilters: [
      { columnId: 'name', searchKey: 'name', type: 'string' },
      { columnId: 'paymentStatus', searchKey: 'paymentStatus', type: 'array' },
      { columnId: 'memberStatus', searchKey: 'memberStatus', type: 'array' }
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
    onPaginationChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  })

  // Sync table row selection to the provider so it can be used by the Send Message button
  const selectedRowsData = table.getFilteredSelectedRowModel().rows
  React.useEffect(() => {
    setSelectedRows(selectedRowsData.map((r) => r.original))
  }, [selectedRowsData, setSelectedRows])

  React.useEffect(() => {
    if (selectionResetKey === 0) return
    table.resetRowSelection()
    setSelectedRows([])
  }, [selectionResetKey, table, setSelectedRows])

  React.useEffect(() => {
    ensurePageInRange(displayPageCount)
  }, [ensurePageInRange, displayPageCount])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <DataTableToolbar
          table={table}
          searchKey="name"
          searchPlaceholder="Filter members..."
          showResetButton={false}
          leftExtra={
            <>
              <MembersAttributeDialog table={table} />
              <MembersViewDialog table={table} />
              {table.getState().columnFilters.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    table.resetColumnFilters()
                    table.setGlobalFilter('')
                  }}
                  className="h-8 px-2 lg:px-3"
                >
                  Reset
                  <Cross2Icon className="ms-2 h-4 w-4" />
                </Button>
              )}
            </>
          }
        />
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
                  No members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} fetchSize={fetchSize} onFetchSizeChange={setFetchSize} displayPageSize={displayPageSize} onDisplayPageSizeChange={setDisplayPageSize} loadLabel="Load members" />
    </div>
  )
}
