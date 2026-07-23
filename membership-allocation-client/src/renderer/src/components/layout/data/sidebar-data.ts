import {
  Construction,
  LayoutDashboard,
  Monitor,
  Bug,
  ListTodo,
  FileX,
  HelpCircle,
  Lock,
  Bell,
  Palette,
  ServerOff,
  Settings,
  Wrench,
  UserCog,
  UserX,
  Users,
  ShieldCheck,
  Command,
  Flame,
  CreditCard,
  UsersRound
} from 'lucide-react'
import { type SidebarData, type NavCollapsible, type NavItem } from '../types'
import { UserRole } from '@/stores/auth-store'

export const sidebarData: SidebarData = {
  // user: {
  //   name: 'satnaing',
  //   email: 'satnaingdev@gmail.com',
  //   avatar: '/avatars/shadcn.jpg'
  // },
  teams: [
    {
      name: 'Membership Allocation',
      logo: Command
    }
    // {
    //   name: 'Acme Inc',
    //   logo: GalleryVerticalEnd,
    //   plan: 'Enterprise'
    // },
    // {
    //   name: 'Acme Corp.',
    //   logo: AudioWaveform,
    //   plan: 'Startup'
    // }
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard
        },
        ...(import.meta.env.DEV
          ? [
              {
                title: 'Tasks',
                url: '/tasks',
                icon: ListTodo
              }
            ]
          : []),
        // {
        //   title: 'Apps',
        //   url: '/apps',
        //   icon: Package
        // },
        // {
        //   title: 'Chats',
        //   url: '/chats',
        //   badge: '3',
        //   icon: MessagesSquare
        // },
        {
          title: 'Users',
          url: '/users',
          icon: Users,
          roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN]
        },
        {
          title: 'Members',
          url: '/members',
          icon: Flame,
          roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN]
        },
        {
          title: 'Payment Summary',
          url: '/member/payments',
          icon: CreditCard,
          roles: [UserRole.USER]
        },
        {
          title: 'Dependents',
          url: '/member/dependents',
          icon: UsersRound,
          roles: [UserRole.USER]
        }
        // {
        //   title: 'Secured by Clerk',
        //   icon: ClerkLogo,
        //   items: [
        //     {
        //       title: 'Sign In',
        //       url: '/clerk/sign-in'
        //     },
        //     {
        //       title: 'Sign Up',
        //       url: '/clerk/sign-up'
        //     },
        //     {
        //       title: 'User Management',
        //       url: '/clerk/user-management'
        //     }
        //   ]
        // }
      ]
    },
    ...(import.meta.env.DEV
      ? [
          {
            title: 'Pages',
            items: [
              {
                title: 'Auth',
                icon: ShieldCheck,
                items: [
                  {
                    title: 'Sign In',
                    url: '/sign-in'
                  },
                  {
                    title: 'Sign In (2 Col)',
                    url: '/sign-in-2'
                  },
                  {
                    title: 'Sign Up',
                    url: '/sign-up'
                  },
                  {
                    title: 'Forgot Password',
                    url: '/forgot-password'
                  },
                  {
                    title: 'OTP',
                    url: '/otp'
                  }
                ]
              },
              {
                title: 'Errors',
                icon: Bug,
                items: [
                  {
                    title: 'Unauthorized',
                    url: '/errors/unauthorized',
                    icon: Lock
                  },
                  {
                    title: 'Forbidden',
                    url: '/errors/forbidden',
                    icon: UserX
                  },
                  {
                    title: 'Not Found',
                    url: '/errors/not-found',
                    icon: FileX
                  },
                  {
                    title: 'Internal Server Error',
                    url: '/errors/internal-server-error',
                    icon: ServerOff
                  },
                  {
                    title: 'Maintenance Error',
                    url: '/errors/maintenance-error',
                    icon: Construction
                  }
                ]
              }
            ]
          }
        ]
      : []),
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: UserCog
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: Wrench
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: Palette
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: Bell
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: Monitor
            }
          ]
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: HelpCircle
        }
      ]
    }
  ]
}

const isNavCollapsible = (item: NavItem): item is NavCollapsible => {
  return 'items' in item && Array.isArray((item as NavCollapsible).items)
}

const filterNavItems = (items: NavItem[], role?: UserRole): NavItem[] => {
  const hasRoleAccess = (allowedRoles?: UserRole[]) => {
    if (!allowedRoles || allowedRoles.length === 0) return true
    if (!role) return false
    return allowedRoles.includes(role)
  }

  const filtered: NavItem[] = []

  for (const item of items) {
    if (isNavCollapsible(item)) {
      const filteredItems = item.items.filter((subItem) => {
        if (subItem.memberOnly && role !== UserRole.USER) return false
        return hasRoleAccess(subItem.roles)
      })

      if (filteredItems.length > 0) {
        filtered.push({ ...item, items: filteredItems })
      }

      continue
    }

    if (item.memberOnly && role !== UserRole.USER) continue
    if (!hasRoleAccess(item.roles)) continue

    filtered.push(item)
  }

  return filtered
}

export const getSidebarNavGroups = (role?: UserRole) => {
  return sidebarData.navGroups
    .map((group) => ({
      ...group,
      items: filterNavItems(group.items, role)
    }))
    .filter((group) => group.items.length > 0)
}
