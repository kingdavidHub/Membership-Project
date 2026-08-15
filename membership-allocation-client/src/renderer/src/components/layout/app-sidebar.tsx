import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from '@/components/ui/sidebar'
// import { AppTitle } from './app-title'
import { getSidebarNavGroups, sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'
import { useUserProfile } from '@/hooks/use-user-profile'
import { SidebarNavSkeleton, SidebarUserSkeleton } from '@/components/skeletons'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { userProfile, isLoading } = useUserProfile()
  const navGroups = getSidebarNavGroups(userProfile?.role)

  const authenticatedUser = {
    name: userProfile?.name || 'Guest User',
    email: userProfile?.email || '',
    avatar: '/avatars/shadcn.jpg'
  }

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />

        {/* Replace <TeamSwitch /> with the following <AppTitle />
         /* if you want to use the normal app title instead of TeamSwitch dropdown */}
        {/* <AppTitle /> */}
      </SidebarHeader>
      <SidebarContent>
        {isLoading ? (
          <SidebarNavSkeleton />
        ) : (
          navGroups.map((props) => <NavGroup key={props.title} {...props} />)
        )}
      </SidebarContent>
      <SidebarFooter>
        {isLoading ? <SidebarUserSkeleton /> : <NavUser user={authenticatedUser} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
