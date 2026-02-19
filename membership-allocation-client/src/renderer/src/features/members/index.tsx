import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/members-columns'
import { MembersDialogs } from './components/members-dialogs'
import { MembersPrimaryButtons } from './components/members-primary-buttons'
import { MembersProvider } from './components/members-provider'
import { MembersTable } from './components/members-table'
import { type Member } from './data/schema'
import { type ApiMember } from '@/api/types/member.types'
import { IsUserOnline } from '@/components/is-user-online'
import { ConfigDrawer } from '@/components/config-drawer'

const route = getRouteApi('/_authenticated/members/')

export function Members() {
  const search = route.useSearch()
  const { membersResponse } = route.useLoaderData()

  // Transform API response to match frontend Member schema
  const members: Member[] = (membersResponse?.data?.members || []).map((apiMember: ApiMember) => ({
    _id: apiMember._id,
    user: apiMember.user,
    firstName: apiMember.firstName,
    lastName: apiMember.lastName,
    dob: apiMember.dob,
    membershipId: apiMember.membershipId,
    entryYear: apiMember.entryYear,
    paymentStatus: apiMember.paymentStatus,
    memberStatus: apiMember.memberStatus,
    dependents: apiMember.dependents || [],
    createdAt: apiMember.createdAt
  }))

  const totalResults = membersResponse?.results || 0
  const pageSize = search.pageSize || 10
  const pageCount = Math.ceil(totalResults / pageSize)

  return (
    <MembersProvider>
      <Header fixed>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <IsUserOnline />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Members</h2>
            <p className="text-muted-foreground">Manage your organization members here.</p>
          </div>
          <MembersPrimaryButtons />
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <MembersTable data={members} columns={columns} pageCount={pageCount} />
        </div>
      </Main>

      <MembersDialogs />
    </MembersProvider>
  )
}

export { type Member } from './data/schema'
