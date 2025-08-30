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
      // Always generate URL with the same path
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
        title: 'Settings updated',
        description: `The quiz is now ${newIsPublic ? 'public' : 'private'}`,
      })
    } catch (error) {
      console.error('Error updating quiz visibility:', error)
      toast({
        title: 'Error',
        description: 'Could not update quiz settings',
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
        title: 'Link copied',
        description: 'The link has been copied to the clipboard',
      })
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      toast({
        title: 'Error',
        description: 'Could not copy the link',
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
          <DialogTitle>Share Quiz</DialogTitle>
          <DialogDescription>
            Configure how you want to share "{quiz.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Switch for public/private */}
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-1">
              <Label htmlFor="public-switch">Make public</Label>
              <p className="text-sm text-muted-foreground">
                {isPublic
                  ? 'Anyone with the link can access'
                  : 'Only you can access the quiz'}
              </p>
            </div>
            <Switch
              id="public-switch"
              checked={isPublic}
              onCheckedChange={handleVisibilityChange}
              disabled={isUpdating}
            />
          </div>

          {/* Share link field */}
          <div className="space-y-2">
            <Label htmlFor="share-url">Share link</Label>
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
                title="Copy link"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={openInNewTab}
                title="Open in new tab"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Additional information */}
          <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
            <p>
              <strong>Public:</strong> The quiz will appear in searches and
              anyone can take it
            </p>
            <p>
              <strong>Private:</strong> Only people with the direct link can
              access
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
