import { UserRole } from '@/stores/auth-store'

/**
 * Authentication API Types
 */

// Login
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  status: string
  token: string
  data: {
    user: {
      _id: string
      name: string
      email: string
      role: UserRole
      active: boolean
    }
  }
}

// Register
export interface RegisterRequest {
  name: string
  email: string
  password: string
  role?: UserRole
}

export interface RegisterResponse {
  status: string
  message: string
  data: {
    user: {
      _id: string
      name: string
      email: string
      role: UserRole
      active: boolean
    }
  }
}

// Forgot Password
export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
}

// Reset Password
export interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

export interface ResetPasswordResponse {
  message: string
}

// Profile
export interface UserProfile {
  _id: string
  name: string
  email: string
  role: UserRole
  active: boolean
  avatar?: string
  createdAt?: string
  updatedAt?: string
}

export interface UpdateProfileRequest {
  name?: string
  email?: string
  avatar?: string
}

// Update Password
export interface UpdatePasswordRequest {
  oldPassword: string
  newPassword: string
}

export interface UpdatePasswordResponse {
  status: string
  message: string
}
