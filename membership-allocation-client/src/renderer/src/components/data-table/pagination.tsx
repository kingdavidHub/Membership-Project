import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon
} from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { cn, getPageNumbers } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const ROWS_PER_PAGE_OPTIONS = [10, 20, 40]
const FETCH_SIZE_OPTIONS = [0, 10, 20, 30, 40, 50]
const ALL_VALUE = 'all'

type DataTablePaginationProps<TData> = {
  table: Table<TData>
  className?: string
  /** API fetch size – how many records to request. */
  fetchSize?: number
  onFetchSizeChange?: (newSize: number) => void
  /** Display page size – how many rows to show per page. */
  displayPageSize?: number
  onDisplayPageSizeChange?: (size: number) => void
  /** Label for the fetch size dropdown, e.g. "Load users". */
  loadLabel?: string
}

export function DataTablePagination<TData>({
  table,
  className,
  fetchSize,
  onFetchSizeChange,
  displayPageSize,
  onDisplayPageSizeChange,
  loadLabel = 'Load'
}: DataTablePaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex + 1
  const totalPages = table.getPageCount()
  const pageNumbers = getPageNumbers(currentPage, totalPages)

  const rowsValue = displayPageSize ?? table.getState().pagination.pageSize

  return (
    <div
      className={cn(
        'flex items-center justify-between overflow-clip px-2',
        '@max-2xl/content:flex-col-reverse @max-2xl/content:gap-4',
        className
      )}
      style={{ overflowClipMargin: 1 }}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium @2xl/content:hidden">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center gap-3 @max-2xl/content:flex-row-reverse">
          {/* Rows per page dropdown */}
          <div className="flex items-center gap-2">
            <Select
              value={`${rowsValue}`}
              onValueChange={(value) => {
                onDisplayPageSizeChange?.(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={`${rowsValue}`} />
              </SelectTrigger>
              <SelectContent side="top">
                {ROWS_PER_PAGE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="hidden text-sm font-medium sm:block">Rows per page</p>
          </div>

          {/* Fetching dropdown */}
          {onFetchSizeChange && (
            <div className="flex items-center gap-2">
            <Select
              value={fetchSize === 0 ? ALL_VALUE : `${fetchSize}`}
              onValueChange={(value) => {
                onFetchSizeChange(value === ALL_VALUE ? 0 : Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={fetchSize === 0 ? 'All' : `${fetchSize}`} />
              </SelectTrigger>
              <SelectContent side="top">
                <SelectItem value={ALL_VALUE}>All</SelectItem>
                {FETCH_SIZE_OPTIONS.filter((s) => s > 0).map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
              <p className="hidden text-sm font-medium sm:block">{loadLabel}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center sm:space-x-6 lg:space-x-8">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium @max-3xl/content:hidden">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="size-8 p-0 @max-md/content:hidden"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>

          {pageNumbers.map((pageNumber, index) => (
            <div key={`${pageNumber}-${index}`} className="flex items-center">
              {pageNumber === '...' ? (
                <span className="px-1 text-sm text-muted-foreground">...</span>
              ) : (
                <Button
                  variant={currentPage === pageNumber ? 'default' : 'outline'}
                  className="h-8 min-w-8 px-2"
                  onClick={() => table.setPageIndex((pageNumber as number) - 1)}
                >
                  <span className="sr-only">Go to page {pageNumber}</span>
                  {pageNumber}
                </Button>
              )}
            </div>
          ))}

          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 p-0 @max-md/content:hidden"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
