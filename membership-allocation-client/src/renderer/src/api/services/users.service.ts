import { apiClient } from '../client'
import { API_ENDPOINTS } from '../endpoints'
import type {
  User,
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRequest,
  ChangeUserRoleRequest,
  ChangePasswordRequest,
  UserProfile,
  UsersListResponse
} from '../types/user.types'

/**
 * Users Service
 * Handles all user management API calls
 */

export const usersService = {
  /**
   * Get paginated list of users
   */
  getUsers: async (page = 1, limit = 10): Promise<UsersListResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.USERS.LIST, {
      params: { page, limit }
    })
    return response as unknown as UsersListResponse
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
    const response = (await apiClient.post(
      API_ENDPOINTS.AUTH_ADMIN.CREATE_USER,
      userData
    )) as CreateUserResponse

    return response.data.user
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
  changeUserRole: async (roleData: ChangeUserRoleRequest): Promise<User> => {
    return (await apiClient.post(API_ENDPOINTS.USERS.CHANGE_ROLE(), roleData)) as User
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
