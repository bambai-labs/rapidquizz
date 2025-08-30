'use client'

import { ParticipantNameDialog } from '@/components/quiz/participant-name-dialog'
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
  const [showNameDialog, setShowNameDialog] = useState(false)
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

      // Check if user is the owner
      const userIsOwner = user && quiz.createdBy === user.id
      setIsOwner(!!userIsOwner)

      // Access was already verified in loadQuizForSharing
      setAccessDenied(false)
    } else {
      // Quiz not found or no access
      setAccessDenied(true)
    }
  }

  const handleStartQuiz = () => {
    if (currentQuiz) {
      // If user is authenticated, start quiz immediately
      if (user) {
        startQuiz()
      } else {
        // If user is not authenticated, show name dialog
        setShowNameDialog(true)
      }
    }
  }

  const handleNameSubmit = (name: string) => {
    setShowNameDialog(false)
    if (currentQuiz) {
      startQuiz(name)
    }
  }

  const handleBackToDashboard = () => {
    resetQuiz()
    router.push('/dashboard')
  }

  // Show loader while loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    )
  }

  // Show access denied
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
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                {error
                  ? 'Could not load the requested quiz'
                  : 'This quiz is private and you do not have permission to access it'}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="flex items-start gap-3 text-sm text-muted-foreground bg-muted p-3 rounded-md">
                <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="font-medium mb-1">Why can't I access this?</p>
                  <p>
                    Only quizzes marked as public can be shared and taken by
                    other users.
                  </p>
                </div>
              </div>
              <Button onClick={handleBackToDashboard} className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // If quiz is active, show quiz interface
  if (isQuizActive && currentQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          <QuizInterface />
        </div>
      </div>
    )
  }

  // Show quiz information before starting
  if (currentQuiz) {
    return (
      <>
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
                        Your Quiz
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Quiz information */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="font-bold text-lg">
                        {currentQuiz.questions.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Questions
                      </div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="font-bold text-lg capitalize">
                        {currentQuiz.difficulty}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Difficulty
                      </div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="font-bold text-lg">
                        {currentQuiz.timeLimit
                          ? `${currentQuiz.timeLimit} min`
                          : 'No limit'}
                      </div>
                      <div className="text-sm text-muted-foreground">Time</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="font-bold text-lg">
                        {currentQuiz.isPublic ? 'Public' : 'Private'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Visibility
                      </div>
                    </div>
                  </div>

                  {/* Topics */}
                  <div>
                    <h3 className="font-medium mb-2">Included topics:</h3>
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

                  {/* Instructions */}
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Instructions:</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Select an answer for each question</li>
                      <li>
                        • You can navigate between questions using the buttons
                      </li>
                      {currentQuiz.timeLimit && (
                        <li>
                          • You have {currentQuiz.timeLimit} minutes to complete
                          the quiz
                        </li>
                      )}
                      <li>
                        • You will see your results immediately after finishing
                      </li>
                    </ul>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleBackToDashboard}
                      variant="outline"
                      className="flex-1"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handleStartQuiz}
                      className="flex-1 text-lg py-6"
                    >
                      Start Quiz
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Participant Name Dialog for anonymous users */}
        <ParticipantNameDialog
          open={showNameDialog}
          onNameSubmit={handleNameSubmit}
          quizTitle={currentQuiz.title}
        />
      </>
    )
  }

  // Fallback - this shouldn't normally be reached
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading quiz...</p>
      </div>
    </div>
  )
}
