'use client'
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
import { generateQuiz } from '@/lib/quiz-generator'
import { useAuthStore } from '@/stores/auth-store'
import { useQuizGeneratorStore } from '@/stores/quiz-generator-store'
import { QuizGeneratorSchema } from '@/types/quiz'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BookOpen,
  Brain,
  CheckCircle,
  Clock,
  Coffee,
  FileText,
  Heart,
  Lightbulb,
  Plus,
  Puzzle,
  RefreshCw,
  Rocket,
  Sparkles,
  Star,
  Target,
  Trash2,
  Trophy,
  Upload,
  Wand2,
  X,
  Zap,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface QuizGeneratorFormProps {
  onQuizGenerated?: () => void
  onCancel?: () => void
}

export function QuizGeneratorFormComponent({
  onQuizGenerated,
  onCancel,
}: QuizGeneratorFormProps) {
  const { isGenerating, addGeneratedQuiz, setIsGenerating, setError } =
    useQuizGeneratorStore()
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [currentMessage, setCurrentMessage] = useState(0)
  const [hasError, setHasError] = useState(false)
  const [lastFormData, setLastFormData] = useState<any>(null)
  const { user } = useAuthStore()

  const loadingMessages = [
    { text: '🧠 Analizando el contenido...', icon: Brain },
    { text: '💡 Generando preguntas inteligentes...', icon: Lightbulb },
    { text: '🎯 Ajustando la dificultad...', icon: Target },
    { text: '✨ Puliendo los detalles finales...', icon: Sparkles },
    { text: '✅ ¡Casi listo tu quiz perfecto!', icon: CheckCircle },
    { text: '☕ Tomando un café mientras proceso...', icon: Coffee },
    { text: '⚡ Cargando súper poderes de conocimiento...', icon: Zap },
    { text: '⭐ Añadiendo un toque de magia...', icon: Star },
    { text: '🚀 Preparando el despegue del quiz...', icon: Rocket },
    { text: '🪄 Conjurando preguntas fascinantes...', icon: Wand2 },
    { text: '📖 Hojeando bibliotecas de sabiduría...', icon: BookOpen },
    { text: '🧩 Ensamblando las piezas del rompecabezas...', icon: Puzzle },
    { text: '🏆 Creando un quiz digno de campeones...', icon: Trophy },
    { text: '⏰ El tiempo vuela cuando creas conocimiento...', icon: Clock },
    { text: '❤️ Poniendo amor en cada pregunta...', icon: Heart },
    { text: '🎨 Dando los toques artísticos finales...', icon: Sparkles },
    { text: '🔥 Encendiendo la chispa del aprendizaje...', icon: Zap },
    { text: '🎪 Montando el circo del conocimiento...', icon: Star },
    { text: '🎭 Ensayando el espectáculo educativo...', icon: Target },
    { text: '🌟 Espolvoreando polvo de estrellas...', icon: Star },
    { text: '🎵 Componiendo la sinfonía del saber...', icon: Heart },
    { text: '🍀 Añadiendo un toque de buena suerte...', icon: CheckCircle },
    { text: '🎈 Inflando globos de diversión...', icon: Rocket },
    { text: '🎊 Preparando la fiesta del conocimiento...', icon: Trophy },
    { text: '🌈 Pintando arcoíris de aprendizaje...', icon: Sparkles },
  ]

  // Efecto para cambiar mensajes durante la carga
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isGenerating) {
      interval = setInterval(() => {
        setCurrentMessage((prev) => (prev + 1) % loadingMessages.length)
      }, 1500) // Cambia mensaje cada 1.5 segundos para ver más variedad
    } else {
      setCurrentMessage(0)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isGenerating, loadingMessages.length])

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(QuizGeneratorSchema),
    defaultValues: {
      subject: '',
      topics: [''],
      difficulty: 'medium',
      questionCount: 5,
      timeLimit: 30,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'topics' as never,
  })

  const onSubmit = async (data: any) => {
    setIsGenerating(true)
    setError(null)
    setHasError(false)
    setLastFormData(data)

    try {
      if (!user) {
        const errorMsg = 'Debes estar autenticado para generar un quiz'
        setError(errorMsg)
        setHasError(true)
        toast.error('Error de autenticación', {
          description: errorMsg,
        })
        setIsGenerating(false)
        return
      }

      const {
        success,
        data: quiz,
        errorMessage,
      } = await generateQuiz(data, user!.id, uploadedFiles)

      if (!success && !quiz) {
        const errorMsg =
          errorMessage ??
          'Error al generar el quiz. Por favor intenta de nuevo.'
        setError(errorMsg)
        setHasError(true)
        toast.error('Error al generar quiz', {
          description: errorMsg,
          action: {
            label: 'Reintentar',
            onClick: () => handleRetry(),
          },
        })
        setIsGenerating(false)
        return
      }

      addGeneratedQuiz(quiz!)
      setHasError(false)
      toast.success('¡Quiz generado exitosamente!', {
        description: 'Tu quiz está listo para usar.',
      })
      onQuizGenerated?.()
    } catch (error) {
      const errorMsg =
        'Error inesperado al generar el quiz. Por favor intenta de nuevo.'
      setError(errorMsg)
      setHasError(true)
      console.error('Quiz generation error:', error)
      toast.error('Error inesperado', {
        description: errorMsg,
        action: {
          label: 'Reintentar',
          onClick: () => handleRetry(),
        },
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRetry = async () => {
    if (lastFormData) {
      await onSubmit(lastFormData)
    }
  }

  const addTopic = () => {
    append('')
  }

  const removeTopic = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const validFiles: File[] = []
    const rejectedFiles: string[] = []
    const maxFileSize = 10 * 1024 * 1024 // 10 MB en bytes
    const maxTotalSize = 50 * 1024 * 1024 // 50 MB total en bytes
    const currentTotalSize = getTotalFileSize()

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileExtension = file.name.split('.').pop()?.toLowerCase()

      // Verificar tamaño del archivo
      if (file.size > maxFileSize) {
        rejectedFiles.push(`${file.name} (excede 10 MB)`)
        continue
      }

      // Verificar si agregar este archivo excedería el límite total
      const newTotalSize =
        currentTotalSize +
        validFiles.reduce((sum, f) => sum + f.size, 0) +
        file.size
      if (newTotalSize > maxTotalSize) {
        rejectedFiles.push(`${file.name} (excedería límite total de 50 MB)`)
        continue
      }

      if (fileExtension === 'pdf' || fileExtension === 'docx') {
        // Check if file is not already added
        if (
          !uploadedFiles.some(
            (existingFile: File) =>
              existingFile.name === file.name &&
              existingFile.size === file.size,
          )
        ) {
          validFiles.push(file)
        } else {
          rejectedFiles.push(`${file.name} (ya está agregado)`)
        }
      } else {
        rejectedFiles.push(`${file.name} (formato no soportado)`)
      }
    }

    if (validFiles.length > 0) {
      setUploadedFiles((prev: File[]) => [...prev, ...validFiles])
      toast.success('Archivos agregados', {
        description: `${validFiles.length} archivo(s) agregado(s) exitosamente.`,
      })
    }

    if (rejectedFiles.length > 0) {
      toast.error('Algunos archivos no se pudieron agregar', {
        description: rejectedFiles.join(', '),
      })
    }

    // Reset input value to allow selecting the same file again
    event.target.value = ''
  }

  const removeFile = (indexToRemove: number) => {
    setUploadedFiles((prev: File[]) =>
      prev.filter((_: File, index: number) => index !== indexToRemove),
    )
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getTotalFileSize = () => {
    return uploadedFiles.reduce((total, file) => total + file.size, 0)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          Generate Quiz
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isGenerating ? (
          // Vista de carga - oculta el formulario
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-full max-w-md space-y-4">
              {/* Animación de carga entretenida */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
                {/* Mensaje animado con icono */}
                <motion.div
                  key={currentMessage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-center gap-3"
                >
                  <motion.div
                    animate={{
                      rotate: 360,
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      rotate: {
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                      },
                      scale: {
                        duration: 1,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      },
                    }}
                  >
                    {React.createElement(loadingMessages[currentMessage].icon, {
                      className: 'w-6 h-6 text-blue-600',
                    })}
                  </motion.div>
                  <span className="text-lg font-medium text-gray-700">
                    {loadingMessages[currentMessage].text}
                  </span>
                </motion.div>

                {/* Partículas flotantes */}
                <div className="relative mt-4 h-8 overflow-hidden">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-60"
                      initial={{
                        x: Math.random() * 400,
                        y: 32,
                      }}
                      animate={{
                        x: Math.random() * 400,
                        y: -10,
                        opacity: [0.6, 1, 0],
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        ease: 'easeOut',
                        delay: i * 0.5,
                      }}
                    />
                  ))}
                </div>

                {/* Spinner central más atractivo */}
                <div className="flex justify-center mt-2">
                  <motion.div className="relative w-8 h-8">
                    <motion.div className="absolute inset-0 border-4 border-blue-200 rounded-full" />
                    <motion.div
                      className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Texto adicional de espera */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center"
              >
                <p className="text-sm text-gray-500">
                  Estamos creando un quiz personalizado para ti...
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Esto puede tomar unos momentos
                </p>
              </motion.div>
            </div>
          </div>
        ) : (
          // Vista normal del formulario
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Subject */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="e.g., Mathematics, Science, History"
                {...register('subject')}
                className={errors.subject ? 'border-destructive' : ''}
              />
              {errors.subject && (
                <p className="text-sm text-destructive mt-1">
                  {errors.subject.message}
                </p>
              )}
            </motion.div>

            {/* Topics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <Label>Topics</Label>
              <AnimatePresence>
                {fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-2"
                  >
                    <Input
                      placeholder={`Topic ${index + 1}`}
                      {...register(`topics.${index}` as const)}
                      className={
                        errors.topics?.[index] ? 'border-destructive' : ''
                      }
                    />
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeTopic(index)}
                        className="shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              <Button
                type="button"
                variant="outline"
                onClick={addTopic}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Topic
              </Button>

              {errors.topics && (
                <p className="text-sm text-destructive">
                  {errors.topics.message}
                </p>
              )}
            </motion.div>

            {/* File Upload Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="space-y-3"
            >
              <Label>Archivos de referencia (opcional)</Label>
              <p className="text-xs text-gray-600 mb-2">
                Los archivos te ayudan a generar quizzes más precisos basados en
                tu contenido específico.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">
                          Haz clic para subir
                        </span>{' '}
                        o arrastra archivos
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF o DOCX (Máximo 10 MB por archivo, 50 MB total)
                      </p>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx"
                      multiple
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>

                {/* Lista de archivos subidos */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          Archivos seleccionados:
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(getTotalFileSize())} / 50 MB
                        </p>
                      </div>

                      {/* Barra de progreso del límite total */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            getTotalFileSize() > 40 * 1024 * 1024
                              ? 'bg-red-500'
                              : getTotalFileSize() > 30 * 1024 * 1024
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                          }`}
                          style={{
                            width: `${Math.min((getTotalFileSize() / (50 * 1024 * 1024)) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Advertencia si hay muchos archivos o tamaño grande */}
                    {(uploadedFiles.length > 5 ||
                      getTotalFileSize() > 30 * 1024 * 1024) && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-amber-800">
                          ⚠️{' '}
                          {uploadedFiles.length > 5
                            ? 'Muchos archivos pueden aumentar el tiempo de procesamiento.'
                            : getTotalFileSize() > 40 * 1024 * 1024
                              ? 'Te estás acercando al límite de 50 MB. Considera optimizar tus archivos.'
                              : 'Archivos grandes pueden aumentar el tiempo de procesamiento.'}
                        </p>
                      </div>
                    )}

                    <AnimatePresence>
                      {uploadedFiles.map((file: File, index: number) => (
                        <motion.div
                          key={`${file.name}-${index}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Difficulty and Question Count */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  onValueChange={(value: any) => setValue('difficulty', value)}
                  defaultValue="medium"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="questionCount">Number of Questions</Label>
                <Input
                  id="questionCount"
                  type="number"
                  min="1"
                  max="20"
                  {...register('questionCount', { valueAsNumber: true })}
                  className={errors.questionCount ? 'border-destructive' : ''}
                />
                {errors.questionCount && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.questionCount.message}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Time Limit */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Label htmlFor="timeLimit">Time Limit (minutes, optional)</Label>
              <Input
                id="timeLimit"
                type="number"
                min="1"
                max="120"
                placeholder="30"
                {...register('timeLimit', { valueAsNumber: true })}
                className={errors.timeLimit ? 'border-destructive' : ''}
              />
              {errors.timeLimit && (
                <p className="text-sm text-destructive mt-1">
                  {errors.timeLimit.message}
                </p>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <Button
                type="submit"
                disabled={isGenerating}
                className="w-full"
                size="lg"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Generar Quiz
                </div>
              </Button>

              {/* Retry Button - Solo se muestra cuando hay error */}
              <AnimatePresence>
                {hasError && !isGenerating && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleRetry}
                      disabled={isGenerating}
                      className="w-full border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 hover:text-orange-800"
                      size="lg"
                    >
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-5 h-5" />
                        Reintentar Generación
                      </div>
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Cancel Button */}
            {onCancel && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="-mt-3"
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isGenerating}
                  className="w-full"
                  size="lg"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </motion.div>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  )
}
