'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useAuthStore } from '@/stores/auth-store'
import { useQuizStore } from '@/stores/quiz-store'
import { useUserQuizzesStore } from '@/stores/user-quizzes-store'
import { Quiz } from '@/types/quiz'
import { motion } from 'framer-motion'
import { Book, Clock, Play, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface QuizListProps {
  title?: string
  description?: string
}

export function QuizList({
  title = 'Mis Quizzes',
  description,
}: QuizListProps) {
  const router = useRouter()
  const { user } = useAuthStore()
  const { setCurrentQuiz, startQuiz } = useQuizStore()
  const { userQuizzes, isLoading, error, loadUserQuizzes, deleteUserQuiz } =
    useUserQuizzesStore()

  useEffect(() => {
    if (user) {
      loadUserQuizzes(user.id)
    }
  }, [user, loadUserQuizzes])

  const handleStartQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz)
    startQuiz()
    router.push('/quiz/interface')
  }

  const handleDeleteQuiz = async (quizId: string) => {
    if (!user) return
    if (confirm('¿Estás seguro de que quieres eliminar este quiz?')) {
      await deleteUserQuiz(quizId, user.id)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'hard':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-destructive mb-2">
                Error
              </h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {!isLoading && userQuizzes.length === 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Book className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tienes quizzes</h3>
              <p className="text-muted-foreground">
                Crea tu primer quiz para empezar
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {userQuizzes.map((quiz, index) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge
                    variant="secondary"
                    className={getDifficultyColor(quiz.difficulty)}
                  >
                    {quiz.difficulty}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteQuiz(quiz.id)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <CardTitle className="line-clamp-2">{quiz.title}</CardTitle>
                <CardDescription>
                  <div className="space-y-1">
                    <p className="font-medium">{quiz.subject}</p>
                    <p className="text-sm">{quiz.topics.join(', ')}</p>
                  </div>
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Book className="w-4 h-4 mr-2" />
                    {quiz.questions.length} preguntas
                  </div>
                  {quiz.timeLimit && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      {quiz.timeLimit} minutos
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Creado el {new Date(quiz.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <Button
                  onClick={() => handleStartQuiz(quiz)}
                  className="w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Iniciar Quiz
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
