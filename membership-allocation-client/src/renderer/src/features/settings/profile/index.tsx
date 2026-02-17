import { useUserProfile } from '@/hooks/use-user-profile'
import { ProfileFormSkeleton } from '@/components/skeletons'
import { ContentSection } from '../components/content-section'
import { ProfileForm } from './profile-form'

export function SettingsProfile() {
  const { userProfile, isLoading } = useUserProfile()

  if (isLoading || !userProfile) {
    return (
      <ContentSection title="Profile" desc="This is how others will see you on the site.">
        <ProfileFormSkeleton />
      </ContentSection>
    )
  }

  return (
    <ContentSection title="Profile" desc="This is how others will see you on the site.">
      <ProfileForm userProfile={userProfile} />
    </ContentSection>
  )
}
