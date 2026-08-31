'use client'

import { useEffect, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useTableUrlState } from '@/hooks/use-table-url-state'
import { DataTablePagination } from '@/components/data-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { type Payment } from '../data/schema'
import { columns } from './payments-columns'

const route = getRouteApi('/_authenticated/members/$memberId/payments')

type PaymentsTableProps = {
  data: Payment[]
  pageCount: number
}

export function PaymentsTable({ data, pageCount }: PaymentsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const { pagination, onPaginationChange, ensurePageInRange, fetchSize, setFetchSize, displayPageSize, setDisplayPageSize } = useTableUrlState({
    search: route.useSearch(),
    navigate: route.useNavigate(),
    pagination: { defaultPage: 1, defaultPageSize: 10, localPagination: true },
    globalFilter: { enabled: false }
  })

  const displayPageCount = Math.max(Math.ceil(data.length / pagination.pageSize), 1)

  // Client-side slice: show only the current page's rows.
  const safeData = React.useMemo(
    () => data.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize),
    [data, pagination.pageIndex, pagination.pageSize]
  )

  const table = useReactTable({
    data: safeData,
    columns,
    state: {
      sorting,
      pagination
    },
    manualPagination: true,
    pageCount: displayPageCount,
    onPaginationChange,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  })

  useEffect(() => {
    ensurePageInRange(displayPageCount)
  }, [ensurePageInRange, displayPageCount])

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
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
                  No payments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className="mt-auto" fetchSize={fetchSize} onFetchSizeChange={setFetchSize} displayPageSize={displayPageSize} onDisplayPageSizeChange={setDisplayPageSize} />
    </div>
  )
}
