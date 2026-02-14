import { Link, getRouteApi } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { columns } from './components/dependents-columns'
import { DependentsDialogs } from './components/dependents-dialogs'
import { DependentsProvider } from './components/dependents-provider'
import { DependentsTable } from './components/dependents-table'
import { type Dependent } from './data/schema'
import { type ApiMember } from '@/api/types/member.types'

const route = getRouteApi('/_authenticated/members/dependents/')

export function Dependents() {
  const { membersResponse } = route.useLoaderData()

  // Flatten all dependents from all members with member name enrichment
  const dependents: Dependent[] = (membersResponse?.data?.members || []).flatMap(
    (member: ApiMember) =>
      (member.dependents || []).map((dep) => ({
        _id: dep._id,
        firstName: dep.firstName,
        lastName: dep.lastName,
        member: member._id,
        memberName: `${member.firstName} ${member.lastName}`,
        createdAt: dep.createdAt
      }))
  )

  return (
    <DependentsProvider>
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
            <h2 className="text-2xl font-bold tracking-tight">Dependents</h2>
            <p className="text-muted-foreground">View all dependents across all members.</p>
          </div>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <DependentsTable data={dependents} columns={columns} />
        </div>
      </Main>

      <DependentsDialogs />
    </DependentsProvider>
  )
}

export { type Dependent } from './data/schema'
