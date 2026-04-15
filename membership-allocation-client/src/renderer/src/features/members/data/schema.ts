import { z } from 'zod'

const paymentStatusSchema = z.union([
  z.literal('unpaid'),
  z.literal('paid')
])
export type PaymentStatus = z.infer<typeof paymentStatusSchema>

const memberStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('deceased')
])
export type MemberStatus = z.infer<typeof memberStatusSchema>

const memberSchema = z.object({
  _id: z.string(),
  user: z.string().nullable().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().optional(),
  dob: z.string().optional(),
  membershipId: z.string(),
  entryYear: z.number(),
  paymentStatus: paymentStatusSchema,
  memberStatus: memberStatusSchema,
  dependents: z
    .array(
      z.object({
        _id: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        member: z.string().optional(),
        relation: z.string().optional(),
        createdAt: z.string().optional()
      })
    )
    .optional(),
  createdAt: z.string().optional(),
  // Frontend-only fields (not from API)
  phoneNumber: z.string().optional()
})
export type Member = z.infer<typeof memberSchema>

export const memberListSchema = z.array(memberSchema)
