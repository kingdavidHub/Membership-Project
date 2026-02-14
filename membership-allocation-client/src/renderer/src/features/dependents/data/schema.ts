import { z } from 'zod'

const dependentSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  member: z.string(),
  memberName: z.string().optional(), // Enriched field for display
  createdAt: z.string().optional()
})

export type Dependent = z.infer<typeof dependentSchema>

export const dependentListSchema = z.array(dependentSchema)
