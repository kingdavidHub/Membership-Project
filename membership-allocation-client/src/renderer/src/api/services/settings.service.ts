import { apiClient } from '../client'
import { API_ENDPOINTS } from '../endpoints'

export interface UpdateDefaultMonthlyPaymentRequest {
  defaultMonthlyPayment: number
}

export interface DefaultMonthlyPaymentResponse {
  status: string
  data: {
    defaultMonthlyPayment: number
    currency: string
    updatedAt: string
  }
}

/**
 * Settings Service
 * Handles settings-related API calls
 */
export const settingsService = {
  /**
   * Update the default monthly payment amount
   */
  updateDefaultMonthlyPayment: async (
    data: UpdateDefaultMonthlyPaymentRequest
  ): Promise<DefaultMonthlyPaymentResponse> => {
    const response = (await apiClient.patch(
      API_ENDPOINTS.SETTINGS.DEFAULT_MONTHLY_PAYMENT,
      data
    )) as DefaultMonthlyPaymentResponse
    return response
  }
}
