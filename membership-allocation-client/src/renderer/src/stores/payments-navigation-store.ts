import { create } from 'zustand'

interface MemberPaymentsData {
  memberId: string
  memberName: string
}

interface PaymentsNavigationState {
  data: MemberPaymentsData | null
  setData: (data: MemberPaymentsData) => void
  clear: () => void
}

export const usePaymentsNavigationStore = create<PaymentsNavigationState>()((set) => ({
  data: null,
  setData: (data) => set({ data }),
  clear: () => set({ data: null })
}))
