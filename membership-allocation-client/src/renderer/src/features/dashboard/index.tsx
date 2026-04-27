import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Analytics } from './components/analytics'
import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'
import { UserRole } from '@/stores/auth-store'
import { IsUserOnline } from '@/components/is-user-online'
import { useUserProfile } from '@/hooks/use-user-profile'
import { DashboardStatsSkeleton, DashboardChartsSkeleton } from '@/components/skeletons'
import { useQuery } from '@tanstack/react-query'
import { membersService } from '@/api/services'
import { dependentRelationLabels } from '@/features/dependents/data/dependent-relations'

export function Dashboard() {
  const { userProfile, isLoading } = useUserProfile()
  const isMemberUser = userProfile?.role === UserRole.USER
  const memberId = userProfile?.member?._id

  const { data: dependentsResponse } = useQuery({
    queryKey: ['dependents', memberId],
    queryFn: () => membersService.getMemberDependents(memberId as string),
    enabled: isMemberUser && !!memberId
  })

  const dependents = dependentsResponse?.data?.dependents ?? userProfile?.member?.dependents ?? []

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        {/* <TopNav links={topNav} /> */}
        <div className="ms-auto flex items-center space-x-4">
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <IsUserOnline />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Button>Download</Button>
          </div>
        </div>
        <Tabs orientation="vertical" defaultValue="overview" className="space-y-4">
          <div className="w-full overflow-x-auto pb-2">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports" disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                Notifications
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="overview" className="space-y-4">
            {isLoading ? (
              <>
                <DashboardStatsSkeleton />
                <DashboardChartsSkeleton />
              </>
            ) : (
              <>
                {isMemberUser ? (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <Card>
                        <CardHeader className="space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Member</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {userProfile?.member
                              ? `${userProfile.member.firstName} ${userProfile.member.lastName}`.trim()
                              : userProfile?.name || 'User'}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Membership ID: {userProfile?.member?.membershipId || '-'}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {userProfile?.member?.paymentStatus || '-'}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Last paid: {formatDate(userProfile?.member?.lastPaid)}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Payment Expiry</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {formatDate(userProfile?.member?.paymentExpiryDate)}
                          </div>
                          <p className="text-xs text-muted-foreground">Renew before expiry.</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Dependents</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{dependents.length}</div>
                          <p className="text-xs text-muted-foreground">Linked to your account.</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
                      <Card className="col-span-1 lg:col-span-4">
                        <CardHeader>
                          <CardTitle>Your Dependents</CardTitle>
                          <CardDescription>Quick view of the most recent ones.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {dependents.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No dependents yet.</p>
                          ) : (
                            dependents.slice(0, 5).map((dep) => (
                              <div key={dep._id} className="flex items-center justify-between">
                                <div className="text-sm">
                                  {dep.firstName} {dep.lastName}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {dep.relationship
                                    ? dependentRelationLabels[dep.relationship] || dep.relationship
                                    : '-'}
                                </div>
                              </div>
                            ))
                          )}
                        </CardContent>
                      </Card>

                      <Card className="col-span-1 lg:col-span-3">
                        <CardHeader>
                          <CardTitle>Account Summary</CardTitle>
                          <CardDescription>Based on your accessible data.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Email</span>
                            <span>{userProfile?.email || '-'}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Entry Year</span>
                            <span>{userProfile?.member?.entryYear ?? '-'}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                          >
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                          </svg>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">$45,231.89</div>
                          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                          >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">+2350</div>
                          <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Active Members</CardTitle>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                          >
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                          </svg>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">+573</div>
                          <p className="text-xs text-muted-foreground">+201 since last hour</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
                      {userProfile?.role === UserRole.SUPER_ADMIN ||
                        userProfile?.role === UserRole.ADMIN ? (
                        <>
                          <Card className="col-span-1 lg:col-span-4">
                            <CardHeader>
                              <CardTitle>Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="ps-2">
                              <Overview />
                            </CardContent>
                          </Card>
                          <Card className="col-span-1 lg:col-span-3">
                            <CardHeader>
                              <CardTitle>Recent Subscription</CardTitle>
                              <CardDescription>Subscription made this month.</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <RecentSales />
                            </CardContent>
                          </Card>
                        </>
                      ) : null}
                    </div>
                  </>
                )}
              </>
            )}
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Analytics />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

function formatDate(value?: string | null) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString()
}

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
    disabled: false
  },
  {
    title: 'Members',
    href: 'dashboard/customers',
    isActive: false,
    disabled: true
  },
  {
    title: 'Subscriptions',
    href: 'dashboard/products',
    isActive: false,
    disabled: true
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false,
    disabled: true
  }
]
