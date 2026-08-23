import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Analytics } from './components/analytics'
import { AnalyticsOverview } from './components/analytics-overview'
import { UsersAnalyticsOverview } from './components/users-analytics-overview'
import { UserRole, useAuthStore } from '@/stores/auth-store'
import { IsUserOnline } from '@/components/is-user-online'
import { useUserProfile } from '@/hooks/use-user-profile'
import {
  AdminDashboardSummarySkeleton,
  UserDashboardSummarySkeleton
} from '@/components/skeletons'
import { useQuery } from '@tanstack/react-query'
import { membersService, usersService } from '@/api/services'
import { dependentRelationLabels } from '@/features/dependents/data/dependent-relations'
import { AIChatWidget } from '@/components/ai-chat/AIChatWidget'

export function Dashboard() {
  const authRole = useAuthStore((s) => s.auth.user?.role)
  const { userProfile, isLoading } = useUserProfile()
  const resolvedRole = userProfile?.role ?? authRole
  const isMemberUser = resolvedRole === UserRole.USER
  const isAdmin = resolvedRole === UserRole.ADMIN || resolvedRole === UserRole.SUPER_ADMIN
  const memberId = userProfile?.member?._id

  const {
    data: dependentsResponse,
    isPending: isDependentsPending,
    isFetching: isDependentsFetching
  } = useQuery({
    queryKey: ['dependents', memberId],
    queryFn: () => membersService.getMemberDependents(memberId as string),
    enabled: isMemberUser && !!memberId
  })

  const dependents = dependentsResponse?.data?.dependents ?? userProfile?.member?.dependents ?? []

  const {
    data: membersResponse,
    isPending: isMembersPending,
    isFetching: isMembersFetching
  } = useQuery({
    queryKey: ['members', 'dashboard'],
    queryFn: () => membersService.getMembers(1, 1000),
    enabled: isAdmin
  })

  const {
    data: usersResponse,
    isPending: isUsersPending,
    isFetching: isUsersFetching
  } = useQuery({
    queryKey: ['users', 'dashboard'],
    queryFn: () => usersService.getUsers(1, 1000),
    enabled: isAdmin
  })

  const [activeTab, setActiveTab] = useState('overview')

  const birthMonth = new Date().getMonth() + 1
  const {
    data: birthdaysResponse,
    isPending: isBirthdaysPending,
    isFetching: isBirthdaysFetching
  } = useQuery({
    queryKey: ['members', 'birthdays', birthMonth],
    queryFn: () => membersService.getMembersByBirthdayMonth(birthMonth),
    enabled: isAdmin
  })

  const adminMembers = membersResponse?.data?.members ?? []
  const totalMembers = membersResponse?.results ?? adminMembers.length
  const activeMembers = adminMembers.filter((m) => m.memberStatus === 'active').length
  const paymentPaid = adminMembers.filter((m) => m.paymentStatus === 'paid').length
  const paymentUnpaid = adminMembers.filter((m) => m.paymentStatus === 'unpaid').length
  const paymentPending = adminMembers.filter((m) => m.paymentStatus === 'pending').length

  const totalUsers = usersResponse?.results ?? usersResponse?.data?.users?.length ?? 0

  const birthdayMembers = birthdaysResponse?.data?.members ?? []
  const birthdaysThisMonth = birthdaysResponse?.results ?? birthdayMembers.length

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
        </div>
        <Tabs orientation="vertical" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="w-full overflow-x-auto pb-2">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {isAdmin && <TabsTrigger value="analytics">Analytics</TabsTrigger>}
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
              resolvedRole === UserRole.USER ? (
                <UserDashboardSummarySkeleton />
              ) : (
                <AdminDashboardSummarySkeleton />
              )
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
                          <div className="text-2xl font-bold">
                            {isDependentsPending || isDependentsFetching ? '-' : dependents.length}
                          </div>
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
                          {isDependentsPending || isDependentsFetching ? (
                            <p className="text-sm text-muted-foreground">Loading dependents…</p>
                          ) : dependents.length === 0 ? (
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
                    {!isAdmin ? (
                      <Card>
                        <CardHeader>
                          <CardTitle>Overview</CardTitle>
                          <CardDescription>No admin dashboard data for this role.</CardDescription>
                        </CardHeader>
                      </Card>
                    ) : isMembersPending || isUsersPending || isBirthdaysPending ? (
                      <AdminDashboardSummarySkeleton />
                    ) : (
                      <>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          <Card>
                            <CardHeader className="space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">Members</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">
                                {isMembersFetching ? '-' : totalMembers}
                              </div>
                              <p className="text-xs text-muted-foreground">Total members in system.</p>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">
                                {isMembersFetching ? '-' : activeMembers}
                              </div>
                              <p className="text-xs text-muted-foreground">Currently active.</p>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">Users</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">
                                {isUsersFetching ? '-' : totalUsers}
                              </div>
                              <p className="text-xs text-muted-foreground">Registered user accounts.</p>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">
                                Birthdays (This Month)
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">
                                {isBirthdaysFetching ? '-' : birthdaysThisMonth}
                              </div>
                              <p className="text-xs text-muted-foreground">Based on member profiles.</p>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <AnalyticsOverview onViewAnalytics={() => setActiveTab('analytics')} />
                          <UsersAnalyticsOverview onViewAnalytics={() => setActiveTab('analytics')} />
                        </div>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
                          <Card className="col-span-1 lg:col-span-4">
                            <CardHeader>
                              <CardTitle>Payment Status</CardTitle>
                              <CardDescription>Across fetched member records.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Paid</span>
                                <span className="tabular-nums">{paymentPaid}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Unpaid</span>
                                <span className="tabular-nums">{paymentUnpaid}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Pending</span>
                                <span className="tabular-nums">{paymentPending}</span>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="col-span-1 lg:col-span-3">
                            <CardHeader>
                              <CardTitle>This Month’s Birthdays</CardTitle>
                              <CardDescription>Up to 5 members.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              {birthdayMembers.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No birthdays found.</p>
                              ) : (
                                birthdayMembers.slice(0, 5).map((m) => (
                                  <div key={m._id} className="flex items-center justify-between">
                                    <div className="text-sm">
                                      {m.firstName} {m.lastName}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {formatDate(m.dob)}
                                    </div>
                                  </div>
                                ))
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </TabsContent>
          {isAdmin && (
            <TabsContent value="analytics" className="space-y-4">
              <Analytics />
            </TabsContent>
          )}
        </Tabs>
      </Main>
      {isAdmin && <AIChatWidget />}
    </>
  )
}

function formatDate(value?: string | null) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString()
}
