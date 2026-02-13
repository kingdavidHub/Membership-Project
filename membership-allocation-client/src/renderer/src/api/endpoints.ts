/**
 * API Endpoints Configuration
 * Centralized endpoint definitions for all API services
 */

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgotPassword',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
    PROFILE: '/auth/profile'
  },

  // Users
  USERS: {
    LIST: '/users',
    DETAILS: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    CHANGE_ROLE: (id: string) => `/users/${id}/role`,
    CHANGE_PASSWORD: (id: string) => `/users/${id}/change-password`,
    CURRENT_PROFILE: '/users/me'
  }
} as const

export default API_ENDPOINTS
