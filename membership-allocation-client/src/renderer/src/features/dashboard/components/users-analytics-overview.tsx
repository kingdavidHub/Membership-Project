import { useQuery } from '@tanstack/react-query'
import { Users, UserCheck, UserMinus, ArrowRight } from 'lucide-react'
import { analyticsService } from '@/api/services'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type UsersAnalyticsOverviewProps = {
  onViewAnalytics: () => void
}

export function UsersAnalyticsOverview({ onViewAnalytics }: UsersAnalyticsOverviewProps) {
  const { data: response, isPending } = useQuery({
    queryKey: ['analytics', 'admin-users'],
    queryFn: () => analyticsService.getAdminUsers()
  })

  const data = response?.data
  const activeCount = data?.memberStatuses?.find((s) => s._id === 'active')?.count ?? 0
  const inactiveCount = data?.memberStatuses?.find((s) => s._id === 'inactive')?.count ?? 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Users Analytics</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
          onClick={onViewAnalytics}
        >
          View Details
          <ArrowRight className="h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-lg font-bold tabular-nums">
                {isPending ? '—' : data?.totalUsers ?? 0}
              </p>
              <p className="text-[11px] text-muted-foreground">Total Users</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-lg font-bold tabular-nums">
                {isPending ? '—' : activeCount}
              </p>
              <p className="text-[11px] text-muted-foreground">Active</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <UserMinus className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-lg font-bold tabular-nums">
                {isPending ? '—' : inactiveCount}
              </p>
              <p className="text-[11px] text-muted-foreground">Inactive</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
