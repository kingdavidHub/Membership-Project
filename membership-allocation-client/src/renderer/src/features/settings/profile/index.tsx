import { Route } from '@/routes/_authenticated/settings/index'
import { ContentSection } from '../components/content-section'
import { ProfileForm } from './profile-form'

export function SettingsProfile() {
  const { userProfile } = Route.useLoaderData()

  return (
    <ContentSection title="Profile" desc="This is how others will see you on the site.">
      <ProfileForm userProfile={userProfile} />
    </ContentSection>
  )
}
