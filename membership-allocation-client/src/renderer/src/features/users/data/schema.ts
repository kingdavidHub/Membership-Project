import { z } from 'zod'

const userStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('invited'),
  z.literal('suspended')
])
export type UserStatus = z.infer<typeof userStatusSchema>

const userRoleSchema = z.union([z.literal('super-admin'), z.literal('admin'), z.literal('member')])

const userSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string(),
  role: userRoleSchema,
  member: z.string().nullable().optional(),
  passwordGenerateCount: z.number().optional(),
  isGeneratedPassword: z.boolean().optional(),
  passwordChangedAt: z.string().optional(),
  // Frontend-only fields (not from API)
  phoneNumber: z.string().optional(),
  status: userStatusSchema.optional()
})
export type User = z.infer<typeof userSchema>

export const userListSchema = z.array(userSchema)
