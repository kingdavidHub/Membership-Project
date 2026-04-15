/**
 * Member API Types
 */

export type PaymentStatus = 'unpaid' | 'paid'
export type MemberStatus = 'active' | 'inactive' | 'deceased'
export type DependentRelations =
  | 'child'
  | 'spouse'
  | 'parent'
  | 'sibling'
  | 'grandchild'
  | 'grandparent'
  | 'uncle'
  | 'aunt'
  | 'nephew'
  | 'niece'
  | 'cousin'
  | 'guardian'
  | 'ward'
  | 'father'
  | 'mother'
  | 'son'
  | 'daughter'
  | 'brother'
  | 'sister'
  | 'other'
export interface Dependent {
  _id: string
  firstName: string
  lastName: string
  member: string
  relation: DependentRelations
  createdAt: string
  __v?: number
}

export interface ApiMember {
  _id: string
  user: string
  firstName: string
  lastName: string
  dob: string
  membershipId: string
  entryYear: number
  paymentStatus: PaymentStatus
  memberStatus: MemberStatus
  dependents: Dependent[]
  lastPaid: string | null
  createdAt: string
  __v?: number
}

export interface MembersListResponse {
  status: string
  results: number
  data: {
    members: ApiMember[]
  }
}

export interface MemberDetailResponse {
  status: string
  data: {
    member: ApiMember
  }
}

export interface CreateMemberRequest {
  firstName: string
  lastName: string
  dob?: string
  membershipId: string
  entryYear: number
  paymentStatus?: PaymentStatus
  memberStatus?: MemberStatus
}

export interface UpdateMemberRequest {
  firstName?: string
  lastName?: string
  dob?: string
  membershipId?: string
  entryYear?: number
  paymentStatus?: PaymentStatus
  memberStatus?: MemberStatus
}

export interface UpdateMemberStatusBulkRequest {
  memberIds: string[]
  memberStatus: MemberStatus
}

export interface UpdateMemberPaymentStatusBulkRequest {
  memberIds: string[]
  paymentStatus: PaymentStatus
}

export interface BirthdayMembersResponse {
  status: string
  results: number
  data: {
    members: ApiMember[]
  }
}

export interface MemberPayment {
  _id: string
  amount: number
  duration: number
  member: string
  createdAt: string
}

export interface MemberPaymentsResponse {
  status: string
  totalPages: number
  currentPage: string
  results: number
  data: {
    data: MemberPayment[]
  }
}

export interface CreatePaymentRequest {
  amount: number
  duration: number
}

export interface PaymentDetailResponse {
  status: string
  data: {
    payment: MemberPayment
  }
}

// Dependents Types
export interface DependentsListResponse {
  status: string
  results: number
  data: {
    dependents: Dependent[]
  }
}

export interface DependentDetailResponse {
  status: string
  data: {
    dependent: Dependent
  }
}

export interface CreateDependentRequest {
  firstName: string
  lastName: string
  relationship: DependentRelations
}

export interface UpdateDependentRequest {
  firstName?: string
  lastName?: string
  relationship?: DependentRelations
}
