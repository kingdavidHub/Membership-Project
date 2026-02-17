import { useUserProfile } from '@/hooks/use-user-profile'
import { ContentSection } from '../components/content-section'
import { ProfileForm } from './profile-form'

export function SettingsProfile() {
  const { userProfile, isLoading } = useUserProfile()

  if (isLoading || !userProfile) {
    return (
      <ContentSection title="Profile" desc="This is how others will see you on the site.">
        <div className="text-muted-foreground text-sm">Loading profile...</div>
      </ContentSection>
    )
  }

  return (
    <ContentSection title="Profile" desc="This is how others will see you on the site.">
      <ProfileForm userProfile={userProfile} />
    </ContentSection>
  )
}
