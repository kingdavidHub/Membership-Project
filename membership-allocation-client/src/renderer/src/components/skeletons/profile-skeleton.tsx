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
