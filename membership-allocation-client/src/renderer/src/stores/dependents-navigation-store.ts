import { create } from 'zustand'

interface DependentData {
  _id: string
  firstName: string
  lastName: string
  member?: string
  relation?: string
  relationship?: string
  createdAt?: string
}

interface MemberDependentsData {
  memberId: string
  memberName: string
  dependents: DependentData[]
}

interface DependentsNavigationState {
  data: MemberDependentsData | null
  setData: (data: MemberDependentsData) => void
  clear: () => void
}

/**
 * Transient store to pass member dependents data from the members table
 * to the dependents page without an extra API call.
 */
export const useDependentsNavigationStore = create<DependentsNavigationState>()((set) => ({
  data: null,
  setData: (data) => set({ data }),
  clear: () => set({ data: null })
}))
