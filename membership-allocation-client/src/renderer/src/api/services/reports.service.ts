import { apiClient } from '../client'
import { API_ENDPOINTS } from '../endpoints'
import type { SendMembersMessageRequest, SendMembersMessageResponse } from '../types/report.types'

/**
 * Reports Service
 * Handles all report-related API calls
 */
export const reportsService = {
  /**
   * Send a message to selected members
   */
  sendMembersMessage: async (
    data: SendMembersMessageRequest
  ): Promise<SendMembersMessageResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.REPORTS.SEND_MEMBERS_MESSAGE, data)
    return response as unknown as SendMembersMessageResponse
  }
}
