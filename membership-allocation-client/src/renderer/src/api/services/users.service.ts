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
    return (await apiClient.get(API_ENDPOINTS.USERS.LIST, { params })) as PaginatedResponse<User>
  },

  getUserProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get(API_ENDPOINTS.USERS.PROFILE)
    return (response as { data: { user: UserProfile } }).data.user
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: string): Promise<User> => {
    return (await apiClient.get(API_ENDPOINTS.USERS.DETAILS(id))) as User
  },

  /**
   * Create new user
   */
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    return (await apiClient.post(API_ENDPOINTS.USERS.LIST, userData)) as User
  },

  /**
   * Update user
   */
  updateUser: async (id: string, userData: UpdateUserRequest): Promise<User> => {
    return (await apiClient.patch(API_ENDPOINTS.USERS.UPDATE(id), userData)) as User
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
    return (await apiClient.patch(API_ENDPOINTS.USERS.CHANGE_ROLE(id), roleData)) as User
  },

  /**
   * Change user password
   */
  changePassword: async (id: string, passwordData: ChangePasswordRequest): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.USERS.CHANGE_PASSWORD(id), passwordData)
  },

  getCurrentUserProfile: async (): Promise<UserProfile> => {
    return (await apiClient.get(API_ENDPOINTS.USERS.CURRENT_PROFILE)) as UserProfile
  }
}

export default usersService
