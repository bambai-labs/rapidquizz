'use client'

import { useCallback, useEffect, useState } from 'react'

export interface QuizLimits {
  withFiles: {
    used: number
    limit: number
    remaining: number
  }
  withoutFiles: {
    used: number
    limit: number
    remaining: number
  }
  hasActiveSubscription: boolean
  subscriptionInfo?: {
    status: 'active' | 'canceled' | 'paused' | 'expired'
    endsAt: string
    daysRemaining: number
  }
}

interface UseQuizLimitsReturn {
  limits: QuizLimits | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  canCreateQuiz: (withFiles: boolean) => boolean
  getLimitMessage: (withFiles: boolean) => string
}

export function useQuizLimits(): UseQuizLimitsReturn {
  const [limits, setLimits] = useState<QuizLimits | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLimits = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/quiz-limits')

      if (!response.ok) {
        throw new Error('Error al obtener límites de quiz')
      }

      const data = await response.json()
      console.log('Limits data:', data)
      setLimits(data)
    } catch (err: any) {
      console.error('Error fetching quiz limits:', err)
      setError(err.message || 'Error al cargar límites')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLimits()
  }, [fetchLimits])

  const canCreateQuiz = useCallback(
    (withFiles: boolean): boolean => {
      if (!limits) return false
      if (limits.hasActiveSubscription) return true

      if (withFiles) {
        return limits.withFiles.remaining > 0
      } else {
        return limits.withoutFiles.remaining > 0
      }
    },
    [limits],
  )

  const getLimitMessage = useCallback(
    (withFiles: boolean): string => {
      if (!limits) return ''
      if (limits.hasActiveSubscription)
        return 'Quizzes ilimitados con tu suscripción Pro'

      if (withFiles) {
        return `${limits.withFiles.remaining} de ${limits.withFiles.limit} quizzes con archivos restantes este mes`
      } else {
        return `${limits.withoutFiles.remaining} de ${limits.withoutFiles.limit} quizzes sin archivos restantes este mes`
      }
    },
    [limits],
  )

  return {
    limits,
    isLoading,
    error,
    refetch: fetchLimits,
    canCreateQuiz,
    getLimitMessage,
  }
}
