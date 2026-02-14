import { apiClient } from '../client'
import { API_ENDPOINTS } from '../endpoints'
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  ChangeUserRoleRequest,
  ChangePasswordRequest,
  UserProfile
} from '../types/user.types'
import type { PaginatedResponse, PaginationParams } from '../types'

/**
 * Users Service
 * Handles all user management API calls
 */

export const usersService = {
  /**
   * Get paginated list of users
   */
  getUsers: async (params?: PaginationParams): Promise<PaginatedResponse<User>> => {
    const { data } = await apiClient.get<PaginatedResponse<User>>(API_ENDPOINTS.USERS.LIST, {
      params
    })
    return data
  },

  getUserProfile: async (): Promise<UserProfile> => {
    const { data } = await apiClient.get<Omit<UserProfile, 'member'>>(API_ENDPOINTS.USERS.PROFILE)
    return data
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: string): Promise<User> => {
    const { data } = await apiClient.get<User>(API_ENDPOINTS.USERS.DETAILS(id))
    return data
  },

  /**
   * Create new user
   */
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const { data } = await apiClient.post<User>(API_ENDPOINTS.USERS.LIST, userData)
    return data
  },

  /**
   * Update user
   */
  updateUser: async (id: string, userData: UpdateUserRequest): Promise<User> => {
    const { data } = await apiClient.patch<User>(API_ENDPOINTS.USERS.UPDATE(id), userData)
    return data
  },

  /**
   * Delete user
   */
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id))
  },

  /**
   * Change user role
   */
  changeUserRole: async (id: string, roleData: ChangeUserRoleRequest): Promise<User> => {
    const { data } = await apiClient.patch<User>(API_ENDPOINTS.USERS.CHANGE_ROLE(id), roleData)
    return data
  },

  /**
   * Change user password
   */
  changePassword: async (id: string, passwordData: ChangePasswordRequest): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.USERS.CHANGE_PASSWORD(id), passwordData)
  },

  getCurrentUserProfile: async (): Promise<UserProfile> => {
    const { data } = await apiClient.get<UserProfile>(API_ENDPOINTS.USERS.CURRENT_PROFILE)
    return data
  }
}

export default usersService
