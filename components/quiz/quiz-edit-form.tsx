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
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Plus, Save, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

interface QuizEditFormProps {
  quiz: Quiz
  onQuizUpdated: () => void
  onCancel: () => void
}

type FormData = Omit<Quiz, 'id' | 'createdAt' | 'createdBy'>

export function QuizEditForm({
  quiz,
  onQuizUpdated,
  onCancel,
}: QuizEditFormProps) {
  const { user } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [topics, setTopics] = useState<string[]>(quiz.topics)
  const [newTopic, setNewTopic] = useState('')

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
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
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  })

  const watchedQuestions = watch('questions')

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
    const currentOptions = watchedQuestions[questionIndex]?.options || []
    if (currentOptions.length < 4) {
      setValue(`questions.${questionIndex}.options`, [...currentOptions, ''])
    }
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const currentOptions = watchedQuestions[questionIndex]?.options || []
    if (currentOptions.length > 2) {
      const newOptions = currentOptions.filter(
        (_, index) => index !== optionIndex,
      )
      setValue(`questions.${questionIndex}.options`, newOptions)

      // Ajustar la respuesta correcta si es necesario
      const currentCorrect = watchedQuestions[questionIndex]?.correctAnswer || 0
      if (currentCorrect >= optionIndex && currentCorrect > 0) {
        setValue(
          `questions.${questionIndex}.correctAnswer`,
          Math.max(0, currentCorrect - 1),
        )
      }
    }
  }

  const onSubmit = async (data: FormData) => {
    if (!user) return

    setIsSubmitting(true)
    try {
      const updatedQuiz: Quiz = {
        ...data,
        id: quiz.id,
        createdAt: quiz.createdAt,
        createdBy: quiz.createdBy,
        topics,
      }

      const result = await updateQuiz(updatedQuiz, user.id)

      if (result.success) {
        toast({
          title: 'Quiz actualizado',
          description: 'Los cambios se han guardado correctamente.',
        })
        onQuizUpdated()
      } else {
        toast({
          title: 'Error al actualizar',
          description: result.errorMessage || 'No se pudo actualizar el quiz.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error inesperado',
        description: 'Ocurrió un error al actualizar el quiz.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información básica del quiz */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Quiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Título del Quiz</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Introduce el título del quiz"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="subject">Materia</Label>
              <Input
                id="subject"
                {...register('subject')}
                placeholder="Introduce la materia"
              />
              {errors.subject && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div>
              <Label>Temas</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="Añadir tema"
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
                    key={index}
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
                <Label htmlFor="difficulty">Dificultad</Label>
                <Select
                  value={watch('difficulty')}
                  onValueChange={(value: 'easy' | 'medium' | 'hard') =>
                    setValue('difficulty', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la dificultad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Fácil</SelectItem>
                    <SelectItem value="medium">Medio</SelectItem>
                    <SelectItem value="hard">Difícil</SelectItem>
                  </SelectContent>
                </Select>
                {errors.difficulty && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.difficulty.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="timeLimit">Límite de tiempo (minutos)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  {...register('timeLimit', { valueAsNumber: true })}
                  placeholder="Opcional"
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

        {/* Preguntas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Preguntas</CardTitle>
            <Button type="button" onClick={addQuestion} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Añadir Pregunta
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <AnimatePresence>
              {fields.map((field, questionIndex) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border rounded-lg p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">
                      Pregunta {questionIndex + 1}
                    </h4>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(questionIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div>
                    <Label>Texto de la pregunta</Label>
                    <Textarea
                      {...register(`questions.${questionIndex}.question`)}
                      placeholder="Introduce la pregunta"
                      rows={2}
                    />
                    {errors.questions?.[questionIndex]?.question && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.questions[questionIndex]?.question?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Opciones de respuesta</Label>
                      <Button
                        type="button"
                        onClick={() => addOption(questionIndex)}
                        size="sm"
                        variant="outline"
                        disabled={
                          watchedQuestions[questionIndex]?.options?.length >= 4
                        }
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {watchedQuestions[questionIndex]?.options?.map(
                        (option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="radio"
                              name={`question-${questionIndex}-correct`}
                              checked={
                                watch(
                                  `questions.${questionIndex}.correctAnswer`,
                                ) === optionIndex
                              }
                              onChange={() =>
                                setValue(
                                  `questions.${questionIndex}.correctAnswer`,
                                  optionIndex,
                                )
                              }
                              className="text-primary"
                            />
                            <Input
                              {...register(
                                `questions.${questionIndex}.options.${optionIndex}`,
                              )}
                              placeholder={`Opción ${optionIndex + 1}`}
                              className="flex-1"
                            />
                            {watchedQuestions[questionIndex]?.options?.length >
                              2 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  removeOption(questionIndex, optionIndex)
                                }
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                    {errors.questions?.[questionIndex]?.options && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.questions[questionIndex]?.options?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Explicación (opcional)</Label>
                    <Textarea
                      {...register(`questions.${questionIndex}.explanation`)}
                      placeholder="Explica por qué esta es la respuesta correcta"
                      rows={2}
                    />
                  </div>

                  <Separator />
                </motion.div>
              ))}
            </AnimatePresence>

            {fields.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p>No hay preguntas aún. Añade al menos una pregunta.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting || fields.length === 0}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
