import { Link, useLocation } from '@tanstack/react-router'
import { ChevronsUpDown, LayoutDashboard, LogOut, Users, Flame, CreditCard, UsersRound } from 'lucide-react'
import useDialogState from '@/hooks/use-dialog-state'
import { useUserProfile } from '@/hooks/use-user-profile'
import { UserRole } from '@/stores/auth-store'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import { SignOutDialog } from '@/components/sign-out-dialog'

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase() || 'U'
}

type NavUserProps = {
  user: {
    name: string
    email: string
    avatar: string
  }
}

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar()
  const [open, setOpen] = useDialogState()
  const { userProfile } = useUserProfile()
  const role = userProfile?.role
  const href = useLocation({ select: (location) => location.href })

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                aria-label="User menu"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-start text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ms-auto size-4" aria-hidden="true" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? 'bottom' : 'right'}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-start text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" aria-current={href.split('?')[0] === '/dashboard' ? 'page' : undefined} className={href.split('?')[0] === '/dashboard' ? 'bg-secondary' : ''}>
                    <LayoutDashboard aria-hidden="true" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                {role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/users" aria-current={href.split('?')[0] === '/users' ? 'page' : undefined} className={href.split('?')[0] === '/users' ? 'bg-secondary' : ''}>
                        <Users aria-hidden="true" />
                        Users
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/members" aria-current={href.split('?')[0] === '/members' ? 'page' : undefined} className={href.split('?')[0] === '/members' ? 'bg-secondary' : ''}>
                        <Flame aria-hidden="true" />
                        Members
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/member/payments" aria-current={href.split('?')[0] === '/member/payments' ? 'page' : undefined} className={href.split('?')[0] === '/member/payments' ? 'bg-secondary' : ''}>
                        <CreditCard aria-hidden="true" />
                        Payment Summary
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/member/dependents" aria-current={href.split('?')[0] === '/member/dependents' ? 'page' : undefined} className={href.split('?')[0] === '/member/dependents' ? 'bg-secondary' : ''}>
                        <UsersRound aria-hidden="true" />
                        Dependents
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setOpen(true)}>
                <LogOut aria-hidden="true" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
