/**
 * API Services Barrel Export
 * Import all services from this single file
 *
 * Usage:
 * import { authService, usersService, tasksService } from '@/api/services'
 */

export { authService } from './auth.service'
export { usersService } from './users.service'
export { membersService } from './members.service'
export { reportsService } from './reports.service'

// Re-export common types for convenience
export type * from '../types'
export type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  UserProfile,
  UpdateProfileRequest
} from '../types/auth.types'
export type {
  User,
  Member,
  PaymentStatus,
  MemberStatus,
  CreateUserRequest,
  UpdateUserRequest,
  ChangeUserRoleRequest,
  ChangePasswordRequest
} from '../types/user.types'
export type {
  ApiMember,
  Dependent,
  MembersListResponse,
  MemberDetailResponse,
  CreateMemberRequest,
  UpdateMemberRequest,
  UpdateMemberStatusBulkRequest,
  BirthdayMembersResponse,
  MemberPayment,
  MemberPaymentsResponse,
  CreatePaymentRequest,
  PaymentDetailResponse,
  PaymentStatus as MemberPaymentStatus,
  MemberStatus as MemberMemberStatus
} from '../types/member.types'
