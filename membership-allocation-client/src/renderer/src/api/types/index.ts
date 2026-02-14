/**
 * Shared API Types
 * Common types used across API services
 */

// Generic API Response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
}

// Pagination
export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// Common Error Response
export interface ApiErrorResponse {
  success: false
  message: string
  error?: string
  errors?: Record<string, string[]>
}

// Re-export member types
export type {
  ApiMember,
  Dependent,
  MembersListResponse,
  MemberDetailResponse,
  CreateMemberRequest,
  UpdateMemberRequest,
  UpdateMemberStatusBulkRequest,
  BirthdayMembersResponse,
  PaymentStatus as MemberPaymentStatus,
  MemberStatus as MemberMemberStatus
} from './member.types'
