'use client'

import { QuizEditForm } from '@/components/quiz/quiz-edit-form'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'
import { useQuizStore } from '@/stores/quiz-store'
import { Quiz } from '@/types/quiz'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function EditQuizPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const { loadQuizById, isLoading, error } = useQuizStore()
  const [quiz, setQuiz] = useState<Quiz | null>(null)

  const quizId = params.id as string

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    if (quizId) {
      loadQuizData()
    }
  }, [user, quizId])

  const loadQuizData = async () => {
    const result = await loadQuizById(quizId)
    if (result.success && result.data) {
      // Verify that the user is the owner of the quiz
      if (result.data.createdBy !== user?.id) {
        router.push('/dashboard')
        return
      }
      setQuiz(result.data)
    } else {
      console.error('Error loading quiz:', result.errorMessage)
      router.push('/dashboard')
    }
  }

  const handleGoBack = () => {
    router.push('/dashboard')
  }

  const handleQuizUpdated = () => {
    router.push('/dashboard')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Error loading quiz'}</p>
          <Button onClick={handleGoBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button onClick={handleGoBack} variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <h1 className="text-3xl font-bold mb-2">Edit Quiz</h1>
          <p className="text-muted-foreground">
            Modify the questions, answers, and settings of your quiz
          </p>
        </motion.div>

        <QuizEditForm
          quiz={quiz}
          onQuizUpdated={handleQuizUpdated}
          onCancel={handleGoBack}
        />
      </div>
    </div>
  )
}
