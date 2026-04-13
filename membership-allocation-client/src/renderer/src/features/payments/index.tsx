import { Link, getRouteApi, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { membersService } from '@/api/services'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { usePaymentsNavigationStore } from '@/stores/payments-navigation-store'
import { PaymentsActionDialog } from './components/payments-action-dialog'
import { PaymentsPrimaryButtons } from './components/payments-primary-buttons'
import { PaymentsPendingSkeleton } from './components/payments-pending-skeleton'
import { PaymentsTable } from './components/payments-table'
import { type Payment } from './data/schema'

const route = getRouteApi('/_authenticated/members/$memberId/payments')

export function Payments() {
  const { memberId } = route.useParams()
  const search = route.useSearch()
  const navigate = useNavigate()
  const storeData = usePaymentsNavigationStore((state) => state.data)
  const [addPaymentOpen, setAddPaymentOpen] = useState(false)
  const hasMemberContext = !!storeData && storeData.memberId === memberId
  const page = search.page || 1
  const pageSize = search.pageSize || 10

  const { data: paymentsResponse, isPending } = useQuery({
    queryKey: ['member-payments', memberId, page, pageSize],
    queryFn: () => membersService.getMemberPayments(memberId, page, pageSize),
    enabled: hasMemberContext
  })

  useEffect(() => {
    if (!storeData || storeData.memberId !== memberId) {
      navigate({ to: '/members' })
    }
  }, [storeData, memberId, navigate])

  if (!storeData || storeData.memberId !== memberId) {
    return null
  }

  if (isPending || !paymentsResponse) {
    return <PaymentsPendingSkeleton />
  }

  const { memberName } = storeData
  const payments: Payment[] = paymentsResponse?.data?.data || []
  const pageCount = Math.max(paymentsResponse?.totalPages || 0, 1)

  return (
    <>
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
            <div className="mb-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/members">
                  <ArrowLeft className="me-2 h-4 w-4" />
                  Back to Members
                </Link>
              </Button>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Payment Summary for {memberName}</h2>
            <p className="text-muted-foreground">Review payment history for this member.</p>
          </div>
          <PaymentsPrimaryButtons onClick={() => setAddPaymentOpen(true)} />
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <PaymentsTable data={payments} pageCount={pageCount} />
        </div>
      </Main>

      <PaymentsActionDialog
        memberId={memberId}
        memberName={memberName}
        open={addPaymentOpen}
        onOpenChange={setAddPaymentOpen}
      />
    </>
  )
}

export { type Payment } from './data/schema'
