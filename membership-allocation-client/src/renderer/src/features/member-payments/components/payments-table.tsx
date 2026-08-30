'use client'

import { useEffect, useMemo, useState } from 'react'
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
import { type Payment } from '@/features/payments/data/schema'
import { columns } from '@/features/payments/components/payments-columns'

const route = getRouteApi('/_authenticated/member/payments')

type MemberPaymentsTableProps = {
  data: Payment[]
  pageCount: number
}

export function PaymentsTable({ data, pageCount }: MemberPaymentsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const safePageCount = Math.max(pageCount, 1)

  const { pagination, onPaginationChange, ensurePageInRange } = useTableUrlState({
    search: route.useSearch(),
    navigate: route.useNavigate(),
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: false }
  })

  // Client-side safety net: if the API returns more rows than the page size,
  // slice to the correct page to ensure pagination displays correctly.
  const safeData = useMemo(
    () => (data.length > pagination.pageSize ? data.slice(0, pagination.pageSize) : data),
    [data, pagination.pageSize]
  )

  const table = useReactTable({
    data: safeData,
    columns,
    state: {
      sorting,
      pagination
    },
    manualPagination: true,
    pageCount: safePageCount,
    onPaginationChange,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  })

  useEffect(() => {
    ensurePageInRange(safePageCount)
  }, [ensurePageInRange, safePageCount])

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
      <DataTablePagination table={table} className="mt-auto" />
    </div>
  )
}
