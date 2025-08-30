'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { updateQuiz } from '@/lib/quiz-database'
import { useAuthStore } from '@/stores/auth-store'
import { Quiz, QuizSchema } from '@/types/quiz'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Plus, Save, Trash2, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

interface QuizEditFormProps {
  quiz: Quiz
  onQuizUpdated: () => void
  onCancel: () => void
}

// Define FormData type to exactly match the omitted schema
type FormData = {
  title: string
  subject: string
  topics: string[]
  questions: {
    id: string
    question: string
    options: string[]
    correctAnswer: number
    explanation?: string
  }[]
  difficulty: 'easy' | 'medium' | 'hard'
  timeLimit?: number
  isPublic?: boolean
}

export const QuizEditForm = ({
  quiz,
  onQuizUpdated,
  onCancel,
}: QuizEditFormProps) => {
  const { user } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [topics, setTopics] = useState<string[]>(quiz.topics)
  const [newTopic, setNewTopic] = useState('')

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(
      QuizSchema.omit({ id: true, createdAt: true, createdBy: true }),
    ),
    defaultValues: {
      title: quiz.title,
      subject: quiz.subject,
      topics: quiz.topics,
      difficulty: quiz.difficulty,
      timeLimit: quiz.timeLimit,
      questions: quiz.questions,
      isPublic: quiz.isPublic,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  })

  // Simplify topic handling
  const addTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      const updatedTopics = [...topics, newTopic.trim()]
      setTopics(updatedTopics)
      setValue('topics', updatedTopics)
      setNewTopic('')
    }
  }

  const removeTopic = (topicToRemove: string) => {
    const updatedTopics = topics.filter((topic) => topic !== topicToRemove)
    setTopics(updatedTopics)
    setValue('topics', updatedTopics)
  }

  const addQuestion = () => {
    append({
      id: `temp-${Date.now()}`,
      question: '',
      options: ['', ''],
      correctAnswer: 0,
      explanation: '',
    })
  }

  const addOption = (questionIndex: number) => {
    const currentQuestions = getValues('questions')
    const currentOptions = currentQuestions[questionIndex]?.options || []
    if (currentOptions.length < 4) {
      setValue(`questions.${questionIndex}.options`, [...currentOptions, ''])
    }
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const currentQuestions = getValues('questions')
    const currentOptions = currentQuestions[questionIndex]?.options || []

    if (currentOptions.length > 2) {
      const newOptions = currentOptions.filter(
        (_, index) => index !== optionIndex,
      )
      setValue(`questions.${questionIndex}.options`, newOptions)

      // Adjust correct answer if necessary
      const currentCorrect = currentQuestions[questionIndex]?.correctAnswer || 0
      if (currentCorrect >= optionIndex && currentCorrect > 0) {
        setValue(
          `questions.${questionIndex}.correctAnswer`,
          Math.max(0, currentCorrect - 1),
        )
      }
    }
  }

  const removeQuestion = (index: number) => {
    remove(index)
  }

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to save changes.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    try {
      const updatedQuiz: Quiz = {
        ...data,
        id: quiz.id,
        createdAt: quiz.createdAt,
        createdBy: quiz.createdBy,
        topics: data.topics,
        isPublic: data.isPublic ?? false,
      }

      const result = await updateQuiz(updatedQuiz, user.id)

      if (result.success) {
        toast({
          title: 'Quiz updated',
          description: 'Changes have been saved successfully.',
        })
        onQuizUpdated()
      } else {
        toast({
          title: 'Update error',
          description: result.errorMessage || 'Could not update the quiz.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Unexpected error',
        description: 'An error occurred while updating the quiz.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDifficultyChange = (value: 'easy' | 'medium' | 'hard') => {
    setValue('difficulty', value)
  }

  // Remove complex virtualization and use a simpler solution
  const [visibleQuestions, setVisibleQuestions] = useState<number[]>([])
  const containerRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initially make all questions visible
    setVisibleQuestions(fields.map((_, index) => index))

    // For very long quizzes, we could implement simple virtualization
    // but for now we show all questions to avoid problems
  }, [fields])

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic quiz information */}
        <Card>
          <CardHeader>
            <CardTitle>Quiz Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Quiz Title</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Enter quiz title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                {...register('subject')}
                placeholder="Enter subject"
              />
              {errors.subject && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div>
              <Label>Topics</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="Add topic"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTopic()
                    }
                  }}
                />
                <Button type="button" onClick={addTopic} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {topics.map((topic, index) => (
                  <Badge
                    key={`${topic}-${index}`}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {topic}
                    <button
                      type="button"
                      onClick={() => removeTopic(topic)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              {errors.topics && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.topics.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={watch('difficulty')}
                  onValueChange={handleDifficultyChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                {errors.difficulty && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.difficulty.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="timeLimit">Time limit (minutes)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  {...register('timeLimit', { valueAsNumber: true })}
                  placeholder="Optional"
                />
                {errors.timeLimit && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.timeLimit.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Questions</CardTitle>
            <Button type="button" onClick={addQuestion} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </CardHeader>
          <CardContent>
            <div
              ref={containerRef}
              className="space-y-6 max-h-[70vh] overflow-y-auto"
            >
              {fields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Question {index + 1}</h4>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeQuestion(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div>
                    <Label>Question text</Label>
                    <Textarea
                      {...register(`questions.${index}.question`)}
                      placeholder="Enter the question"
                      rows={2}
                    />
                    {errors.questions?.[index]?.question && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.questions[index]?.question?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Answer options</Label>
                      <Button
                        type="button"
                        onClick={() => addOption(index)}
                        size="sm"
                        variant="outline"
                        disabled={
                          watch(`questions.${index}.options`).length >= 4
                        }
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {watch(`questions.${index}.options`)?.map(
                        (option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="radio"
                              name={`question-${index}-correct`}
                              checked={
                                watch(`questions.${index}.correctAnswer`) ===
                                optionIndex
                              }
                              onChange={() =>
                                setValue(
                                  `questions.${index}.correctAnswer`,
                                  optionIndex,
                                )
                              }
                              className="text-primary"
                            />
                            <Input
                              {...register(
                                `questions.${index}.options.${optionIndex}`,
                              )}
                              placeholder={`Option ${optionIndex + 1}`}
                              className="flex-1"
                            />
                            {watch(`questions.${index}.options`).length > 2 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeOption(index, optionIndex)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                    {errors.questions?.[index]?.options && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.questions[index]?.options?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Explanation (optional)</Label>
                    <Textarea
                      {...register(`questions.${index}.explanation`)}
                      placeholder="Explain why this is the correct answer"
                      rows={2}
                    />
                  </div>

                  <Separator />
                </div>
              ))}
            </div>

            {fields.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p>No questions yet. Add at least one question.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {Object.keys(errors).length > 0 && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-5 h-5" />
                <h3 className="font-semibold">Form Errors</h3>
              </div>
              <ul className="mt-2 list-disc list-inside">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>
                    {field}: {error.message}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        {/* Action buttons */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || fields.length === 0}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
