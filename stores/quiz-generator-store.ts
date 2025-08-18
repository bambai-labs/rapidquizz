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

  addGeneratedQuiz: (quiz) =>
    set((state) => ({
      generatedQuizzes: [quiz, ...state.generatedQuizzes],
    })),

  setIsGenerating: (isGenerating) => set({ isGenerating }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}))
