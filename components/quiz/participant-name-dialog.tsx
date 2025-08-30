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
import { User } from 'lucide-react'
import { useState } from 'react'

interface ParticipantNameDialogProps {
  open: boolean
  onNameSubmit: (name: string) => void
  quizTitle: string
}

export function ParticipantNameDialog({
  open,
  onNameSubmit,
  quizTitle,
}: ParticipantNameDialogProps) {
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      onNameSubmit(name.trim())
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValidName = name.trim().length >= 2

  return (
    <Dialog open={open} onOpenChange={() => {}} modal>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <User className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-center">Welcome!</DialogTitle>
          <DialogDescription className="text-center">
            Please enter your name to take the quiz "{quizTitle}". This will
            help identify your responses.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="participant-name">Your Name</Label>
            <Input
              id="participant-name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              autoFocus
              disabled={isSubmitting}
            />
            {name.trim() && name.trim().length < 2 && (
              <p className="text-sm text-muted-foreground">
                Name must be at least 2 characters long
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={!isValidName || isSubmitting}
            >
              {isSubmitting ? 'Starting Quiz...' : 'Start Quiz'}
            </Button>
          </DialogFooter>
        </form>

        <div className="text-xs text-muted-foreground text-center mt-4 border-t pt-4">
          Your name will only be used to identify your quiz responses and won't
          be shared publicly.
        </div>
      </DialogContent>
    </Dialog>
  )
}
