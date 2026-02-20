import { type DependentRelations } from '@/api/types/member.types'

/**
 * Human-readable labels for dependent relationship types
 */
export const dependentRelationLabels: Record<DependentRelations, string> = {
  child: 'Child',
  spouse: 'Spouse',
  parent: 'Parent',
  sibling: 'Sibling',
  grandchild: 'Grandchild',
  grandparent: 'Grandparent',
  uncle: 'Uncle',
  aunt: 'Aunt',
  nephew: 'Nephew',
  niece: 'Niece',
  cousin: 'Cousin',
  guardian: 'Guardian',
  ward: 'Ward',
  father: 'Father',
  mother: 'Mother',
  son: 'Son',
  daughter: 'Daughter',
  brother: 'Brother',
  sister: 'Sister',
  other: 'Other'
}

/**
 * Options array for use in Select dropdowns
 */
export const dependentRelationOptions = Object.entries(dependentRelationLabels).map(
  ([value, label]) => ({
    value: value as DependentRelations,
    label
  })
)
