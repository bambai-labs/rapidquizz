'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { Quiz } from '@/types/quiz'
import { Copy, ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ShareQuizDialogProps {
  quiz: Quiz | null
  isOpen: boolean
  onClose: () => void
  onUpdateQuizVisibility?: (quizId: string, isPublic: boolean) => Promise<void>
}

export function ShareQuizDialog({
  quiz,
  isOpen,
  onClose,
  onUpdateQuizVisibility,
}: ShareQuizDialogProps) {
  const [isPublic, setIsPublic] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (quiz) {
      setIsPublic(quiz.isPublic || false)
      // Generar URL siempre con la misma ruta
      const baseUrl =
        typeof window !== 'undefined' ? window.location.origin : ''
      setShareUrl(`${baseUrl}/quiz/${quiz.id}`)
    }
  }, [quiz])

  const handleVisibilityChange = async (newIsPublic: boolean) => {
    if (!quiz || !onUpdateQuizVisibility) {
      setIsPublic(newIsPublic)
      return
    }

    setIsUpdating(true)
    try {
      await onUpdateQuizVisibility(quiz.id, newIsPublic)
      setIsPublic(newIsPublic)

      toast({
        title: 'Configuración actualizada',
        description: `El quiz ahora es ${newIsPublic ? 'público' : 'privado'}`,
      })
    } catch (error) {
      console.error('Error updating quiz visibility:', error)
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la configuración del quiz',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: 'Enlace copiado',
        description: 'El enlace se ha copiado al portapapeles',
      })
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      toast({
        title: 'Error',
        description: 'No se pudo copiar el enlace',
        variant: 'destructive',
      })
    }
  }

  const openInNewTab = () => {
    window.open(shareUrl, '_blank')
  }

  if (!quiz) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartir Quiz</DialogTitle>
          <DialogDescription>
            Configura cómo quieres compartir "{quiz.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Switch para público/privado */}
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-1">
              <Label htmlFor="public-switch">Hacer público</Label>
              <p className="text-sm text-muted-foreground">
                {isPublic
                  ? 'Cualquiera con el enlace puede acceder'
                  : 'Solo tú puedes acceder al quiz'}
              </p>
            </div>
            <Switch
              id="public-switch"
              checked={isPublic}
              onCheckedChange={handleVisibilityChange}
              disabled={isUpdating}
            />
          </div>

          {/* Campo del enlace */}
          <div className="space-y-2">
            <Label htmlFor="share-url">Enlace para compartir</Label>
            <div className="flex space-x-2">
              <Input
                id="share-url"
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
                title="Copiar enlace"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={openInNewTab}
                title="Abrir en nueva pestaña"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Información adicional */}
          <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
            <p>
              <strong>Público:</strong> El quiz aparecerá en búsquedas y
              cualquiera puede tomarlo
            </p>
            <p>
              <strong>Privado:</strong> Solo las personas con el enlace directo
              pueden acceder
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
