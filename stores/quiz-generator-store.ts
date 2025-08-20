import { Quiz } from '@/types/quiz'
import { create } from 'zustand'

interface QuizGeneratorState {
  generatedQuizzes: Quiz[]
  isGenerating: boolean
  error: string | null

  // Actions
  addGeneratedQuiz: (quiz: Quiz) => void
  setIsGenerating: (isGenerating: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useQuizGeneratorStore = create<QuizGeneratorState>((set) => ({
  generatedQuizzes: [],
  isGenerating: false,
  error: null,

  addGeneratedQuiz: (quiz) => {
    set((state) => ({
      generatedQuizzes: [quiz, ...state.generatedQuizzes],
    }))

    // También añadir al store de quizzes del usuario si está disponible
    try {
      const { useUserQuizzesStore } = require('./user-quizzes-store')
      const userQuizzesStore = useUserQuizzesStore.getState()
      userQuizzesStore.addQuiz(quiz)
    } catch (error) {
      // Store no disponible, continuar silenciosamente
      console.log('User quizzes store not available')
    }
  },

  setIsGenerating: (isGenerating) => set({ isGenerating }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}))
