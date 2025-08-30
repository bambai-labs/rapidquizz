'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Quiz } from '@/types/quiz'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, Download, FileText } from 'lucide-react'
import React from 'react'
import { ExportFormat, ExportType } from './quiz-card'

interface ExportProgressDialogProps {
  isOpen: boolean
  quiz: Quiz | null
  format: ExportFormat | null
  type: ExportType | null
  progress: number
  status: 'preparing' | 'exporting' | 'completed' | 'error'
  error?: string
  onClose: () => void
}

export function ExportProgressDialog({
  isOpen,
  quiz,
  format,
  type,
  progress,
  status,
  error,
  onClose,
}: ExportProgressDialogProps) {
  const getTypeLabel = (type: ExportType | null) => {
    const typeMap = {
      questions: 'Questions only',
      answers: 'Answers only',
      both: 'Questions and answers',
    }
    return type ? typeMap[type] : ''
  }

  const getStatusMessage = () => {
    switch (status) {
      case 'preparing':
        return 'Preparing export...'
      case 'exporting':
        return 'Generating file...'
      case 'completed':
        return 'Export completed!'
      case 'error':
        return 'Export error'
      default:
        return 'Processing...'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'preparing':
      case 'exporting':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Download className="w-8 h-8 text-blue-600" />
          </motion.div>
        )
      case 'completed':
        return <CheckCircle className="w-8 h-8 text-green-600" />
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-600" />
      default:
        return <FileText className="w-8 h-8 text-gray-600" />
    }
  }

  const getProgressColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-blue-500'
    }
  }

  // Auto-close after 2 seconds if completed
  React.useEffect(() => {
    if (status === 'completed') {
      const timer = setTimeout(() => {
        onClose()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [status, onClose])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Export Quiz
          </DialogTitle>
          <DialogDescription>
            {quiz && (
              <>
                <span className="font-medium">{quiz.title}</span>
                <br />
                {format?.toUpperCase()} - {getTypeLabel(type)}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-4">
          {/* Status icon */}
          <div className="flex items-center justify-center">
            {getStatusIcon()}
          </div>

          {/* Status message */}
          <div className="text-center">
            <p className="text-lg font-medium">{getStatusMessage()}</p>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </div>

          {/* Progress bar */}
          {status !== 'error' && (
            <div className="w-full space-y-2">
              <Progress value={progress} className="w-full h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>{Math.round(progress)}%</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Additional message for completed status */}
          {status === 'completed' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-sm text-green-600">
                Download will start automatically
              </p>
              <p className="text-xs text-gray-500 mt-1">
                This dialog will close in 2 seconds
              </p>
            </motion.div>
          )}

          {/* Step indicators */}
          <div className="flex items-center justify-center space-x-4 w-full">
            <div
              className={`flex flex-col items-center space-y-1 ${
                status === 'preparing' ||
                status === 'exporting' ||
                status === 'completed'
                  ? 'text-blue-600'
                  : 'text-gray-400'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  status === 'preparing' ||
                  status === 'exporting' ||
                  status === 'completed'
                    ? 'bg-blue-600'
                    : 'bg-gray-300'
                }`}
              />
              <span className="text-xs">Preparing</span>
            </div>

            <div
              className={`w-8 h-0.5 ${
                status === 'exporting' || status === 'completed'
                  ? 'bg-blue-600'
                  : 'bg-gray-300'
              }`}
            />

            <div
              className={`flex flex-col items-center space-y-1 ${
                status === 'exporting' || status === 'completed'
                  ? 'text-blue-600'
                  : 'text-gray-400'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  status === 'exporting' || status === 'completed'
                    ? 'bg-blue-600'
                    : 'bg-gray-300'
                }`}
              />
              <span className="text-xs">Generating</span>
            </div>

            <div
              className={`w-8 h-0.5 ${
                status === 'completed' ? 'bg-green-600' : 'bg-gray-300'
              }`}
            />

            <div
              className={`flex flex-col items-center space-y-1 ${
                status === 'completed' ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  status === 'completed' ? 'bg-green-600' : 'bg-gray-300'
                }`}
              />
              <span className="text-xs">Completed</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
