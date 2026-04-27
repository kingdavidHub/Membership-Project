import { getRouteApi } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { membersService } from '@/api/services'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useUserProfile } from '@/hooks/use-user-profile'
import { PaymentsPendingSkeleton } from '@/features/payments/components/payments-pending-skeleton'
import { PaymentsTable } from './components/payments-table'
import { type Payment } from '@/features/payments/data/schema'
import { IsUserOnline } from '@/components/is-user-online'

const route = getRouteApi('/_authenticated/member/payments')

export function MemberPayments() {
  const search = route.useSearch()
  const { userProfile, isLoading: isProfileLoading } = useUserProfile()
  const memberId = userProfile?.member?._id
  const memberName = userProfile?.member
    ? `${userProfile.member.firstName} ${userProfile.member.lastName}`.trim()
    : userProfile?.name || 'Member'
  const page = search.page || 1
  const pageSize = search.pageSize || 10

  const { data: paymentsResponse, isPending } = useQuery({
    queryKey: ['member-payments', memberId, page, pageSize],
    queryFn: () => membersService.getMemberPayments(memberId as string, page, pageSize),
    enabled: !!memberId
  })

  if (isProfileLoading || isPending) {
    return <PaymentsPendingSkeleton />
  }

  if (!memberId) {
    return (
      <>
        <Header fixed>
          <Search />
          <div className="ml-auto flex items-center space-x-4">
            <ThemeSwitch />
            <IsUserOnline />
            <ProfileDropdown />
          </div>
        </Header>

        <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Payment Summary</h2>
              <p className="text-muted-foreground">
                No member profile is linked to this account yet.
              </p>
            </div>
          </div>
        </Main>
      </>
    )
  }

  const payments: Payment[] = paymentsResponse?.data?.data || []
  const pageCount = Math.max(paymentsResponse?.totalPages || 0, 1)

  return (
    <>
      <Header fixed>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <IsUserOnline />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Payment Summary for {memberName}
            </h2>
            <p className="text-muted-foreground">Review your payment history.</p>
          </div>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <PaymentsTable data={payments} pageCount={pageCount} />
        </div>
      </Main>
    </>
  )
}
