import { User } from '@/modules/auth/types/user.type'
import { create } from 'zustand'

interface AuthState {
  user: User | undefined
  setUser: (user: User | undefined) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: undefined,
  setUser: (user: User | undefined) => set({ user }),
}))
