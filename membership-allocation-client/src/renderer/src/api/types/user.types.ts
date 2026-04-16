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

export type PaymentStatus = 'pending' | 'paid'
export type MemberStatus = 'active' | 'inactive' | 'deceased'

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
  member?: Member
}

export interface CreateUserRequest {
  name: string
  email: string
}

export interface CreateUserResponse {
  status: string
  data: {
    user: User
  }
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  role?: UserRole
  active?: boolean
}

export interface ChangeUserRoleRequest {
  id: string
  role: UserRole
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface CreateMemberForUserRequest {
  firstName: string
  lastName: string
  dob: string
  membershipId: string
  entryYear: number
}

// API Response for users list
export interface ApiUser {
  _id: string
  name: string
  email: string
  role: 'super-admin' | 'admin' | 'member'
  member: string | null
  passwordGenerateCount?: number
  isGeneratedPassword?: boolean
  passwordChangedAt?: string
}

export interface UsersListResponse {
  status: string
  results: number
  data: {
    users: ApiUser[]
  }
}
