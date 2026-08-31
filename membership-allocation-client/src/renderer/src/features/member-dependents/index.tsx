import { getRouteApi } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { membersService } from '@/api/services'
import { useUserProfile } from '@/hooks/use-user-profile'
import { DependentsPendingSkeleton } from '@/features/dependents/components/dependents-pending-skeleton'
import { DependentsDialogs } from '@/features/dependents/components/dependents-dialogs'
import { DependentsPrimaryButtons } from '@/features/dependents/components/dependents-primary-buttons'
import { DependentsProvider } from '@/features/dependents/components/dependents-provider'
import { DependentsTable } from '@/features/dependents/components/dependents-table'
import { columns } from '@/features/dependents/components/dependents-columns'
import { type Dependent } from '@/features/dependents/data/schema'
import { IsUserOnline } from '@/components/is-user-online'

const route = getRouteApi('/_authenticated/member/dependents')

export function MemberDependents() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { userProfile, isLoading: isProfileLoading } = useUserProfile()
  const memberProfile = userProfile?.member
  const memberId = memberProfile?._id
  const memberName = memberProfile
    ? `${memberProfile.firstName} ${memberProfile.lastName}`.trim()
    : userProfile?.name || 'Member'

  const { data: dependentsResponse, isPending: isDependentsPending } = useQuery({
    queryKey: ['dependents', memberId],
    queryFn: () => membersService.getMemberDependents(memberId as string),
    enabled: !!memberId
  })

  if (isProfileLoading || isDependentsPending) {
    return <DependentsPendingSkeleton />
  }

  if (!memberId) {
    return (
      <>
        <Header fixed>
          <Search />
          <div className="ml-auto flex items-center space-x-4">
            <ThemeSwitch />
            <ConfigDrawer />
            <IsUserOnline />
            <ProfileDropdown />
          </div>
        </Header>

        <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Dependents</h2>
              <p className="text-muted-foreground">
                No member profile is linked to this account yet.
              </p>
            </div>
          </div>
        </Main>
      </>
    )
  }

  const rawDependents = dependentsResponse?.data?.dependents ?? []

  const dependents: Dependent[] = rawDependents.map((dep) => ({
    _id: dep._id,
    firstName: dep.firstName,
    lastName: dep.lastName,
    member: dep.member || memberId,
    relationship: (dep.relationship ?? dep.relation) as Dependent['relationship'],
    memberName,
    createdAt: dep.createdAt
  }))

  return (
    <DependentsProvider memberId={memberId}>
      <Header fixed>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <IsUserOnline />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Dependents of {memberName}</h2>
            <p className="text-muted-foreground">Manage your dependents here.</p>
          </div>
          <DependentsPrimaryButtons />
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <DependentsTable data={dependents} columns={columns} search={search} navigate={navigate} />
        </div>
      </Main>
      <DependentsDialogs />
    </DependentsProvider>
  )
}
