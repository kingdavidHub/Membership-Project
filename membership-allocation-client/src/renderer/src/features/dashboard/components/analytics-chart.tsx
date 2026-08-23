import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import type { PaymentTrend } from '@/api/services'

type AnalyticsChartProps = {
  trend: PaymentTrend[]
}

export function AnalyticsChart({ trend }: AnalyticsChartProps) {
  const data = trend.map((item) => ({
    name: item._id,
    membership: item.membership,
    contributions: item.contributions,
    total: item.total
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) =>
            value >= 1000 ? `${(value / 1000).toFixed(0)}k` : `${value}`
          }
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="currentColor"
          className="text-primary"
          fill="currentColor"
          fillOpacity={0.15}
          name="Total Collected"
        />
        <Area
          type="monotone"
          dataKey="membership"
          stroke="currentColor"
          className="text-muted-foreground"
          fill="currentColor"
          fillOpacity={0.1}
          name="Membership"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
