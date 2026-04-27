import { z } from 'zod'

const paymentSchema = z.object({
  _id: z.string(),
  amount: z.number(),
  duration: z.number(),
  member: z.string(),
  createdAt: z.string()
})

export type Payment = z.infer<typeof paymentSchema>

export const paymentListSchema = z.array(paymentSchema)
