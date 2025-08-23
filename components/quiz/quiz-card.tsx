'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Quiz } from '@/types/quiz'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Calendar,
  Clock,
  Download,
  Edit,
  FileText,
  MoreVertical,
  Share,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { DeleteQuizDialog } from './delete-quiz-dialog'
import { ExportProgressDialog } from './export-progress-dialog'
import { ShareQuizDialog } from './share-quiz-dialog'

type ExportFormat = 'pdf' | 'docx'
type ExportType = 'questions' | 'answers' | 'both'

interface QuizCardProps {
  quiz: Quiz
  onStartQuiz: (quiz: Quiz) => void
  onEditQuiz: (quiz: Quiz) => void
  onViewResponses?: (quiz: Quiz) => void
  onDeleteQuiz?: (quiz: Quiz) => Promise<void>
  onUpdateQuizVisibility?: (quizId: string, isPublic: boolean) => Promise<void>
  onExportQuiz?: (
    quiz: Quiz,
    format: ExportFormat,
    type: ExportType,
  ) => Promise<void>
}

export function QuizCard({
  quiz,
  onStartQuiz,
  onEditQuiz,
  onViewResponses,
  onDeleteQuiz,
  onUpdateQuizVisibility,
  onExportQuiz,
}: QuizCardProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportStatus, setExportStatus] = useState<
    'preparing' | 'exporting' | 'completed' | 'error'
  >('preparing')
  const [exportFormat, setExportFormat] = useState<ExportFormat | null>(null)
  const [exportType, setExportType] = useState<ExportType | null>(null)
  const [exportError, setExportError] = useState<string | undefined>(undefined)

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    hard: 'bg-red-100 text-red-800 border-red-200',
  }

  const handleShare = () => {
    setIsShareDialogOpen(true)
  }

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true)
  }

  const handleViewResponses = () => {
    if (onViewResponses) {
      onViewResponses(quiz)
    }
  }

  const handleExport = async (format: ExportFormat, type: ExportType) => {
    // Configurar estado inicial
    setExportFormat(format)
    setExportType(type)
    setExportProgress(0)
    setExportStatus('preparing')
    setExportError(undefined)
    setIsExportDialogOpen(true)

    try {
      // Simulación de progreso para preparación
      setExportProgress(20)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Cambiar a estado de exportación
      setExportStatus('exporting')
      setExportProgress(50)

      if (onExportQuiz) {
        await onExportQuiz(quiz, format, type)
      }

      // Completar
      setExportProgress(100)
      setExportStatus('completed')
    } catch (error: any) {
      setExportStatus('error')
      setExportError(error.message || 'Error al exportar el quiz')
    }
  }

  const handleDeleteConfirm = async () => {
    if (onDeleteQuiz) {
      setIsDeleting(true)
      try {
        await onDeleteQuiz(quiz)
        setIsDeleteDialogOpen(false)
      } catch (error) {
        console.error('Error al eliminar quiz:', error)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-lg line-clamp-2">{quiz.title}</CardTitle>
            <Badge className={`ml-2 ${difficultyColors[quiz.difficulty]}`}>
              {quiz.difficulty}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">{quiz.subject}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {quiz.topics.map((topic, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {topic}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <CardContent className="flex-1">
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{quiz.questions.length} questions</span>
            </div>
            {quiz.timeLimit && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{quiz.timeLimit} min</span>
              </div>
            )}
          </div>

          <div className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            <span>Created {format(quiz.createdAt, 'MMM dd, yyyy')}</span>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button
            onClick={() => onStartQuiz(quiz)}
            className="w-full"
            size="sm"
          >
            Comenzar Quiz
          </Button>
          <div className="flex gap-2 w-full">
            <Button
              onClick={() => onEditQuiz(quiz)}
              variant="outline"
              className="flex-1"
              size="sm"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex-1" size="sm">
                  <MoreVertical className="w-4 h-4 mr-2" />
                  Más opciones
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleShare}>
                  <Share className="w-4 h-4 mr-2" />
                  Compartir
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleViewResponses}>
                  <FileText className="w-4 h-4 mr-2" />
                  Ver respuestas
                </DropdownMenuItem>

                {/* Submenu de Exportación */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Download className="w-4 h-4 mr-2" />
                    Exportar como
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-56">
                    {/* Opciones PDF */}
                    <div className="px-2 py-1.5 text-sm font-semibold text-gray-900">
                      PDF
                    </div>
                    <DropdownMenuItem
                      onClick={() => handleExport('pdf', 'questions')}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Solo preguntas
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleExport('pdf', 'answers')}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Solo respuestas
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleExport('pdf', 'both')}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Preguntas y respuestas
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Opciones DOCX */}
                    <div className="px-2 py-1.5 text-sm font-semibold text-gray-900">
                      DOCX
                    </div>
                    <DropdownMenuItem
                      onClick={() => handleExport('docx', 'questions')}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Solo preguntas
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleExport('docx', 'answers')}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Solo respuestas
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleExport('docx', 'both')}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Preguntas y respuestas
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDeleteClick}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardFooter>
      </Card>

      <ShareQuizDialog
        quiz={quiz}
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        onUpdateQuizVisibility={onUpdateQuizVisibility}
      />

      <DeleteQuizDialog
        quiz={quiz}
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      <ExportProgressDialog
        isOpen={isExportDialogOpen}
        quiz={quiz}
        format={exportFormat}
        type={exportType}
        progress={exportProgress}
        status={exportStatus}
        error={exportError}
        onClose={() => setIsExportDialogOpen(false)}
      />
    </motion.div>
  )
}

// Exportar tipos para uso en otros componentes
export type { ExportFormat, ExportType }
