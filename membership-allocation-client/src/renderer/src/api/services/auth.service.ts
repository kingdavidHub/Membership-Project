import { apiClient } from '../client'
import { API_ENDPOINTS } from '../endpoints'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  UserProfile,
  UpdateProfileRequest,
  UpdatePasswordRequest,
  UpdatePasswordResponse
} from '../types/auth.types'

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

export const authService = {
  /**
   * Login user
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return (await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials)) as LoginResponse
  },

  /**
   * Register new user
   */
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    return (await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData)) as RegisterResponse
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    return (await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken })) as {
      accessToken: string
    }
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    return (await apiClient.post(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      email
    )) as ForgotPasswordResponse
  },

  /**
   * Reset password with token
   */
  resetPassword: async (resetData: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    return (await apiClient.post(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      resetData
    )) as ResetPasswordResponse
  },

  /**
   * Verify email address
   */
  verifyEmail: async (token: string): Promise<{ message: string }> => {
    return (await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token })) as { message: string }
  },

  /**
   * Resend verification email
   */
  resendVerification: async (email: string): Promise<{ message: string }> => {
    return (await apiClient.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, { email })) as {
      message: string
    }
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<UserProfile> => {
    return (await apiClient.get(API_ENDPOINTS.AUTH.PROFILE)) as UserProfile
  },

  /**
   * Update current user profile
   */
  updateProfile: async (profileData: UpdateProfileRequest): Promise<UserProfile> => {
    return (await apiClient.patch(API_ENDPOINTS.AUTH.PROFILE, profileData)) as UserProfile
  },

  /**
   * Update password
   */
  updatePassword: async (data: UpdatePasswordRequest): Promise<UpdatePasswordResponse> => {
    return (await apiClient.post(
      API_ENDPOINTS.AUTH.UPDATE_PASSWORD,
      data
    )) as UpdatePasswordResponse
  }
}

export default authService
