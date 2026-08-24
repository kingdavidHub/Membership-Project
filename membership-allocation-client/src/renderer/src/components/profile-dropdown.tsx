import { Link, useLocation } from '@tanstack/react-router'
import { LayoutDashboard, Users, Flame, CreditCard, UsersRound } from 'lucide-react'
import useDialogState from '@/hooks/use-dialog-state'
import { useUserProfile } from '@/hooks/use-user-profile'
import { UserRole } from '@/stores/auth-store'
import { ProfileDropdownSkeleton } from '@/components/skeletons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { SignOutDialog } from '@/components/sign-out-dialog'

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase() || 'U'
}

export function ProfileDropdown() {
  const { userProfile, isLoading } = useUserProfile()
  const [open, setOpen] = useDialogState()
  const href = useLocation({ select: (location) => location.href })
  const role = userProfile?.role

  if (isLoading) {
    return <ProfileDropdownSkeleton />
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" aria-label="User menu" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/01.png" alt={userProfile?.name} />
              <AvatarFallback>
                {getInitials(userProfile?.name || '')}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-1.5">
              <p className="text-sm leading-none font-medium">{userProfile?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{userProfile?.email}</p>
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
          <DropdownMenuSeparator />            <DropdownMenuItem variant="destructive" onClick={() => setOpen(true)}>
              Sign out
              <DropdownMenuShortcut className="text-current" aria-hidden="true">⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
