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
import { Quiz, QuizQuestion, QuizSchema } from '@/types/quiz'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Plus, Save, Trash2, X } from 'lucide-react'
import React, { memo, useCallback, useMemo, useRef, useState } from 'react'
import {
  FieldErrors,
  useFieldArray,
  useForm,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'

interface QuizEditFormProps {
  quiz: Quiz
  onQuizUpdated: () => void
  onCancel: () => void
}

type FormData = Omit<Quiz, 'id' | 'createdAt' | 'createdBy'>

// Componente optimizado para renderizar una opción individual
interface OptionItemProps {
  questionIndex: number
  optionIndex: number
  option: string
  isCorrect: boolean
  canRemove: boolean
  register: UseFormRegister<FormData>
  onSetCorrect: (questionIndex: number, optionIndex: number) => void
  onRemoveOption: (questionIndex: number, optionIndex: number) => void
  errors?: FieldErrors<FormData>
}

const OptionItem = memo(
  ({
    questionIndex,
    optionIndex,
    option,
    isCorrect,
    canRemove,
    register,
    onSetCorrect,
    onRemoveOption,
    errors,
  }: OptionItemProps) => {
    const handleCorrectChange = useCallback(() => {
      onSetCorrect(questionIndex, optionIndex)
    }, [questionIndex, optionIndex, onSetCorrect])

    const handleRemove = useCallback(() => {
      onRemoveOption(questionIndex, optionIndex)
    }, [questionIndex, optionIndex, onRemoveOption])

    return (
      <div className="flex items-center gap-2">
        <input
          type="radio"
          name={`question-${questionIndex}-correct`}
          checked={isCorrect}
          onChange={handleCorrectChange}
          className="text-primary"
        />
        <Input
          {...register(`questions.${questionIndex}.options.${optionIndex}`)}
          placeholder={`Opción ${optionIndex + 1}`}
          className="flex-1"
        />
        {canRemove && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemove}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    )
  },
)

OptionItem.displayName = 'OptionItem'

// Componente optimizado para renderizar una pregunta individual
interface QuestionItemProps {
  questionIndex: number
  question: QuizQuestion & { id: string }
  register: UseFormRegister<FormData>
  setValue: UseFormSetValue<FormData>
  watch: UseFormWatch<FormData>
  onRemoveQuestion: (index: number) => void
  onAddOption: (questionIndex: number) => void
  onRemoveOption: (questionIndex: number, optionIndex: number) => void
  errors?: FieldErrors<FormData>
}

const QuestionItem = memo(
  ({
    questionIndex,
    question,
    register,
    setValue,
    watch,
    onRemoveQuestion,
    onAddOption,
    onRemoveOption,
    errors,
  }: QuestionItemProps) => {
    // Memorizamos los valores que necesitamos para evitar re-renders innecesarios
    const options = useMemo(() => question.options || [], [question.options])
    const correctAnswer = useMemo(
      () => question.correctAnswer || 0,
      [question.correctAnswer],
    )

    const handleRemoveQuestion = useCallback(() => {
      onRemoveQuestion(questionIndex)
    }, [questionIndex, onRemoveQuestion])

    const handleAddOption = useCallback(() => {
      onAddOption(questionIndex)
    }, [questionIndex, onAddOption])

    const handleSetCorrect = useCallback(
      (qIndex: number, optionIndex: number) => {
        setValue(`questions.${qIndex}.correctAnswer`, optionIndex)
      },
      [setValue],
    )

    const handleRemoveOption = useCallback(
      (qIndex: number, optionIndex: number) => {
        onRemoveOption(qIndex, optionIndex)
      },
      [onRemoveOption],
    )

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="border rounded-lg p-4 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Pregunta {questionIndex + 1}</h4>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemoveQuestion}
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
          {errors?.questions?.[questionIndex]?.question && (
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
              onClick={handleAddOption}
              size="sm"
              variant="outline"
              disabled={options.length >= 4}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {options.map((option, optionIndex) => (
              <OptionItem
                key={`${questionIndex}-${optionIndex}`}
                questionIndex={questionIndex}
                optionIndex={optionIndex}
                option={option}
                isCorrect={correctAnswer === optionIndex}
                canRemove={options.length > 2}
                register={register}
                onSetCorrect={handleSetCorrect}
                onRemoveOption={handleRemoveOption}
                errors={errors}
              />
            ))}
          </div>
          {errors?.questions?.[questionIndex]?.options && (
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
    )
  },
)

QuestionItem.displayName = 'QuestionItem'

// Componente optimizado para la sección de temas
interface TopicsSectionProps {
  topics: string[]
  newTopic: string
  onNewTopicChange: (value: string) => void
  onAddTopic: () => void
  onRemoveTopic: (topic: string) => void
  errors?: FieldErrors<FormData>
}

const TopicsSection = memo(
  ({
    topics,
    newTopic,
    onNewTopicChange,
    onAddTopic,
    onRemoveTopic,
    errors,
  }: TopicsSectionProps) => {
    const handleKeyPress = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          onAddTopic()
        }
      },
      [onAddTopic],
    )

    return (
      <div>
        <Label>Temas</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newTopic}
            onChange={(e) => onNewTopicChange(e.target.value)}
            placeholder="Añadir tema"
            onKeyPress={handleKeyPress}
          />
          <Button type="button" onClick={onAddTopic} size="sm">
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
                onClick={() => onRemoveTopic(topic)}
                className="ml-1 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        {errors?.topics && (
          <p className="text-red-500 text-sm mt-1">{errors.topics.message}</p>
        )}
      </div>
    )
  },
)

TopicsSection.displayName = 'TopicsSection'

// Hook personalizado para virtualización de preguntas (mejorado)
const useVirtualization = (
  items: any[],
  containerHeight = 600,
  itemHeight = 450, // Altura más realista para preguntas
) => {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Solo virtualizar con muchas preguntas para evitar problemas innecesarios
  const shouldVirtualize = items.length > 8

  const visibleRange = useMemo(() => {
    if (!shouldVirtualize) {
      return { start: 0, end: items.length }
    }

    const start = Math.floor(scrollTop / itemHeight)
    const visibleCount = Math.ceil(containerHeight / itemHeight) + 2 // Buffer extra
    const end = Math.min(start + visibleCount, items.length)

    return {
      start: Math.max(0, start - 1), // Buffer anterior
      end: Math.min(end + 1, items.length), // Buffer posterior
    }
  }, [scrollTop, itemHeight, items.length, containerHeight, shouldVirtualize])

  const visibleItems = useMemo(() => {
    if (!shouldVirtualize) {
      return items.map((item, index) => ({ ...item, virtualIndex: index }))
    }

    return items
      .slice(visibleRange.start, visibleRange.end)
      .map((item, index) => ({
        ...item,
        virtualIndex: visibleRange.start + index,
      }))
  }, [items, visibleRange, shouldVirtualize])

  const totalHeight = shouldVirtualize ? items.length * itemHeight : 'auto'
  const offsetY = shouldVirtualize ? visibleRange.start * itemHeight : 0

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (shouldVirtualize) {
        // Throttle scroll updates para mejor performance
        const newScrollTop = e.currentTarget.scrollTop
        setScrollTop(newScrollTop)
      }
    },
    [shouldVirtualize],
  )

  return {
    containerRef,
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    shouldVirtualize,
  }
}

const QuizEditForm = memo(
  ({ quiz, onQuizUpdated, onCancel }: QuizEditFormProps) => {
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
      getValues,
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

    // Memorizamos las funciones para evitar re-renders
    const addTopic = useCallback(() => {
      if (newTopic.trim() && !topics.includes(newTopic.trim())) {
        const updatedTopics = [...topics, newTopic.trim()]
        setTopics(updatedTopics)
        setValue('topics', updatedTopics)
        setNewTopic('')
      }
    }, [newTopic, topics, setValue])

    const removeTopic = useCallback(
      (topicToRemove: string) => {
        const updatedTopics = topics.filter((topic) => topic !== topicToRemove)
        setTopics(updatedTopics)
        setValue('topics', updatedTopics)
      },
      [topics, setValue],
    )

    const addQuestion = useCallback(() => {
      append({
        id: `temp-${Date.now()}`,
        question: '',
        options: ['', ''],
        correctAnswer: 0,
        explanation: '',
      })
    }, [append])

    const addOption = useCallback(
      (questionIndex: number) => {
        const currentQuestions = getValues('questions')
        const currentOptions = currentQuestions[questionIndex]?.options || []
        if (currentOptions.length < 4) {
          setValue(`questions.${questionIndex}.options`, [
            ...currentOptions,
            '',
          ])
        }
      },
      [setValue, getValues],
    )

    const removeOption = useCallback(
      (questionIndex: number, optionIndex: number) => {
        const currentQuestions = getValues('questions')
        const currentOptions = currentQuestions[questionIndex]?.options || []

        if (currentOptions.length > 2) {
          const newOptions = currentOptions.filter(
            (_, index) => index !== optionIndex,
          )
          setValue(`questions.${questionIndex}.options`, newOptions)

          // Ajustar la respuesta correcta si es necesario
          const currentCorrect =
            currentQuestions[questionIndex]?.correctAnswer || 0
          if (currentCorrect >= optionIndex && currentCorrect > 0) {
            setValue(
              `questions.${questionIndex}.correctAnswer`,
              Math.max(0, currentCorrect - 1),
            )
          }
        }
      },
      [setValue, getValues],
    )

    const removeQuestion = useCallback(
      (index: number) => {
        remove(index)
      },
      [remove],
    )

    const onSubmit = useCallback(
      async (data: FormData) => {
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
              description:
                result.errorMessage || 'No se pudo actualizar el quiz.',
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
      },
      [user, quiz.id, quiz.createdAt, quiz.createdBy, topics, onQuizUpdated],
    )

    // Memorizamos los handlers
    const handleNewTopicChange = useCallback((value: string) => {
      setNewTopic(value)
    }, [])

    const handleDifficultyChange = useCallback(
      (value: 'easy' | 'medium' | 'hard') => {
        setValue('difficulty', value)
      },
      [setValue],
    )

    // Memorizamos el valor de dificultad para evitar re-renders
    const currentDifficulty = watch('difficulty')

    // Virtualización para muchas preguntas
    const {
      containerRef,
      visibleItems,
      totalHeight,
      offsetY,
      handleScroll,
      shouldVirtualize,
    } = useVirtualization(fields)

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

              <TopicsSection
                topics={topics}
                newTopic={newTopic}
                onNewTopicChange={handleNewTopicChange}
                onAddTopic={addTopic}
                onRemoveTopic={removeTopic}
                errors={errors}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="difficulty">Dificultad</Label>
                  <Select
                    value={currentDifficulty}
                    onValueChange={handleDifficultyChange}
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
            <CardContent>
              {shouldVirtualize ? (
                // Versión virtualizada para muchas preguntas (8+)
                <div
                  ref={containerRef}
                  onScroll={handleScroll}
                  className="overflow-auto border rounded-lg"
                  style={{
                    height: '600px',
                    scrollBehavior: 'smooth',
                  }}
                >
                  <div
                    style={{
                      height:
                        typeof totalHeight === 'number'
                          ? `${totalHeight}px`
                          : totalHeight,
                      position: 'relative',
                      paddingTop: `${offsetY}px`,
                    }}
                  >
                    <div className="space-y-4 p-4">
                      {visibleItems.map((field) => (
                        <div key={field.id} className="mb-4">
                          <QuestionItem
                            questionIndex={field.virtualIndex}
                            question={field}
                            register={register}
                            setValue={setValue}
                            watch={watch}
                            onRemoveQuestion={removeQuestion}
                            onAddOption={addOption}
                            onRemoveOption={removeOption}
                            errors={errors}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Versión normal para pocas preguntas (mejor UX)
                <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                  <AnimatePresence>
                    {visibleItems.map((field, index) => (
                      <QuestionItem
                        key={field.id}
                        questionIndex={field.virtualIndex || index}
                        question={field}
                        register={register}
                        setValue={setValue}
                        watch={watch}
                        onRemoveQuestion={removeQuestion}
                        onAddOption={addOption}
                        onRemoveOption={removeOption}
                        errors={errors}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}

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
            <Button
              type="submit"
              disabled={isSubmitting || fields.length === 0}
            >
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
  },
)

QuizEditForm.displayName = 'QuizEditForm'

export { QuizEditForm }
export default QuizEditForm
