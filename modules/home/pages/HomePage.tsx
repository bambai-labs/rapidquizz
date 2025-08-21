'use client'
import { QuizCard } from '@/components/quiz/quiz-card'
import { QuizGeneratorFormComponent } from '@/components/quiz/quiz-generator-form'
import { useAuthStore } from '@/stores/auth-store'
import { useQuizStore } from '@/stores/quiz-store'
import { useUserQuizzesStore } from '@/stores/user-quizzes-store'
import { Quiz } from '@/types/quiz'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export const HomePage = () => {
  const router = useRouter()
  const { setCurrentQuiz, startQuiz } = useQuizStore()
  const { userQuizzes, isLoading, loadUserQuizzes, updateQuizVisibility } =
    useUserQuizzesStore()
  const [showGenerator, setShowGenerator] = useState(false)
  const { user } = useAuthStore()

  const handleStartQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz)
    startQuiz()
    console.log(quiz)
    router.push('/quiz')
  }

  const handleEditQuiz = (quiz: Quiz) => {
    router.push(`/quiz/edit/${quiz.id}`)
  }

  const handleQuizGenerated = () => {
    setShowGenerator(false)
    if (user) {
      loadUserQuizzes(user.id)
    }
  }

  const handleUpdateQuizVisibility = async (
    quizId: string,
    isPublic: boolean,
  ) => {
    if (!user) return
    await updateQuizVisibility(quizId, isPublic, user.id)
  }

  useEffect(() => {
    if (user) {
      loadUserQuizzes(user.id)
    }
  }, [user, loadUserQuizzes])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold mb-4">
            Welcome back, {user?.username ?? 'User'}!
          </h2>
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
                onCancel={() => setShowGenerator(false)}
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
              </div>

              {/* Mostrar quizzes guardados en la base de datos */}
              {userQuizzes.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Your Quizzes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userQuizzes.map((quiz) => (
                      <QuizCard
                        key={quiz.id}
                        quiz={quiz}
                        onStartQuiz={handleStartQuiz}
                        onEditQuiz={handleEditQuiz}
                        onUpdateQuizVisibility={handleUpdateQuizVisibility}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Mostrar loading state si está cargando */}
              {isLoading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-2">
                    Cargando quizzes...
                  </p>
                </div>
              )}

              {/* Mostrar mensaje si no hay quizzes */}
              {!isLoading && userQuizzes.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No tienes quizzes aún. ¡Crea tu primer quiz!
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
