import { ContentSection } from '../components/content-section'
import { PasswordForm } from './password-form'

export function SettingsPassword() {
  return (
    <ContentSection
      title="Password"
      desc="Update your password. Enter your current password and a new password."
    >
      <PasswordForm />
    </ContentSection>
  )
}
