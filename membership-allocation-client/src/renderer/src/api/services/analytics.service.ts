import { apiClient } from '../client'
import { API_ENDPOINTS } from '../endpoints'

export interface PaymentTrend {
  _id: string
  total: number
  membership: number
  contributions: number
  objects: number
}

export interface PaymentStatusCount {
  _id: string
  count: number
}

export interface PaymentByType {
  _id: string
  amount: number
  count: number
  average: number
}

export interface TopMember {
  total: number
  records: number
  memberId: string
  membershipId: string
  firstName: string
  lastName: string
}

export interface PaymentByEntryYear {
  _id: number
  total: number
  records: number
  members: number
}

export interface ExpiryRisk {
  expired: number
  dueWithin7Days: number
  dueWithin30Days: number
  dueWithin90Days: number
}

export interface AdminPaymentAnalyticsResponse {
  status: string
  data: {
    range: {
      from: string
      to: string
      timezone: string
      groupBy: string
    }
    totals: {
      totalCollected: number
      membershipRevenue: number
      contributionRevenue: number
      paymentObjectCount: number
      coverageMonths: number
      transactionCount: number
      operationCount: number
      uniquePayingMembers: number
      averageTransactionValue: number
    }
    debtClearances: number
    trend: PaymentTrend[]
    currentStatus: PaymentStatusCount[]
    byType: PaymentByType[]
    topMembers: TopMember[]
    byEntryYear: PaymentByEntryYear[]
    rateUsage: unknown[]
    expiryRisk: ExpiryRisk
    membersWithoutPayments: number
    lifetimeTotals: unknown
  }
}

export interface AdminUsersAnalyticsResponse {
  status: string
  data: {
    range: {
      from: string
      to: string
      timezone: string
    }
    totalUsers: number
    newUsers: number
    newMembers: number
    roles: { _id: string; count: number }[]
    registration: { _id: string; count: number }[]
    memberStatuses: { _id: string; count: number }[]
    entryYears: { _id: number; count: number }[]
    paymentStatuses: { _id: string; count: number }[]
    birthdays: { _id: number; count: number }[]
    relationshipCounts: { _id: string | null; count: number }[]
    generatedPasswordStates: { _id: boolean; count: number }[]
    ageBands: { _id: string; count: number }[]
    dependantDistribution: { _id: number; count: number }[]
    dependantCoverage: { _id: string; count: number }[]
    profileCompletion: { _id: string; count: number }[]
  }
}

export const analyticsService = {
  getAdminUsers: async (): Promise<AdminUsersAnalyticsResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.ADMIN_USERS)
    return response as unknown as AdminUsersAnalyticsResponse
  },
  getAdminPayments: async (): Promise<AdminPaymentAnalyticsResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.ADMIN_PAYMENTS)
    return response as unknown as AdminPaymentAnalyticsResponse
  },

  exportAdminPayments: async (format: 'xlsx' | 'pdf'): Promise<Blob> => {
    const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.ADMIN_PAYMENTS_EXPORT, {
      params: { format },
      responseType: 'blob'
    })
    return response as unknown as Blob
  },

  exportAdminUsers: async (format: 'xlsx' | 'pdf'): Promise<Blob> => {
    const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.ADMIN_USERS_EXPORT, {
      params: { format },
      responseType: 'blob'
    })
    return response as unknown as Blob
  }
}
