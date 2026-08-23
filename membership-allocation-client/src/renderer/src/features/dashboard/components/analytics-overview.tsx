import { useQuery } from '@tanstack/react-query'
import { DollarSign, Users, Activity, ArrowRight } from 'lucide-react'
import { analyticsService } from '@/api/services'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type AnalyticsOverviewProps = {
  onViewAnalytics: () => void
}

export function AnalyticsOverview({ onViewAnalytics }: AnalyticsOverviewProps) {
  const { data: response, isPending } = useQuery({
    queryKey: ['analytics', 'admin-payments'],
    queryFn: () => analyticsService.getAdminPayments()
  })

  const totals = response?.data?.totals

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(value)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Payment Analytics</CardTitle>
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
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-lg font-bold tabular-nums">
                {isPending ? '—' : formatCurrency(totals?.totalCollected ?? 0)}
              </p>
              <p className="text-[11px] text-muted-foreground">Collected</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-lg font-bold tabular-nums">
                {isPending ? '—' : totals?.uniquePayingMembers ?? 0}
              </p>
              <p className="text-[11px] text-muted-foreground">Paying Members</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-lg font-bold tabular-nums">
                {isPending ? '—' : formatCurrency(totals?.averageTransactionValue ?? 0)}
              </p>
              <p className="text-[11px] text-muted-foreground">Avg. Transaction</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
