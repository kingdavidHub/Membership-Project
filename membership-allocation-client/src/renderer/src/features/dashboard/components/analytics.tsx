import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Users, DollarSign, Activity, AlertTriangle, Download, BarChart3 } from 'lucide-react'
import { analyticsService } from '@/api/services'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdminUsersAnalytics } from './admin-users-analytics'
import { ExportFormatModal } from './export-format-modal'

export function Analytics() {
  const [paymentsModalOpen, setPaymentsModalOpen] = useState(false)
  const [usersModalOpen, setUsersModalOpen] = useState(false)

  return (
    <div className="space-y-4">
      {/* Export Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPaymentsModalOpen(true)}
        >
          <Download className="mr-2 h-4 w-4" />
          Export Payments
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setUsersModalOpen(true)}
        >
          <Download className="mr-2 h-4 w-4" />
          Export User Profiles
        </Button>
      </div>

      {/* Export Modals */}
      <ExportFormatModal
        open={paymentsModalOpen}
        onOpenChange={setPaymentsModalOpen}
        title="Export Payments"
        description="Download organization-wide payment data in your preferred format."
        onExport={(format) => analyticsService.exportAdminPayments(format)}
      />
      <ExportFormatModal
        open={usersModalOpen}
        onOpenChange={setUsersModalOpen}
        title="Export User Profiles"
        description="Download user and member data in your preferred format."
        onExport={(format) => analyticsService.exportAdminUsers(format)}
      />

      {/* Sub-tabs for Payments vs Users */}
      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payments" className="gap-1.5">
            <BarChart3 className="h-3.5 w-3.5" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-1.5">
            <Users className="h-3.5 w-3.5" />
            Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payments">
          <PaymentsAnalytics />
        </TabsContent>

        <TabsContent value="users">
          <AdminUsersAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PaymentsAnalytics() {
  const { data: analyticsResponse, isPending } = useQuery({
    queryKey: ['analytics', 'admin-payments'],
    queryFn: () => analyticsService.getAdminPayments()
  })

  const data = analyticsResponse?.data
  const totals = data?.totals
  const currentStatus = data?.currentStatus ?? []
  const topMembers = data?.topMembers ?? []
  const expiryRisk = data?.expiryRisk

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(value)

  return (
    <div className="space-y-4">
      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isPending ? '—' : formatCurrency(totals?.totalCollected ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {isPending ? 'Loading…' : `${totals?.transactionCount ?? 0} transactions`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paying Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isPending ? '—' : totals?.uniquePayingMembers ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {isPending
                ? 'Loading…'
                : `${data?.membersWithoutPayments ?? 0} without payments`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Transaction</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isPending ? '—' : formatCurrency(totals?.averageTransactionValue ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {isPending ? 'Loading…' : `${totals?.operationCount ?? 0} operations`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiry Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isPending ? '—' : expiryRisk?.expired ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {isPending
                ? 'Loading…'
                : `${expiryRisk?.dueWithin7Days ?? 0} due within 7 days`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bar Lists */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        {/* Payment Status */}
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
            <CardDescription>Current payment status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : currentStatus.length === 0 ? (
              <p className="text-sm text-muted-foreground">No payment data yet.</p>
            ) : (
              <SimpleBarList
                items={currentStatus.map((s) => ({
                  name: s._id.charAt(0).toUpperCase() + s._id.slice(1),
                  value: s.count
                }))}
                barClass="bg-primary"
                valueFormatter={(n) => String(n)}
              />
            )}
          </CardContent>
        </Card>

        {/* Top Members */}
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Top Paying Members</CardTitle>
            <CardDescription>Highest contributors this period</CardDescription>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : topMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No member data yet.</p>
            ) : (
              <div className="max-h-80 scroll-smooth overflow-y-auto pr-1">
                <SimpleBarList
                  items={topMembers.map((m) => ({
                    name: `${m.firstName} ${m.lastName}`,
                    value: m.total
                  }))}
                  barClass="bg-primary"
                  valueFormatter={(n) => formatCurrency(n)}
                />
              </div>
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
            <div className="ps-2 text-xs font-medium tabular-nums">
              {valueFormatter(i.value)}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
