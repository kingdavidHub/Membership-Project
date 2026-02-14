import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'
import { type User, type UserStatus } from './data/schema'

const route = getRouteApi('/_authenticated/users/')

// Generate random status for users (temporary until API supports it)
const getRandomStatus = (): UserStatus => {
  const statuses: UserStatus[] = ['active', 'inactive', 'invited', 'suspended']
  return statuses[Math.floor(Math.random() * statuses.length)]
}

// Generate random phone number (temporary until API supports it)
const getRandomPhone = (): string => {
  return `+1-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`
}

export function Users() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { usersResponse } = route.useLoaderData()

  // Transform API response to match frontend User schema
  const users: User[] = usersResponse.data.users.map((apiUser) => ({
    _id: apiUser._id,
    name: apiUser.name,
    email: apiUser.email,
    role: apiUser.role,
    member: apiUser.member,
    passwordGenerateCount: apiUser.passwordGenerateCount,
    isGeneratedPassword: apiUser.isGeneratedPassword,
    passwordChangedAt: apiUser.passwordChangedAt,
    // Frontend-only fields (random for now)
    phoneNumber: getRandomPhone(),
    status: getRandomStatus()
  }))

  const totalResults = usersResponse.results

  return (
    <UsersProvider>
      <Header fixed>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">User List</h2>
            <p className="text-muted-foreground">Manage your users and their roles here.</p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <UsersTable data={users} totalCount={totalResults} search={search} navigate={navigate} />
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
