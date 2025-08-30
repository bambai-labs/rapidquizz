import {
  loadQuiz,
  loadQuizForSharing,
  saveQuizResult,
} from '@/lib/quiz-database'
import { Quiz, QuizAnswer, QuizResult } from '@/types/quiz'
import { Result } from '@/types/result.type'
import { create } from 'zustand'

interface QuizState {
  currentQuiz: Quiz | null
  currentQuestionIndex: number
  answers: QuizAnswer[]
  startTime: Date | null
  isQuizActive: boolean
  results: QuizResult | null
  isLoading: boolean
  error: string | null
  participantName: string | null

  // Actions
  setCurrentQuiz: (quiz: Quiz) => void
  loadQuizById: (quizId: string) => Promise<Result<Quiz>>
  loadQuizForSharing: (quizId: string, userId?: string) => Promise<Result<Quiz>>
  startQuiz: (participantName?: string) => void
  nextQuestion: () => void
  previousQuestion: () => void
  submitAnswer: (answer: QuizAnswer) => void
  finishQuiz: (userId?: string, participantName?: string) => Promise<void>
  resetQuiz: () => void
  setResults: (results: QuizResult) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setParticipantName: (name: string) => void
}

export const useQuizStore = create<QuizState>((set, get) => ({
  currentQuiz: null,
  currentQuestionIndex: 0,
  answers: [],
  startTime: null,
  isQuizActive: false,
  results: null,
  isLoading: false,
  error: null,
  participantName: null,

  setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),

  loadQuizById: async (quizId: string) => {
    set({ isLoading: true, error: null })
    try {
      const result = await loadQuiz(quizId)
      if (result.success && result.data) {
        set({ currentQuiz: result.data, isLoading: false })
        return result
      } else {
        set({
          error: result.errorMessage || 'Error al cargar el quiz',
          isLoading: false,
        })
        return result
      }
    } catch (error: any) {
      const errorMessage = `Error inesperado: ${error.message}`
      set({ error: errorMessage, isLoading: false })
      return { success: false, errorMessage }
    }
  },

  loadQuizForSharing: async (quizId: string, userId?: string) => {
    set({ isLoading: true, error: null })
    try {
      const result = await loadQuizForSharing(quizId, userId)
      if (result.success && result.data) {
        set({ currentQuiz: result.data, isLoading: false })
        return result
      } else {
        set({
          error: result.errorMessage || 'Error al cargar el quiz',
          isLoading: false,
        })
        return result
      }
    } catch (error: any) {
      const errorMessage = `Error inesperado: ${error.message}`
      set({ error: errorMessage, isLoading: false })
      return { success: false, errorMessage }
    }
  },

  startQuiz: (participantName?: string) =>
    set({
      isQuizActive: true,
      startTime: new Date(),
      currentQuestionIndex: 0,
      answers: [],
      results: null,
      participantName: participantName || null,
    }),

  nextQuestion: () =>
    set((state) => {
      const quiz = state.currentQuiz
      if (!quiz) return state

      const nextIndex = state.currentQuestionIndex + 1
      return {
        currentQuestionIndex: Math.min(nextIndex, quiz.questions.length - 1),
      }
    }),

  previousQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
    })),

  submitAnswer: (answer) =>
    set((state) => {
      const existingAnswerIndex = state.answers.findIndex(
        (a) => a.questionId === answer.questionId,
      )

      let updatedAnswers
      if (existingAnswerIndex >= 0) {
        updatedAnswers = [...state.answers]
        updatedAnswers[existingAnswerIndex] = answer
      } else {
        updatedAnswers = [...state.answers, answer]
      }

      return { answers: updatedAnswers }
    }),

  finishQuiz: async (userId?: string, participantName?: string) => {
    const state = get()
    if (!state.currentQuiz || !state.startTime) return

    const endTime = new Date()
    const timeSpent = (endTime.getTime() - state.startTime.getTime()) / 1000

    let correctAnswers = 0
    state.answers.forEach((answer) => {
      const question = state.currentQuiz?.questions.find(
        (q) => q.id === answer.questionId,
      )
      if (question && question.correctAnswer === answer.selectedAnswer) {
        correctAnswers++
      }
    })

    const score = Math.round(
      (correctAnswers / state.currentQuiz.questions.length) * 100,
    )

    const results: QuizResult = {
      quizId: state.currentQuiz.id,
      userId,
      answers: state.answers,
      score,
      totalQuestions: state.currentQuiz.questions.length,
      completedAt: endTime,
      timeSpent: Math.round(timeSpent),
    }

    // Guardar el resultado en la base de datos
    // Para usuarios autenticados o anónimos con nombre
    if (
      state.currentQuiz.id &&
      (userId || participantName || state.participantName)
    ) {
      try {
        const finalParticipantName = participantName || state.participantName
        const saveResult = await saveQuizResult(
          state.currentQuiz.id,
          userId,
          state.answers,
          score,
          state.currentQuiz.questions.length,
          Math.round(timeSpent),
          finalParticipantName,
        )
        if (saveResult.success) {
          results.id = saveResult.data
        } else {
          console.error('Error al guardar resultado:', saveResult.errorMessage)
        }
      } catch (error) {
        console.error('Error inesperado al guardar resultado:', error)
      }
    }

    set({
      isQuizActive: false,
      results,
    })
  },

  resetQuiz: () =>
    set({
      currentQuiz: null,
      currentQuestionIndex: 0,
      answers: [],
      startTime: null,
      isQuizActive: false,
      results: null,
      participantName: null,
    }),

  setResults: (results) => set({ results }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  setParticipantName: (name) => set({ participantName: name }),
}))
