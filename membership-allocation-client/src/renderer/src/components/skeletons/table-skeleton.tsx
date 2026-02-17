import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

interface TableSkeletonProps {
  /** Number of columns to render */
  columnCount?: number
  /** Number of rows to render */
  rowCount?: number
  /** Whether to show toolbar (search + filters) skeleton */
  showToolbar?: boolean
  /** Whether to show pagination skeleton */
  showPagination?: boolean
}

export function TableSkeleton({
  columnCount = 5,
  rowCount = 10,
  showToolbar = true,
  showPagination = true
}: TableSkeletonProps) {
  return (
    <div className="space-y-4">
      {showToolbar && <TableToolbarSkeleton />}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columnCount }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columnCount }).map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton
                      className={`h-4 ${colIndex === 0 ? 'w-7.5' : colIndex === columnCount - 1 ? 'w-15' : 'w-25'}`}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {showPagination && <TablePaginationSkeleton />}
    </div>
  )
}

function TableToolbarSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {/* Search input */}
        <Skeleton className="h-9 w-50" />
        {/* Filter buttons */}
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
      </div>
      {/* View options */}
      <Skeleton className="h-9 w-20" />
    </div>
  )
}

function TablePaginationSkeleton() {
  return (
    <div className="flex items-center justify-between px-2">
      <Skeleton className="h-4 w-30" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-17.5" />
        <Skeleton className="h-9 w-22.5" />
        <Skeleton className="h-9 w-17.5" />
      </div>
    </div>
  )
}
