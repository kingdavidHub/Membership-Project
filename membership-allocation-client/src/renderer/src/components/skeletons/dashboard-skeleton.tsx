import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

/** Skeleton for the stat cards row on the dashboard */
export function DashboardStatsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded" />
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-1 h-7 w-28" />
            <Skeleton className="h-3 w-40" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

/** Skeleton for the overview chart + recent sales cards */
export function DashboardChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
      <Card className="col-span-1 lg:col-span-4">
        <CardHeader>
          <Skeleton className="h-5 w-20" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
      <Card className="col-span-1 lg:col-span-3">
        <CardHeader>
          <Skeleton className="mb-1 h-5 w-36" />
          <Skeleton className="h-3 w-44" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

/** Skeleton for the member-user dashboard summary (cards + dependents + account summary) */
export function UserDashboardSummarySkeleton() {
  return (
    <div className="space-y-4">
      <DashboardStatsSkeleton count={4} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-56" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3 w-52" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/** Skeleton for the admin/super-admin dashboard summary (cards + breakdown panels) */
export function AdminDashboardSummarySkeleton() {
  return (
    <div className="space-y-4">
      <DashboardStatsSkeleton count={4} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3 w-56" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3 w-52" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/** Full dashboard content skeleton */
export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <DashboardStatsSkeleton />
      <DashboardChartsSkeleton />
    </div>
  )
}
