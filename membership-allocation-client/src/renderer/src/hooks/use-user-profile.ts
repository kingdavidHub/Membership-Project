import { useQuery } from '@tanstack/react-query'
import { usersService } from '@/api/services'
import { type UserProfile } from '@/api/types/user.types'

/**
 * Shared hook to fetch the current user's profile.
 * Uses React Query so the data is fetched once and cached/shared
 * across all components that call this hook.
 */
export function useUserProfile() {
  const query = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: () => usersService.getUserProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })

  return {
    userProfile: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error
  }
}
