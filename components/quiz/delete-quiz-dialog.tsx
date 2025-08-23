'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Quiz } from '@/types/quiz'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

interface DeleteQuizDialogProps {
  quiz: Quiz | null
  isOpen: boolean
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
}

export function DeleteQuizDialog({
  quiz,
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteQuizDialogProps) {
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    setError(null)
    try {
      await onConfirm()
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el quiz')
    }
  }

  const handleClose = () => {
    if (!isDeleting) {
      setError(null)
      onClose()
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar quiz?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que quieres eliminar el quiz{' '}
            <span className="font-semibold">"{quiz?.title}"</span>? Esta acción
            no se puede deshacer y se eliminarán todas las preguntas asociadas.
          </AlertDialogDescription>
          {error && (
            <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Eliminando...
              </>
            ) : (
              'Eliminar'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
