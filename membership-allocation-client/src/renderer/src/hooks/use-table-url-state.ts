import { useMemo, useState, useCallback } from 'react'
import type { ColumnFiltersState, OnChangeFn, PaginationState } from '@tanstack/react-table'

type SearchRecord = Record<string, unknown>

export type NavigateFn = (opts: {
  search: true | SearchRecord | ((prev: SearchRecord) => Partial<SearchRecord> | SearchRecord)
  replace?: boolean
}) => void

/** Display page size is always 10 – the dropdown only controls the API fetch limit. */
const DISPLAY_PAGE_SIZE = 10

type UseTableUrlStateParams = {
  search: SearchRecord
  navigate: NavigateFn
  pagination?: {
    pageKey?: string
    pageSizeKey?: string
    defaultPage?: number
    /** Used only as the default fetch size when the URL has no pageSize param. */
    defaultPageSize?: number
    /** When true, page index is kept in local state (no URL navigation on page change).
     *  Only the fetch size (pageSize) is read from / written to the URL. */
    localPagination?: boolean
  }
  globalFilter?: {
    enabled?: boolean
    key?: string
    trim?: boolean
  }
  columnFilters?: Array<
    | {
        columnId: string
        searchKey: string
        type?: 'string'
        serialize?: (value: unknown) => unknown
        deserialize?: (value: unknown) => unknown
      }
    | {
        columnId: string
        searchKey: string
        type: 'array'
        serialize?: (value: unknown) => unknown
        deserialize?: (value: unknown) => unknown
      }
  >
}

type UseTableUrlStateReturn = {
  globalFilter?: string
  onGlobalFilterChange?: OnChangeFn<string>
  columnFilters: ColumnFiltersState
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>
  /** Always uses the fixed display page size (10). */
  pagination: PaginationState
  onPaginationChange: OnChangeFn<PaginationState>
  ensurePageInRange: (pageCount: number, opts?: { resetTo?: 'first' | 'last' }) => void
  /** The current fetch size (from the URL's pageSize param). */
  fetchSize: number
  /** Update the fetch size in the URL (triggers a loader refetch). */
  setFetchSize: (size: number) => void
}

export function useTableUrlState(params: UseTableUrlStateParams): UseTableUrlStateReturn {
  const {
    search,
    navigate,
    pagination: paginationCfg,
    globalFilter: globalFilterCfg,
    columnFilters: columnFiltersCfg = []
  } = params

  const pageKey = paginationCfg?.pageKey ?? ('page' as string)
  const pageSizeKey = paginationCfg?.pageSizeKey ?? ('pageSize' as string)
  const defaultPage = paginationCfg?.defaultPage ?? 1
  const defaultPageSize = paginationCfg?.defaultPageSize ?? 10
  const localPagination = paginationCfg?.localPagination ?? false

  const globalFilterKey = globalFilterCfg?.key ?? ('filter' as string)
  const globalFilterEnabled = globalFilterCfg?.enabled ?? true
  const trimGlobal = globalFilterCfg?.trim ?? true

  // Build initial column filters from the current search params
  const initialColumnFilters: ColumnFiltersState = useMemo(() => {
    const collected: ColumnFiltersState = []
    for (const cfg of columnFiltersCfg) {
      const raw = (search as SearchRecord)[cfg.searchKey]
      const deserialize = cfg.deserialize ?? ((v: unknown) => v)
      if (cfg.type === 'string') {
        const value = (deserialize(raw) as string) ?? ''
        if (typeof value === 'string' && value.trim() !== '') {
          collected.push({ id: cfg.columnId, value })
        }
      } else {
        const value = (deserialize(raw) as unknown[]) ?? []
        if (Array.isArray(value) && value.length > 0) {
          collected.push({ id: cfg.columnId, value })
        }
      }
    }
    return collected
  }, [columnFiltersCfg, search])

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialColumnFilters)

  // Fetch size: how many records to request from the API (from URL param).
  const fetchSize = useMemo(() => {
    const raw = (search as SearchRecord)[pageSizeKey]
    return typeof raw === 'number' ? raw : defaultPageSize
  }, [search, pageSizeKey, defaultPageSize])

  // Display pagination
  const [displayPageIndex, setDisplayPageIndex] = useState(() => {
    if (localPagination) return defaultPage - 1
    const rawPage = (search as SearchRecord)[pageKey]
    return typeof rawPage === 'number' ? Math.max(0, rawPage - 1) : defaultPage - 1
  })

  const pagination: PaginationState = useMemo(
    () => ({ pageIndex: displayPageIndex, pageSize: DISPLAY_PAGE_SIZE }),
    [displayPageIndex]
  )

  // Page navigation — local only, never touches the URL.
  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === 'function' ? updater(pagination) : updater
    setDisplayPageIndex(next.pageIndex)
  }

  // Update the fetch size in the URL (triggers loader refetch) and reset to first page.
  const setFetchSize = useCallback(
    (size: number) => {
      setDisplayPageIndex(0)
      navigate({
        search: (prev) => ({
          ...(prev as SearchRecord),
          [pageKey]: undefined,
          [pageSizeKey]: size === defaultPageSize ? undefined : size
        })
      })
    },
    [navigate, pageKey, pageSizeKey, defaultPageSize]
  )

  const [globalFilter, setGlobalFilter] = useState<string | undefined>(() => {
    if (!globalFilterEnabled) return undefined
    const raw = (search as SearchRecord)[globalFilterKey]
    return typeof raw === 'string' ? raw : ''
  })

  const onGlobalFilterChange: OnChangeFn<string> | undefined = globalFilterEnabled
    ? (updater) => {
        const next = typeof updater === 'function' ? updater(globalFilter ?? '') : updater
        const value = trimGlobal ? next.trim() : next
        setGlobalFilter(value)
        setDisplayPageIndex(0)
        navigate({
          search: (prev) => ({
            ...(prev as SearchRecord),
            [pageKey]: undefined,
            [globalFilterKey]: value ? value : undefined
          })
        })
      }
    : undefined

  const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (updater) => {
    const next = typeof updater === 'function' ? updater(columnFilters) : updater
    setColumnFilters(next)
    setDisplayPageIndex(0)

    const patch: Record<string, unknown> = {}

    for (const cfg of columnFiltersCfg) {
      const found = next.find((f) => f.id === cfg.columnId)
      const serialize = cfg.serialize ?? ((v: unknown) => v)
      if (cfg.type === 'string') {
        const value = typeof found?.value === 'string' ? (found.value as string) : ''
        patch[cfg.searchKey] = value.trim() !== '' ? serialize(value) : undefined
      } else {
        const value = Array.isArray(found?.value) ? (found!.value as unknown[]) : []
        patch[cfg.searchKey] = value.length > 0 ? serialize(value) : undefined
      }
    }

    navigate({
      search: (prev) => ({
        ...(prev as SearchRecord),
        [pageKey]: undefined,
        ...patch
      })
    })
  }

  const ensurePageInRange = (
    pageCount: number,
    opts: { resetTo?: 'first' | 'last' } = { resetTo: 'first' }
  ) => {
    const currentPageIdx = displayPageIndex
    const currentPageNum = currentPageIdx + 1
    if (pageCount > 0 && currentPageNum > pageCount) {
      const newPageIndex = opts.resetTo === 'last' ? pageCount - 1 : 0
      setDisplayPageIndex(newPageIndex)
    }
  }

  return {
    globalFilter: globalFilterEnabled ? (globalFilter ?? '') : undefined,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
    fetchSize,
    setFetchSize
  }
}
