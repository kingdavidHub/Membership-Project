import { useQuery } from '@tanstack/react-query'
import { Users, UserCheck, Calendar, Baby, Shield } from 'lucide-react'
import { analyticsService } from '@/api/services'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const AGE_BAND_LABELS: Record<string, string> = {
  '18_29': '18–29',
  '30_44': '30–44',
  '45_59': '45–59',
  '60_plus': '60+'
}

const RELATIONSHIP_LABELS: Record<string, string> = {
  spouse: 'Spouse',
  parent: 'Parent',
  guardian: 'Guardian',
  father: 'Father',
  uncle: 'Uncle',
  child: 'Child',
  brother: 'Brother'
}

const MONTH_NAMES = [
  '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

export function AdminUsersAnalytics() {
  const { data: response, isPending } = useQuery({
    queryKey: ['analytics', 'admin-users'],
    queryFn: () => analyticsService.getAdminUsers()
  })

  const data = response?.data

  const formatLabel = (id: string | null | boolean) => {
    if (id === null) return 'None'
    if (typeof id === 'boolean') return id ? 'Yes' : 'No'
    if (typeof id === 'string') {
      if (id === 'without_dependants') return 'Without Dependants'
      if (id === 'with_dependants') return 'With Dependants'
      if (id === 'registered') return 'Registered'
      if (id === 'unregistered') return 'Unregistered'
      if (id === 'complete') return 'Complete'
      if (RELATIONSHIP_LABELS[id]) return RELATIONSHIP_LABELS[id]
      return id.charAt(0).toUpperCase() + id.slice(1)
    }
    return String(id)
  }

  return (
    <div className="space-y-4">
      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isPending ? '—' : data?.totalUsers ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              {isPending ? 'Loading…' : `${data?.newUsers ?? 0} new this period`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Members</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isPending ? '—' : data?.newMembers ?? 0}</div>
            <p className="text-xs text-muted-foreground">Joined this period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isPending
                ? '—'
                : data?.memberStatuses.find((s) => s._id === 'active')?.count ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {isPending
                ? 'Loading…'
                : `${data?.memberStatuses.find((s) => s._id === 'inactive')?.count ?? 0} inactive`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Members</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isPending
                ? '—'
                : data?.paymentStatuses.find((s) => s._id === 'paid')?.count ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {isPending
                ? 'Loading…'
                : `${data?.paymentStatuses.find((s) => s._id === 'unpaid')?.count ?? 0} unpaid`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bar Lists Row 1 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        {/* Roles */}
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>User Roles</CardTitle>
            <CardDescription>Distribution across roles</CardDescription>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : (
              <SimpleBarList
                items={(data?.roles ?? []).map((r) => ({
                  name: formatLabel(r._id),
                  value: r.count
                }))}
                barClass="bg-primary"
                valueFormatter={(n) => String(n)}
              />
            )}
          </CardContent>
        </Card>

        {/* Member Statuses */}
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Member Status</CardTitle>
            <CardDescription>Active vs inactive vs deceased</CardDescription>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : (
              <SimpleBarList
                items={(data?.memberStatuses ?? []).map((s) => ({
                  name: formatLabel(s._id),
                  value: s.count
                }))}
                barClass="bg-muted-foreground"
                valueFormatter={(n) => String(n)}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bar Lists Row 2 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        {/* Age Bands */}
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
            <CardDescription>Members grouped by age band</CardDescription>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : (
              <SimpleBarList
                items={(data?.ageBands ?? [])
                  .map((a) => ({
                    name: AGE_BAND_LABELS[a._id] || a._id,
                    value: a.count
                  }))
                  .sort((a, b) => {
                    const order = ['18–29', '30–44', '45–59', '60+']
                    return order.indexOf(a.name) - order.indexOf(b.name)
                  })}
                barClass="bg-primary"
                valueFormatter={(n) => String(n)}
              />
            )}
          </CardContent>
        </Card>

        {/* Entry Years */}
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Entry Years</CardTitle>
            <CardDescription>When members joined</CardDescription>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : (
              <div className="max-h-80 overflow-y-auto pr-1">
                <SimpleBarList
                  items={(data?.entryYears ?? [])
                    .map((e) => ({
                      name: String(e._id),
                      value: e.count
                    }))
                    .sort((a, b) => Number(a.name) - Number(b.name))}
                  barClass="bg-muted-foreground"
                  valueFormatter={(n) => String(n)}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bar Lists Row 3 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        {/* Birthdays by Month */}
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Birthdays by Month
            </CardTitle>
            <CardDescription>Birthday distribution across the year</CardDescription>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : (
              <div className="max-h-80 overflow-y-auto pr-1">
                <SimpleBarList
                  items={(data?.birthdays ?? [])
                    .map((b) => ({
                      name: MONTH_NAMES[b._id] || `Month ${b._id}`,
                      value: b.count
                    }))
                    .sort((a, b) => {
                      const monthOrder = MONTH_NAMES.indexOf(a.name) - MONTH_NAMES.indexOf(b.name)
                      return monthOrder !== 0 ? monthOrder : a.name.localeCompare(b.name)
                    })}
                  barClass="bg-primary"
                  valueFormatter={(n) => String(n)}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dependant Coverage */}
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Baby className="h-4 w-4" />
              Dependant Coverage
            </CardTitle>
            <CardDescription>Members with vs without dependants</CardDescription>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : (
              <SimpleBarList
                items={(data?.dependantCoverage ?? []).map((d) => ({
                  name: formatLabel(d._id),
                  value: d.count
                }))}
                barClass="bg-muted-foreground"
                valueFormatter={(n) => String(n)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function SimpleBarList({
  items,
  valueFormatter,
  barClass
}: {
  items: { name: string; value: number }[]
  valueFormatter: (n: number) => string
  barClass: string
}) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No data yet.</p>
  }

  const max = Math.max(...items.map((i) => i.value), 1)
  return (
    <ul className="space-y-3">
      {items.map((i) => {
        const width = `${Math.round((i.value / max) * 100)}%`
        return (
          <li key={i.name} className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="mb-1 truncate text-xs text-muted-foreground">{i.name}</div>
              <div className="h-2.5 w-full rounded-full bg-muted">
                <div className={`h-2.5 rounded-full ${barClass}`} style={{ width }} />
              </div>
            </div>
            <div className="ps-2 text-xs font-medium tabular-nums">{valueFormatter(i.value)}</div>
          </li>
        )
      })}
    </ul>
  )
}
