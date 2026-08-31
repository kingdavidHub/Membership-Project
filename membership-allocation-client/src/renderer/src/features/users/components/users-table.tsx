import { useEffect, useMemo, useState } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
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
import { type User } from '../data/schema'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { usersColumns as columns } from './users-columns'
import { useUsers } from './users-provider'
import { UsersRoleFilter } from './users-role-filter'
import { UsersViewDialog } from './users-view-dialog'

type DataTableProps = {
  data: User[]
  totalCount: number
  _totalCount?: number
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function UsersTable({ data, search, navigate, _totalCount }: DataTableProps) {
  void _totalCount
  // Local UI-only states
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const { setSelectedRows, selectionResetKey } = useUsers()
  const currentScope = (search as Record<string, unknown>).scope
  const isUnregistered = currentScope === 'unregistered'

  const setUserScope = (scope: 'all' | 'unregistered') => {
    navigate({
      search: (prev) => ({
        ...(prev as Record<string, unknown>),
        page: undefined,
        scope: scope === 'all' ? undefined : scope
      })
    })
  }

  // Local state management for table (uncomment to use local-only state, not synced with URL)
  // const [columnFilters, onColumnFiltersChange] = useState<ColumnFiltersState>([])
  // const [pagination, onPaginationChange] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })

  // Synced with URL states (keys/defaults mirror users route search schema)
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
      // name per-column text filter
      { columnId: 'name', searchKey: 'name', type: 'string' },
      { columnId: 'role', searchKey: 'role', type: 'array' }
    ]
  })

  // Filter the full data BEFORE slicing for pagination.
  // This ensures column filters work across all fetched records.
  const filteredData = useMemo(() => {
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
  const safeData = useMemo(
    () => filteredData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize),
    [filteredData, pagination.pageIndex, pagination.pageSize]
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: safeData,
    columns,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters,
      columnVisibility
    },
    manualPagination: true,
    pageCount: Math.ceil(filteredData.length / pagination.pageSize),
    enableRowSelection: true,
    onPaginationChange,
    onColumnFiltersChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  })

  useEffect(() => {
    ensurePageInRange(table.getPageCount())
  }, [table, ensurePageInRange])

  const selectedRowsData = table.getFilteredSelectedRowModel().rows
  useEffect(() => {
    setSelectedRows(selectedRowsData.map((row) => row.original))
  }, [selectedRowsData, setSelectedRows])

  useEffect(() => {
    if (selectionResetKey === 0) return
    table.resetRowSelection()
    setSelectedRows([])
  }, [selectionResetKey, table, setSelectedRows])

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16', // Add margin bottom to the table on mobile when the toolbar is visible
        'flex flex-1 flex-col gap-4'
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <DataTableToolbar
            table={table}
            searchPlaceholder="Filter users..."
            searchKey="name"
            showResetButton={false}
            leftExtra={
              <>
                <UsersRoleFilter table={table} />
                <UsersViewDialog table={table} />
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
        <div className="flex items-center gap-2 sm:justify-end">
          <Button
            size="sm"
            variant={isUnregistered ? 'outline' : 'default'}
            onClick={() => setUserScope('all')}
          >
            All Users
          </Button>
          <Button
            size="sm"
            variant={isUnregistered ? 'default' : 'outline'}
            onClick={() => setUserScope('unregistered')}
          >
            Unregistered Users
          </Button>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="group/row">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                        header.column.columnDef.meta?.className,
                        header.column.columnDef.meta?.thClassName
                      )}
                    >
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="group/row"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                        cell.column.columnDef.meta?.className,
                        cell.column.columnDef.meta?.tdClassName
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className="mt-auto" fetchSize={fetchSize} onFetchSizeChange={setFetchSize} displayPageSize={displayPageSize} onDisplayPageSizeChange={setDisplayPageSize} loadLabel="Load users" />
      <DataTableBulkActions table={table} />
    </div>
  )
}
