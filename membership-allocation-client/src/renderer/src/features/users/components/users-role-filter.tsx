'use client'

import { type Table } from '@tanstack/react-table'
import { Shield, UserCheck, Users, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { type User } from '../data/schema'

const roleOptions = [
  { label: 'Super Admin', value: 'super-admin', icon: Shield },
  { label: 'Admin', value: 'admin', icon: UserCheck },
  { label: 'Member', value: 'member', icon: Users }
] as const

type UsersRoleFilterProps = {
  table: Table<User>
}

export function UsersRoleFilter({ table }: UsersRoleFilterProps) {
  const roleColumn = table.getColumn('role')

  const rawRole = roleColumn?.getFilterValue()
  const activeRoles: string[] = Array.isArray(rawRole)
    ? rawRole
    : rawRole
      ? [rawRole as string]
      : []

  const isAll = activeRoles.length === 0

  const setRoleFilter = (value: string) => {
    roleColumn?.setFilterValue([value])
  }

  const clearAll = () => {
    table.setColumnFilters([])
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Role</span>
          {activeRoles.length > 0 && (
            <span className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {activeRoles.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="start">
        <div className="space-y-3">
          {/* All Users */}
          <Button
            variant={isAll ? 'default' : 'ghost'}
            size="sm"
            className="w-full justify-start"
            onClick={clearAll}
          >
            All Users
          </Button>

          <Separator />

          {/* Roles */}
          <div className="space-y-1.5">
            <p className="px-1 text-xs font-medium text-muted-foreground">Role</p>
            <div className="flex flex-wrap gap-1.5">
              {roleOptions.map((role) => {
                const isActive = activeRoles.includes(role.value)
                return (
                  <Button
                    key={role.value}
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    className={cn('h-7 text-xs', isActive && 'pointer-events-none')}
                    onClick={() => setRoleFilter(role.value)}
                  >
                    {role.label}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
