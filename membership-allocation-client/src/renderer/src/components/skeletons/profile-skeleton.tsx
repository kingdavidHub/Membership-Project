import { Skeleton } from '@/components/ui/skeleton'

/** Skeleton for the profile dropdown button */
export function ProfileDropdownSkeleton() {
  return <Skeleton className="h-8 w-8 rounded-full" />
}

/** Skeleton for the sidebar user info section */
export function SidebarUserSkeleton() {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5">
      <Skeleton className="h-8 w-8 rounded-lg" />
      <div className="flex flex-1 flex-col gap-1">
        <Skeleton className="h-3.5 w-25" />
        <Skeleton className="h-3 w-35" />
      </div>
    </div>
  )
}

/** Skeleton for the sidebar navigation while the user's role is loading */
export function SidebarNavSkeleton() {
  const rows = [4, 3]
  return (
    <div aria-hidden className="flex flex-col gap-2">
      {rows.map((count, groupIndex) => (
        <div key={groupIndex} className="flex w-full flex-col p-2">
          <Skeleton className="mb-2 ml-2 h-3.5 w-14" />
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex h-8 items-center gap-2 rounded-md px-2">
              <Skeleton className="size-4 shrink-0" />
              <Skeleton className={`h-3.5 ${['w-24', 'w-20', 'w-28', 'w-16'][i % 4]}`} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

/** Skeleton for the settings profile form */
export function ProfileFormSkeleton() {
  return (
    <div className="space-y-8">
      {/* Username field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-15" />
        <Skeleton className="h-9 w-full max-w-md" />
        <Skeleton className="h-3 w-75" />
      </div>
      {/* Email field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-9 w-full max-w-md" />
        <Skeleton className="h-3 w-65" />
      </div>
      {/* Bio field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-7.5" />
        <Skeleton className="h-20 w-full max-w-md" />
        <Skeleton className="h-3 w-70" />
      </div>
      {/* URLs */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-3 w-75" />
        <Skeleton className="h-9 w-full max-w-md" />
        <Skeleton className="h-9 w-full max-w-md" />
        <Skeleton className="h-8 w-20" />
      </div>
      {/* Submit button */}
      <Skeleton className="h-9 w-30" />
    </div>
  )
}
