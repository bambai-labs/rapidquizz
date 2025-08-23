'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getQuizAttemptDetails } from '@/lib/quiz-database'
import { useAuthStore } from '@/stores/auth-store'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Trophy,
  User,
  XCircle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'

interface QuizAttemptDetailPageProps {
  params: Promise<{
    id: string
    resultId: string
  }>
}

interface QuizAnswer {
  id: string
  selected_answer: number
  time_spent: number
  quiz_questions: {
    id: string
    question_text: string
    options: string[]
    correct_answer: number
    explanation?: string
    question_order: number
  }
}

interface AttemptDetails {
  result: {
    id: string
    quiz_id: string
    user_id: string
    score: number
    total_questions: number
    time_spent: number
    completed_at: string
    user_profile?: {
      email: string
      raw_user_meta_data?: {
        name?: string
        username?: string
      }
    }
    quizzes: {
      title: string
      created_by: string
    }
  }
  answers: QuizAnswer[]
}

export default function QuizAttemptDetailPage({
  params,
}: QuizAttemptDetailPageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { user } = useAuthStore()
  const [attemptDetails, setAttemptDetails] = useState<AttemptDetails | null>(
    null,
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAttemptDetails = async () => {
      if (!user) {
        router.push('/login')
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const result = await getQuizAttemptDetails(
          resolvedParams.resultId,
          user.id,
        )

        if (result.success && result.data) {
          setAttemptDetails(result.data)
        } else {
          setError(result.errorMessage || 'Error al cargar los detalles')
        }
      } catch (err: any) {
        setError('Error inesperado al cargar los detalles')
      } finally {
        setIsLoading(false)
      }
    }

    loadAttemptDetails()
  }, [user, resolvedParams.resultId, router])

  const handleBackToResponses = () => {
    router.push(`/quiz/${resolvedParams.id}/responses`)
  }

  const getUserDisplayName = (result: AttemptDetails['result']): string => {
    // Si es el usuario actual, mostrar su información
    if (user && result.user_id === user.id) {
      return user.name || user.username || user.email?.split('@')[0] || 'Tú'
    }

    // Para otros usuarios, mostrar información limitada por privacidad
    const metadata = result.user_profile?.raw_user_meta_data
    return (
      metadata?.name ||
      metadata?.username ||
      result.user_profile?.email?.split('@')[0] ||
      'Usuario Anónimo'
    )
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !attemptDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-destructive mb-2">
                  Error
                </h3>
                <p className="text-muted-foreground mb-4">
                  {error || 'No se pudieron cargar los detalles'}
                </p>
                <Button onClick={handleBackToResponses}>
                  Volver a las respuestas
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const { result, answers } = attemptDetails

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToResponses}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a las respuestas
          </Button>

          <h1 className="text-3xl font-bold mb-2">Detalles del Intento</h1>
          <p className="text-muted-foreground">{result.quizzes.title}</p>
        </div>

        {/* Resumen del intento */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Resumen del Intento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${getScoreColor(
                    result.score,
                    result.total_questions,
                  )}`}
                >
                  {result.score}/{result.total_questions}
                </div>
                <div className="text-sm text-muted-foreground">
                  Puntuación (
                  {Math.round((result.score / result.total_questions) * 100)}%)
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatTime(result.time_spent)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Tiempo total
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold flex items-center justify-center gap-1">
                  <User className="w-4 h-4" />
                  {getUserDisplayName(result)}
                </div>
                <div className="text-sm text-muted-foreground">Usuario</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold flex items-center justify-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(result.completed_at), 'dd/MM/yyyy', {
                    locale: es,
                  })}
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(result.completed_at), 'HH:mm', {
                    locale: es,
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Respuestas detalladas */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Respuestas Detalladas</h2>

          {answers.map((answer, index) => {
            const isCorrect =
              answer.selected_answer === answer.quiz_questions.correct_answer

            return (
              <Card key={answer.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">
                      Pregunta {answer.quiz_questions.question_order + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={isCorrect ? 'default' : 'destructive'}
                        className="flex items-center gap-1"
                      >
                        {isCorrect ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {isCorrect ? 'Correcta' : 'Incorrecta'}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatTime(answer.time_spent)}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-base font-medium">
                      {answer.quiz_questions.question_text}
                    </p>

                    <div className="space-y-2">
                      {answer.quiz_questions.options.map(
                        (option, optionIndex) => {
                          const isSelected =
                            optionIndex === answer.selected_answer
                          const isCorrectOption =
                            optionIndex === answer.quiz_questions.correct_answer

                          return (
                            <div
                              key={optionIndex}
                              className={`p-3 rounded-lg border ${
                                isSelected && isCorrectOption
                                  ? 'bg-green-50 border-green-200 text-green-800'
                                  : isSelected && !isCorrectOption
                                    ? 'bg-red-50 border-red-200 text-red-800'
                                    : isCorrectOption
                                      ? 'bg-green-50 border-green-200 text-green-800'
                                      : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">
                                  {String.fromCharCode(65 + optionIndex)}.
                                </span>
                                <span>{option}</span>
                                {isSelected && (
                                  <Badge variant="outline" className="ml-auto">
                                    Seleccionada
                                  </Badge>
                                )}
                                {isCorrectOption && !isSelected && (
                                  <Badge variant="default" className="ml-auto">
                                    Correcta
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )
                        },
                      )}
                    </div>

                    {answer.quiz_questions.explanation && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">
                          Explicación:
                        </h4>
                        <p className="text-blue-800 text-sm">
                          {answer.quiz_questions.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
