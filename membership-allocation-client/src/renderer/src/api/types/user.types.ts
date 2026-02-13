import { UserRole } from '@/stores/auth-store'

/**
 * User API Types
 */

export interface User {
  _id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  active: boolean
  createdAt?: string
  updatedAt?: string
}

export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'exempted'
export type MemberStatus = 'active' | 'inactive' | 'suspended'

export interface Member {
  _id: string
  user: string
  firstName: string
  lastName: string
  dob: string
  membershipId: string
  entryYear: number
  paymentStatus: PaymentStatus
  memberStatus: MemberStatus
  dependents: string[]
  createdAt: string
  __v: number
}

export interface UserProfile {
  _id: string
  name: string
  email: string
  role: UserRole
  member: Member
}

export interface CreateUserRequest {
  name: string
  email: string
  password: string
  role?: UserRole
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  role?: UserRole
  active?: boolean
}

export interface ChangeUserRoleRequest {
  role: UserRole
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
