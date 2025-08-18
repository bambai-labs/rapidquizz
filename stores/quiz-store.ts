import { Quiz, QuizAnswer, QuizResult } from '@/types/quiz'
import { create } from 'zustand'

interface QuizState {
  currentQuiz: Quiz | null
  currentQuestionIndex: number
  answers: QuizAnswer[]
  startTime: Date | null
  isQuizActive: boolean
  results: QuizResult | null

  // Actions
  setCurrentQuiz: (quiz: Quiz) => void
  startQuiz: () => void
  nextQuestion: () => void
  previousQuestion: () => void
  submitAnswer: (answer: QuizAnswer) => void
  finishQuiz: () => void
  resetQuiz: () => void
  setResults: (results: QuizResult) => void
}

export const useQuizStore = create<QuizState>((set, get) => ({
  currentQuiz: null,
  currentQuestionIndex: 0,
  answers: [],
  startTime: null,
  isQuizActive: false,
  results: null,

  setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),

  startQuiz: () =>
    set({
      isQuizActive: true,
      startTime: new Date(),
      currentQuestionIndex: 0,
      answers: [],
      results: null,
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

  finishQuiz: () => {
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

    const results: QuizResult = {
      quizId: state.currentQuiz.id,
      answers: state.answers,
      score: Math.round(
        (correctAnswers / state.currentQuiz.questions.length) * 100,
      ),
      totalQuestions: state.currentQuiz.questions.length,
      completedAt: endTime,
      timeSpent: Math.round(timeSpent),
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
    }),

  setResults: (results) => set({ results }),
}))
