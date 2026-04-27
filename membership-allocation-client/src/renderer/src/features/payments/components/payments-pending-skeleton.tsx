import { ArrowLeft } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { TableSkeleton } from '@/components/skeletons'

export function PaymentsPendingSkeleton() {
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
            <div className="mb-2">
              <Button variant="ghost" size="sm" disabled>
                <ArrowLeft className="me-2 h-4 w-4" />
                Back to Members
              </Button>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Payment Summary</h2>
            <p className="text-muted-foreground">Review payment history for this member.</p>
          </div>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <TableSkeleton columnCount={3} rowCount={10} />
        </div>
      </Main>
    </>
  )
}
