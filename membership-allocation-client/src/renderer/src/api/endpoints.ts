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
    PROFILE: '/users/me',
    DETAILS: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/admin/${id}`,
    CHANGE_ROLE: () => `/users/admin/change-user-role`,
    CHANGE_PASSWORD: (id: string) => `/users/${id}/change-password`,
    CURRENT_PROFILE: '/users/me'
  },

  // Members
  MEMBERS: {
    LIST: '/members',
    DETAILS: (id: string) => `/members/${id}`,
    UPDATE_MEMBER: (id: string) => `/members/${id}`,
    UPDATE_MEMBER_STATUS_BULK: '/members/changeMemberStatus/bulk',
    DELETE: (id: string) => `/members/${id}`,
    CREATE: '/members',
    MEMBERS_BIRTHDAY_MONTH: (month: number) => `/members/birthdays/${month}`
  },

  // Dependents
  DEPENDENTS: {
    CREATE: (memberId: string) => `/members/${memberId}/dependents`,
    UPDATE: (memberId: string, dependentId: string) =>
      `/members/${memberId}/dependents/${dependentId}`,
    DELETE: (memberId: string) => `/members/${memberId}/dependents`
  },

  // Reports
  REPORTS: {
    SEND_MEMBERS_MESSAGE: '/reports/sendMembersMessage'
  }
} as const

export default API_ENDPOINTS
