import { apiClient } from '../client'
import { API_ENDPOINTS } from '../endpoints'
import type {
  ApiMember,
  MembersListResponse,
  MemberDetailResponse,
  CreateMemberRequest,
  UpdateMemberRequest,
  UpdateMemberStatusBulkRequest,
  BirthdayMembersResponse,
  Dependent,
  DependentDetailResponse,
  CreateDependentRequest,
  UpdateDependentRequest
} from '../types/member.types'

/**
 * Members Service
 * Handles all member management API calls
 */

export const membersService = {
  /**
   * Get paginated list of members
   */
  getMembers: async (page = 1, limit = 10): Promise<MembersListResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.MEMBERS.LIST, {
      params: { page, limit }
    })
    return response as unknown as MembersListResponse
  },

  /**
   * Get member by ID
   */
  getMemberById: async (id: string): Promise<ApiMember> => {
    const response = (await apiClient.get(
      API_ENDPOINTS.MEMBERS.DETAILS(id)
    )) as MemberDetailResponse
    return response.data.member
  },

  /**
   * Create new member
   */
  createMember: async (memberData: CreateMemberRequest): Promise<ApiMember> => {
    const response = (await apiClient.post(
      API_ENDPOINTS.MEMBERS.CREATE,
      memberData
    )) as MemberDetailResponse
    return response.data.member
  },

  /**
   * Update member
   */
  updateMember: async (id: string, memberData: UpdateMemberRequest): Promise<ApiMember> => {
    const response = (await apiClient.patch(
      API_ENDPOINTS.MEMBERS.UPDATE_MEMBER(id),
      memberData
    )) as MemberDetailResponse
    return response.data.member
  },

  /**
   * Delete member
   */
  deleteMember: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.MEMBERS.DELETE(id))
  },

  /**
   * Update member status in bulk
   */
  updateMemberStatusBulk: async (data: UpdateMemberStatusBulkRequest): Promise<void> => {
    await apiClient.patch(API_ENDPOINTS.MEMBERS.UPDATE_MEMBER_STATUS_BULK, data)
  },

  /**
   * Get members with birthdays in a specific month
   */
  getMembersByBirthdayMonth: async (month: number): Promise<BirthdayMembersResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.MEMBERS.MEMBERS_BIRTHDAY_MONTH(month))
    return response as unknown as BirthdayMembersResponse
  },

  // Dependents Operations
  /**
   * Create new dependent - API expects an array of dependents
   */
  createDependent: async (memberId: string, data: CreateDependentRequest): Promise<Dependent> => {
    const response = (await apiClient.post(API_ENDPOINTS.DEPENDENTS.CREATE(memberId), [
      data
    ])) as DependentDetailResponse
    return response.data.dependent
  },

  /**
   * Update dependent
   */
  updateDependent: async (
    memberId: string,
    dependentId: string,
    data: UpdateDependentRequest
  ): Promise<Dependent> => {
    const response = (await apiClient.patch(
      API_ENDPOINTS.DEPENDENTS.UPDATE(memberId, dependentId),
      data
    )) as DependentDetailResponse
    return response.data.dependent
  },

  /**
   * Delete dependent(s) - accepts an array of dependent IDs
   */
  deleteDependents: async (memberId: string, dependentIds: string[]): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.DEPENDENTS.DELETE(memberId), {
      data: dependentIds
    })
  }
}
