import {
  deleteQuiz,
  loadUserQuizzes,
  updateQuizVisibility,
} from '@/lib/quiz-database'
import { Quiz } from '@/types/quiz'
import { Result } from '@/types/result.type'
import { create } from 'zustand'

interface UserQuizzesState {
  userQuizzes: Quiz[]
  isLoading: boolean
  error: string | null

  // Actions
  loadUserQuizzes: (userId: string) => Promise<Result<Quiz[]>>
  deleteUserQuiz: (quizId: string, userId: string) => Promise<Result<void>>
  updateQuizVisibility: (
    quizId: string,
    isPublic: boolean,
    userId: string,
  ) => Promise<Result<void>>
  addQuiz: (quiz: Quiz) => void
  updateQuiz: (quiz: Quiz) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useUserQuizzesStore = create<UserQuizzesState>((set, get) => ({
  userQuizzes: [],
  isLoading: false,
  error: null,

  loadUserQuizzes: async (userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const result = await loadUserQuizzes(userId)
      if (result.success && result.data) {
        set({ userQuizzes: result.data, isLoading: false })
      } else {
        set({
          error: result.errorMessage || 'Error al cargar quizzes',
          isLoading: false,
        })
      }
      return result
    } catch (error: any) {
      const errorMessage = `Error inesperado: ${error.message}`
      set({ error: errorMessage, isLoading: false })
      return { success: false, errorMessage }
    }
  },

  deleteUserQuiz: async (quizId: string, userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const result = await deleteQuiz(quizId, userId)
      if (result.success) {
        // Actualizar la lista de quizzes del usuario
        const currentQuizzes = get().userQuizzes
        set({
          userQuizzes: currentQuizzes.filter((quiz) => quiz.id !== quizId),
          isLoading: false,
        })
      } else {
        set({
          error: result.errorMessage || 'Error al eliminar quiz',
          isLoading: false,
        })
      }
      return result
    } catch (error: any) {
      const errorMessage = `Error inesperado: ${error.message}`
      set({ error: errorMessage, isLoading: false })
      return { success: false, errorMessage }
    }
  },

  updateQuizVisibility: async (
    quizId: string,
    isPublic: boolean,
    userId: string,
  ) => {
    try {
      const result = await updateQuizVisibility(quizId, isPublic, userId)
      if (result.success) {
        // Actualizar el quiz en la lista local
        const currentQuizzes = get().userQuizzes
        set({
          userQuizzes: currentQuizzes.map((quiz) =>
            quiz.id === quizId ? { ...quiz, isPublic } : quiz,
          ),
        })
      }
      return result
    } catch (error: any) {
      const errorMessage = `Error inesperado: ${error.message}`
      return { success: false, errorMessage }
    }
  },

  addQuiz: (quiz: Quiz) => {
    set((state) => ({
      userQuizzes: [quiz, ...state.userQuizzes],
    }))
  },

  updateQuiz: (updatedQuiz: Quiz) => {
    set((state) => ({
      userQuizzes: state.userQuizzes.map((quiz) =>
        quiz.id === updatedQuiz.id ? updatedQuiz : quiz,
      ),
    }))
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),

  clearError: () => set({ error: null }),
}))
