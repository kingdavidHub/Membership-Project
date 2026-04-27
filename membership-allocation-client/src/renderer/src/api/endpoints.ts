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
    PROFILE: '/auth/profile',
    UPDATE_PASSWORD: '/auth/updatePassword'
  },

  // Users
  USERS: {
    LIST: '/users',
    UNREGISTERED: '/users/unregistered',
    PROFILE: '/users/me',
    DETAILS: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    CREATE_MEMBER: (id: string) => `/users/admin/${id}`,
    DELETE: (id: string) => `/users/admin/${id}`,
    CHANGE_ROLE: () => `/users/admin/change-user-role`,
    CHANGE_PASSWORD: (id: string) => `/users/${id}/change-password`,
    CURRENT_PROFILE: '/users/me'
  },

  AUTH_ADMIN: {
    CREATE_USER: '/auth/admin/create-user'
  },

  // Members
  MEMBERS: {
    LIST: '/members',
    DETAILS: (id: string) => `/members/${id}`,
    UPDATE_MEMBER: (id: string) => `/members/${id}`,
    UPDATE_MEMBER_STATUS_BULK: '/members/changeMemberStatus/bulk',
    UPDATE_MEMBER_PAYMENT_STATUS_BULK: '/members/changePaymentStatus/bulk',
    DELETE: (id: string) => `/members/${id}`,
    CREATE: '/members',
    MEMBERS_BIRTHDAY_MONTH: (month: number) => `/members/birthdays/${month}`
  },

  // Dependents
  DEPENDENTS: {
    LIST: (memberId: string) => `/members/${memberId}/dependents`,
    CREATE: (memberId: string) => `/members/${memberId}/dependents`,
    UPDATE: (memberId: string, dependentId: string) =>
      `/members/${memberId}/dependents/${dependentId}`,
    DELETE: (memberId: string) => `/members/${memberId}/dependents`
  },

  // Payments
  PAYMENTS: {
    LIST: (memberId: string) => `/members/${memberId}/payments`,
    CREATE: (memberId: string) => `/members/${memberId}/payments`
  },

  // Reports
  REPORTS: {
    SEND_MEMBERS_MESSAGE: '/reports/sendMembersMessage'
  }
} as const

export default API_ENDPOINTS
