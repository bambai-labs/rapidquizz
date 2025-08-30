import { z } from 'zod'

export const QuizQuestionSchema = z.object({
  id: z.string(),
  question: z.string().min(1, 'Question is required'),
  options: z
    .array(z.string().min(1, 'Option cannot be empty'))
    .min(2, 'At least 2 options required')
    .max(4, 'Maximum 4 options allowed'),
  correctAnswer: z.number().min(0, 'Correct answer must be selected'),
  explanation: z.string().optional(),
})

export const QuizSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  topics: z
    .array(z.string().min(1, 'Topic cannot be empty'))
    .min(1, 'At least one topic required'),
  questions: z
    .array(QuizQuestionSchema)
    .min(1, 'At least one question required'),
  createdAt: z.date(),
  createdBy: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  timeLimit: z.number().optional(),
  isPublic: z.boolean().default(false),
})

export const QuizGeneratorSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  topics: z.array(z.string()).min(1, 'At least one topic required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  questionCount: z
    .number()
    .min(1, 'Must have at least 1 question')
    .max(20, 'Maximum 20 questions allowed'),
  timeLimit: z
    .number()
    .min(1, 'Time limit must be at least 1 minute')
    .max(120, 'Maximum 120 minutes')
    .optional(),
})

export const QuizAnswerSchema = z.object({
  questionId: z.string(),
  selectedAnswer: z.number(),
  timeSpent: z.number(),
})

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>
export type Quiz = z.infer<typeof QuizSchema>
export type QuizGeneratorForm = z.infer<typeof QuizGeneratorSchema>
export type QuizAnswer = z.infer<typeof QuizAnswerSchema>

export interface QuizResult {
  id?: string
  quizId: string
  userId?: string
  answers: QuizAnswer[]
  score: number
  totalQuestions: number
  completedAt: Date
  timeSpent: number
}

// Tipos para la base de datos
export interface DatabaseQuiz {
  id: string
  title: string
  subject: string
  topics: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  time_limit?: number
  created_at: string
  created_by: string
  updated_at: string
  is_public: boolean
}

export interface DatabaseQuizQuestion {
  id: string
  quiz_id: string
  question_text: string
  options: string[]
  correct_answer: number
  explanation?: string
  question_order: number
  created_at: string
}

export interface DatabaseQuizResult {
  id: string
  quiz_id: string
  user_id: string | null
  participant_name: string | null
  score: number
  total_questions: number
  time_spent: number
  completed_at: string
  created_at: string
}

export interface DatabaseQuizAnswer {
  id: string
  quiz_result_id: string
  question_id: string
  selected_answer: number
  time_spent: number
  created_at: string
}
