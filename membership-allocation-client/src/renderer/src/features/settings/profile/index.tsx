import { getRouteApi } from '@tanstack/react-router'
import { ContentSection } from '../components/content-section'
import { ProfileForm } from './profile-form'

const route = getRouteApi('/_authenticated')

export function SettingsProfile() {
  const { userProfile } = route.useLoaderData()

  return (
    <ContentSection title="Profile" desc="This is how others will see you on the site.">
      <ProfileForm userProfile={userProfile} />
    </ContentSection>
  )
}
