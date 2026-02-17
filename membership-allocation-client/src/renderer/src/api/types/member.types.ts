/**
 * Member API Types
 */

export type PaymentStatus = 'unpaid' | 'paid' | 'overdue' | 'exempted'
export type MemberStatus = 'active' | 'inactive' | 'suspended'
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

export interface BirthdayMembersResponse {
  status: string
  results: number
  data: {
    members: ApiMember[]
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
