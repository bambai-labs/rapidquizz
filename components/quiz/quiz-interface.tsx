'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

import { useQuizStore } from '@/stores/quiz-store'
import { QuizAnswer } from '@/types/quiz'

export function QuizInterface() {
  const {
    currentQuiz,
    currentQuestionIndex,
    answers,
    startTime,
    isQuizActive,
    nextQuestion,
    previousQuestion,
    submitAnswer,
    finishQuiz,
  } = useQuizStore()

  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [questionStartTime, setQuestionStartTime] = useState<Date>(new Date())
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)

  const currentQuestion = currentQuiz?.questions[currentQuestionIndex]
  const isLastQuestion =
    currentQuiz && currentQuestionIndex === currentQuiz.questions.length - 1
  const progress = currentQuiz
    ? ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100
    : 0

  // Timer effect
  useEffect(() => {
    if (!currentQuiz?.timeLimit || !startTime) return

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime.getTime()) / 1000 / 60 // minutes
      const remaining = currentQuiz.timeLimit! - elapsed

      if (remaining <= 0) {
        finishQuiz()
        setTimeRemaining(0)
      } else {
        setTimeRemaining(Math.ceil(remaining))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [currentQuiz?.timeLimit, startTime, finishQuiz])

  // Reset selected option when question changes
  useEffect(() => {
    const existingAnswer = answers.find(
      (a) => a.questionId === currentQuestion?.id,
    )
    setSelectedOption(existingAnswer?.selectedAnswer ?? null)
    setQuestionStartTime(new Date())
  }, [currentQuestionIndex, currentQuestion?.id, answers])

  if (!currentQuiz || !currentQuestion || !isQuizActive) {
    return null
  }

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex)
  }

  const handleNext = () => {
    if (selectedOption !== null) {
      const timeSpent = (Date.now() - questionStartTime.getTime()) / 1000
      const answer: QuizAnswer = {
        questionId: currentQuestion.id,
        selectedAnswer: selectedOption,
        timeSpent,
      }

      submitAnswer(answer)

      if (isLastQuestion) {
        finishQuiz()
      } else {
        nextQuestion()
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      previousQuestion()
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">{currentQuiz.title}</h1>
            <p className="text-muted-foreground">
              Question {currentQuestionIndex + 1} of{' '}
              {currentQuiz.questions.length}
            </p>
          </div>

          {timeRemaining !== null && (
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <Badge variant={timeRemaining <= 5 ? 'destructive' : 'secondary'}>
                {timeRemaining} min left
              </Badge>
            </div>
          )}
        </div>

        <Progress value={progress} className="h-2" />
      </motion.div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl leading-relaxed">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedOption === index

                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        onClick={() => handleOptionSelect(index)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                          isSelected
                            ? 'border-primary bg-primary/10 shadow-md'
                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-muted-foreground'
                            }`}
                          >
                            {isSelected && <CheckCircle className="w-4 h-4" />}
                          </div>
                          <span className="font-medium">{option}</span>
                        </div>
                      </button>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mt-6"
      >
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {currentQuiz.questions.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index < currentQuestionIndex
                  ? 'bg-green-500'
                  : index === currentQuestionIndex
                    ? 'bg-primary'
                    : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={selectedOption === null}
          className="min-w-[120px]"
        >
          {isLastQuestion ? 'Finish Quiz' : 'Next'}
          {!isLastQuestion && <ChevronRight className="w-4 h-4 ml-2" />}
        </Button>
      </motion.div>
    </div>
  )
}
