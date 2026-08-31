import { Link, getRouteApi, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Button } from '@/components/ui/button'
import { columns } from './components/dependents-columns'
import { DependentsDialogs } from './components/dependents-dialogs'
import { DependentsPrimaryButtons } from './components/dependents-primary-buttons'
import { DependentsProvider } from './components/dependents-provider'
import { DependentsTable } from './components/dependents-table'
import { type Dependent } from './data/schema'
import { useDependentsNavigationStore } from '@/stores/dependents-navigation-store'
import { IsUserOnline } from '@/components/is-user-online'

const route = getRouteApi('/_authenticated/members/$memberId/dependents')

export function Dependents() {
  const { memberId } = route.useParams()
  const navigate = useNavigate()
  const search = route.useSearch()
  const storeData = useDependentsNavigationStore((s) => s.data)

  // If the store has no data (e.g. direct URL access), redirect back to members
  useEffect(() => {
    if (!storeData || storeData.memberId !== memberId) {
      navigate({ to: '/members' })
    }
  }, [storeData, memberId, navigate])

  if (!storeData || storeData.memberId !== memberId) {
    return null
  }

  const { memberName, dependents: rawDependents } = storeData

  // Map to the frontend Dependent schema
  const dependents: Dependent[] = rawDependents.map((dep) => ({
    _id: dep._id,
    firstName: dep.firstName,
    lastName: dep.lastName,
    member: memberId,
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
            <div className="mb-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/members">
                  <ArrowLeft className="me-2 h-4 w-4" />
                  Back to Members
                </Link>
              </Button>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Dependents of {memberName}</h2>
            <p className="text-muted-foreground">Manage dependents for this member.</p>
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

export { type Dependent } from './data/schema'
