import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Skeleton } from '@/components/ui/skeleton'
import { TableSkeleton } from '@/components/skeletons'

/** Pending skeleton shown while Members route loader is resolving */
export function MembersPendingSkeleton() {
  return (
    <>
      <Header fixed>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Members</h2>
            <p className="text-muted-foreground">Manage your organization members here.</p>
          </div>
          <Skeleton className="h-9 w-35" />
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <TableSkeleton columnCount={9} rowCount={10} />
        </div>
      </Main>
    </>
  )
}
