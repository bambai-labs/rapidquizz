'use client'

import { QuizInterface } from '@/components/quiz/quiz-interface'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth-store'
import { useQuizStore } from '@/stores/quiz-store'
import { motion } from 'framer-motion'
import { ArrowLeft, Lock, Shield } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function QuizByIdPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const {
    currentQuiz,
    isQuizActive,
    loadQuizForSharing,
    startQuiz,
    resetQuiz,
    isLoading,
    error,
  } = useQuizStore()

  const [accessDenied, setAccessDenied] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const quizId = params.id as string

  useEffect(() => {
    if (!quizId) {
      router.push('/dashboard')
      return
    }

    loadQuizFromId()
  }, [quizId, user])

  const loadQuizFromId = async () => {
    const result = await loadQuizForSharing(quizId, user?.id)

    if (result.success && result.data) {
      const quiz = result.data

      // Verificar si es el propietario
      const userIsOwner = user && quiz.createdBy === user.id
      setIsOwner(!!userIsOwner)

      // El acceso ya fue verificado en loadQuizForSharing
      setAccessDenied(false)
    } else {
      // Quiz no encontrado o no tiene acceso
      setAccessDenied(true)
    }
  }

  const handleStartQuiz = () => {
    if (currentQuiz) {
      startQuiz()
    }
  }

  const handleBackToDashboard = () => {
    resetQuiz()
    router.push('/dashboard')
  }

  // Mostrar loader mientras carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando quiz...</p>
        </div>
      </div>
    )
  }

  // Mostrar acceso denegado
  if (accessDenied || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-destructive" />
              </div>
              <CardTitle>Acceso Denegado</CardTitle>
              <CardDescription>
                {error
                  ? 'No se pudo cargar el quiz solicitado'
                  : 'Este quiz es privado y no tienes permisos para acceder a él'}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="flex items-start gap-3 text-sm text-muted-foreground bg-muted p-3 rounded-md">
                <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="font-medium mb-1">¿Por qué no puedo acceder?</p>
                  <p>
                    Solo los quizzes marcados como públicos pueden ser
                    compartidos y tomados por otros usuarios.
                  </p>
                </div>
              </div>
              <Button onClick={handleBackToDashboard} className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Dashboard
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Si el quiz está activo, mostrar la interfaz del quiz
  if (isQuizActive && currentQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          <QuizInterface />
        </div>
      </div>
    )
  }

  // Mostrar información del quiz antes de comenzar
  if (currentQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      {currentQuiz.title}
                    </CardTitle>
                    <CardDescription className="text-lg mt-2">
                      {currentQuiz.subject}
                    </CardDescription>
                  </div>
                  {isOwner && (
                    <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      Tu Quiz
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Información del quiz */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-bold text-lg">
                      {currentQuiz.questions.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Preguntas
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-bold text-lg capitalize">
                      {currentQuiz.difficulty}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Dificultad
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-bold text-lg">
                      {currentQuiz.timeLimit
                        ? `${currentQuiz.timeLimit} min`
                        : 'Sin límite'}
                    </div>
                    <div className="text-sm text-muted-foreground">Tiempo</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-bold text-lg">
                      {currentQuiz.isPublic ? 'Público' : 'Privado'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Visibilidad
                    </div>
                  </div>
                </div>

                {/* Temas */}
                <div>
                  <h3 className="font-medium mb-2">Temas incluidos:</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentQuiz.topics.map((topic, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Instrucciones */}
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Instrucciones:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Selecciona una respuesta para cada pregunta</li>
                    <li>• Puedes navegar entre preguntas usando los botones</li>
                    {currentQuiz.timeLimit && (
                      <li>
                        • Tienes {currentQuiz.timeLimit} minutos para completar
                        el quiz
                      </li>
                    )}
                    <li>• Al finalizar verás tus resultados inmediatamente</li>
                  </ul>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleBackToDashboard}
                    variant="outline"
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver
                  </Button>
                  <Button
                    onClick={handleStartQuiz}
                    className="flex-1 text-lg py-6"
                  >
                    Comenzar Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return null
}
