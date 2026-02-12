/**
 * API Services Barrel Export
 * Import all services from this single file
 *
 * Usage:
 * import { authService, usersService, tasksService } from '@/api/services'
 */

export { authService } from './auth.service'
export { usersService } from './users.service'

// Re-export common types for convenience
export type * from '../types'
export type * from '../types/auth.types'
export type * from '../types/user.types'
export type * from '../types/task.types'
