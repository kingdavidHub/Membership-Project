/**
 * Shared API Types
 * Common types used across API services
 */

// Generic API Response wrapper
export interface ApiResponse<T = any> {
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
