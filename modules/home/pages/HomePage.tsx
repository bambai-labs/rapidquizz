'use client'
import { logout } from '@/actions/auth'
import { QuizCard } from '@/components/quiz/quiz-card'
import { QuizGeneratorFormComponent } from '@/components/quiz/quiz-generator-form'
import { useQuizGeneratorStore } from '@/stores/quiz-generator-store'
import { useQuizStore } from '@/stores/quiz-store'
import { Quiz } from '@/types/quiz'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export const HomePage = () => {
  const { generatedQuizzes } = useQuizGeneratorStore()
  const { setCurrentQuiz, startQuiz } = useQuizStore()
  const [showGenerator, setShowGenerator] = useState(false)
  const router = useRouter()

  const handleStartQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz)
    startQuiz()
  }

  const handleQuizGenerated = () => {
    setShowGenerator(false)
  }

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      toast.success('Logged out successfully')
      router.replace('/login')
      return
    }

    toast.error(result.errorMessage || 'An error occurred')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold mb-4">Welcome back,!</h2>
          <p className="text-muted-foreground mb-6">
            Create and manage your interactive quizzes
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {showGenerator ? (
            <motion.div
              key="generator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <QuizGeneratorFormComponent
                onQuizGenerated={handleQuizGenerated}
              />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center flex flex-col items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowGenerator(true)}
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  Create New Quiz
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="bg-secondary text-primary border border-primary px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  Logout
                </motion.button>
              </div>

              {generatedQuizzes.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Your Quizzes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {generatedQuizzes.map((quiz) => (
                      <QuizCard
                        key={quiz.id}
                        quiz={quiz}
                        onStartQuiz={handleStartQuiz}
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
