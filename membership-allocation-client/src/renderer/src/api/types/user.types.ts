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
