'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
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
import { FileText, Plus, Sparkles, Trash2, Upload, X } from 'lucide-react'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

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
  const { user } = useAuthStore()

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

  const difficulty = watch('difficulty')

  const onSubmit = async (data: any) => {
    setIsGenerating(true)
    setError(null)

    try {
      if (!user) {
        setError('Debes estar autenticado para generar un quiz')
        setIsGenerating(false)
        return
      }

      const {
        success,
        data: quiz,
        errorMessage,
      } = await generateQuiz(data, user.id)

      if (!success && !quiz) {
        setError(errorMessage ?? 'Failed to generate quiz. Please try again.')
        setIsGenerating(false)
        return
      }

      addGeneratedQuiz(quiz!)
      onQuizGenerated?.()
    } catch (error) {
      setError('Failed to generate quiz. Please try again.')
      console.error('Quiz generation error:', error)
    } finally {
      setIsGenerating(false)
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
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileExtension = file.name.split('.').pop()?.toLowerCase()

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
        }
      }
    }

    if (validFiles.length > 0) {
      setUploadedFiles((prev: File[]) => [...prev, ...validFiles])
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          Generate Quiz
        </CardTitle>
      </CardHeader>
      <CardContent>
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
            <div className="space-y-3">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Haz clic para subir</span>{' '}
                      o arrastra archivos
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF o DOCX (Máximo 10MB por archivo)
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
                <div className="space-y-2">
                  <p className="text-sm font-medium">Archivos seleccionados:</p>
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
          >
            <Button
              type="submit"
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Generando Quiz...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Generar Quiz
                </div>
              )}
            </Button>
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
      </CardContent>
    </Card>
  )
}
