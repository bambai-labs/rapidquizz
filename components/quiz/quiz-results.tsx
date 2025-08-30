'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useQuizStore } from '@/stores/quiz-store'
import { motion } from 'framer-motion'
import {
  CheckCircle,
  Clock,
  RotateCcw,
  Target,
  Trophy,
  XCircle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { HashLoader } from 'react-spinners'

export function QuizResults() {
  const { currentQuiz, results, resetQuiz, answers } = useQuizStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const onGoHome = () => {
    router.replace('/dashboard')
    setIsLoading(true)
    resetQuiz()
    setIsLoading(false)
  }

  // If loading, show loader
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center gap-4 mt-6">
          <HashLoader color="#000" />
        </div>
      </div>
    )
  }

  // If no results or no quiz and NOT loading, show error message
  if ((!results || !currentQuiz) && !isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center gap-4 mt-6">
          <h1 className="text-2xl font-bold">No results found</h1>
          <p className="text-muted-foreground">
            Please return to the main page and start a new quiz
          </p>
          <Button variant="outline" onClick={onGoHome}>
            Back to home
          </Button>
        </div>
      </div>
    )
  }

  const correctAnswers = answers.filter((answer) => {
    const question = currentQuiz!.questions.find(
      (q) => q.id === answer.questionId,
    )
    return question && question.correctAnswer === answer.selectedAnswer
  }).length

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: 'Excellent!', variant: 'default' as const }
    if (score >= 80)
      return { label: 'Great Job!', variant: 'secondary' as const }
    if (score >= 70)
      return { label: 'Good Work!', variant: 'secondary' as const }
    if (score >= 60)
      return { label: 'Keep Practicing', variant: 'outline' as const }
    return { label: 'Needs Improvement', variant: 'destructive' as const }
  }

  const scoreBadge = getScoreBadge(results!.score)

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
        </motion.div>

        <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
        <p className="text-muted-foreground">{currentQuiz!.title}</p>
      </motion.div>

      {/* Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold mb-2">
              <span className={getScoreColor(results!.score)}>
                {results!.score}%
              </span>
            </CardTitle>
            <Badge className="mx-auto" variant={scoreBadge.variant}>
              {scoreBadge.label}
            </Badge>
          </CardHeader>

          <CardContent>
            <Progress value={results!.score} className="h-3 mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <Target className="w-8 h-8 text-primary mb-2" />
                <div className="text-2xl font-bold">
                  {correctAnswers}/{results!.totalQuestions}
                </div>
                <div className="text-sm text-muted-foreground">
                  Correct Answers
                </div>
              </div>

              <div className="flex flex-col items-center">
                <Clock className="w-8 h-8 text-primary mb-2" />
                <div className="text-2xl font-bold">
                  {Math.floor(results!.timeSpent / 60)}:
                  {(results!.timeSpent % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-muted-foreground">Time Spent</div>
              </div>

              <div className="flex flex-col items-center">
                <Trophy className="w-8 h-8 text-primary mb-2" />
                <div className="text-2xl font-bold">
                  {Math.round(results!.timeSpent / results!.totalQuestions)}s
                </div>
                <div className="text-sm text-muted-foreground">
                  Avg. per Question
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Question Review */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4 mb-6"
      >
        <h2 className="text-xl font-semibold">Question Review</h2>

        {currentQuiz!.questions.map((question, index) => {
          const userAnswer = answers.find((a) => a.questionId === question.id)
          const isCorrect =
            userAnswer?.selectedAnswer === question.correctAnswer

          return (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card
                className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {question.question}
                      </CardTitle>
                      <div className="mt-3 space-y-2">
                        {question.options.map((option, optionIndex) => {
                          const isUserChoice =
                            userAnswer?.selectedAnswer === optionIndex
                          const isCorrectChoice =
                            question.correctAnswer === optionIndex

                          let className = 'p-2 rounded border text-sm '
                          if (isCorrectChoice) {
                            className +=
                              'bg-green-100 border-green-300 text-green-800'
                          } else if (isUserChoice && !isCorrect) {
                            className +=
                              'bg-red-100 border-red-300 text-red-800'
                          } else {
                            className += 'bg-muted/50 border-border'
                          }

                          return (
                            <div key={optionIndex} className={className}>
                              <span className="flex items-center gap-2">
                                {option}
                                {isCorrectChoice && (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                                {isUserChoice && !isCorrect && (
                                  <XCircle className="w-4 h-4" />
                                )}
                              </span>
                            </div>
                          )
                        })}
                      </div>

                      {question.explanation && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-800">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center"
      >
        <Button onClick={onGoHome} size="lg">
          <RotateCcw className="w-5 h-5 mr-2" />
          Take Another Quiz
        </Button>
      </motion.div>
    </div>
  )
}
