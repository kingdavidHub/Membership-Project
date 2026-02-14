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
import { type Member, type PaymentStatus, type MemberStatus } from './data/schema'

const route = getRouteApi('/_authenticated/members/')

// Generate random payment status for members (temporary until API supports it)
const getRandomPaymentStatus = (): PaymentStatus => {
  const statuses: PaymentStatus[] = ['pending', 'paid', 'overdue', 'exempted']
  return statuses[Math.floor(Math.random() * statuses.length)]
}

// Generate random member status (temporary until API supports it)
const getRandomMemberStatus = (): MemberStatus => {
  const statuses: MemberStatus[] = ['active', 'inactive', 'suspended']
  return statuses[Math.floor(Math.random() * statuses.length)]
}

export function Members() {
  const search = route.useSearch()
  const { membersResponse } = route.useLoaderData()

  // Transform API response to match frontend Member schema
  const members: Member[] = (membersResponse?.data?.members || []).map(
    (apiMember: Record<string, unknown>) => ({
      _id: apiMember._id as string,
      firstName: (apiMember.firstName as string) || '',
      lastName: (apiMember.lastName as string) || '',
      email: apiMember.email as string | undefined,
      phoneNumber: apiMember.phoneNumber as string | undefined,
      membershipId: (apiMember.membershipId as string) || '',
      entryYear: (apiMember.entryYear as number) || new Date().getFullYear(),
      dob: apiMember.dob as string | undefined,
      paymentStatus: (apiMember.paymentStatus as PaymentStatus) || getRandomPaymentStatus(),
      memberStatus: (apiMember.memberStatus as MemberStatus) || getRandomMemberStatus()
    })
  )

  const totalResults = membersResponse?.results || 0
  const pageSize = search.pageSize || 10
  const pageCount = Math.ceil(totalResults / pageSize)

  return (
    <MembersProvider>
      <Header fixed>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
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
