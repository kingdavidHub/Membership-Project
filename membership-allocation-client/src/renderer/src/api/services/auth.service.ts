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
  UpdateProfileRequest
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
    const { data } = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials)
    return data
  },

  /**
   * Register new user
   */
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    const { data } = await apiClient.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, userData)
    return data
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
    const { data } = await apiClient.post<{ accessToken: string }>(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN,
      { refreshToken }
    )
    return data
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    const { data } = await apiClient.post<ForgotPasswordResponse>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      email
    )
    return data
  },

  /**
   * Reset password with token
   */
  resetPassword: async (resetData: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    const { data } = await apiClient.post<ResetPasswordResponse>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      resetData
    )
    return data
  },

  /**
   * Verify email address
   */
  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post<{ message: string }>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
      token
    })
    return data
  },

  /**
   * Resend verification email
   */
  resendVerification: async (email: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH.RESEND_VERIFICATION,
      { email }
    )
    return data
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<UserProfile> => {
    const { data } = await apiClient.get<UserProfile>(API_ENDPOINTS.AUTH.PROFILE)
    return data
  },

  /**
   * Update current user profile
   */
  updateProfile: async (profileData: UpdateProfileRequest): Promise<UserProfile> => {
    const { data } = await apiClient.patch<UserProfile>(API_ENDPOINTS.AUTH.PROFILE, profileData)
    return data
  }
}

export default authService
