'use client'

import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/stores/auth-store'
import { RealtimeChannel } from '@supabase/supabase-js'
import { useCallback, useEffect, useMemo, useState } from 'react'

// Tipos para la suscripción
export interface SubscriptionData {
  id: string
  user_id: string
  email: string
  paddle_user_id: string
  starts_at?: string
  ends_at?: string
  subscription_type: 'pro'
  status: 'active' | 'canceled' | 'paused' | 'expired'
  created_at: string
  updated_at: string
}

interface UseSubscriptionReturn {
  subscription: SubscriptionData | null
  hasActiveSubscription: boolean
  isLoading: boolean
  error: string | null
  isConnected: boolean
  lastUpdate: Date | null
  refetch: () => Promise<void>
}

/**
 * Hook principal para suscripciones con actualizaciones en tiempo real
 * Incluye estado de conexión y reconexión automática
 */
export function useSubscription(): UseSubscriptionReturn {
  const { user } = useAuthStore()
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    null,
  )
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  // Función para cargar datos iniciales
  const loadInitialData = useCallback(async () => {
    if (!user) {
      setSubscription(null)
      setHasActiveSubscription(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { data, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError
      }

      if (data) {
        setSubscription(data)
        setHasActiveSubscription(data.status === 'active')
        setLastUpdate(new Date())
      } else {
        setSubscription(null)
        setHasActiveSubscription(false)
      }
    } catch (err: any) {
      console.error('Error al cargar suscripción:', err)
      setError(err.message || 'Error al cargar suscripción')
      setSubscription(null)
      setHasActiveSubscription(false)
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  // Función para manejar cambios en tiempo real
  const handleRealtimeChange = useCallback((payload: any) => {
    console.log('🔄 Cambio en suscripción en tiempo real:', {
      eventType: payload.eventType,
      timestamp: new Date().toISOString(),
      old: payload.old,
      new: payload.new,
    })

    setLastUpdate(new Date())

    if (payload.eventType === 'DELETE') {
      console.log('🗑️ Suscripción eliminada en tiempo real')
      setSubscription(null)
      setHasActiveSubscription(false)
    } else if (
      payload.eventType === 'INSERT' ||
      payload.eventType === 'UPDATE'
    ) {
      const newSubscription = payload.new as SubscriptionData
      console.log(
        `📝 Suscripción ${payload.eventType.toLowerCase()} en tiempo real:`,
        {
          id: newSubscription.id,
          status: newSubscription.status,
          user_id: newSubscription.user_id,
        },
      )
      setSubscription(newSubscription)
      setHasActiveSubscription(newSubscription.status === 'active')
    }
  }, [])

  // Función para configurar la suscripción en tiempo real
  const setupRealtimeSubscription = useCallback(() => {
    if (!user?.id) return null

    console.log(`🔌 Configurando canal Realtime para usuario: ${user.id}`)
    const supabase = createClient()

    const newChannel = supabase
      .channel(`subscription_${user.id}_${Date.now()}`) // Agregar timestamp para evitar conflictos
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`,
        },
        handleRealtimeChange,
      )
      .subscribe((status) => {
        console.log(`🔌 Estado de conexión realtime: ${status}`)

        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
          setError(null)
          console.log('✅ Canal Realtime suscrito exitosamente')
        } else if (status === 'CHANNEL_ERROR') {
          setIsConnected(false)
          setError('Error en la conexión en tiempo real')
          console.error('❌ Error en el canal Realtime')
        } else if (status === 'TIMED_OUT') {
          setIsConnected(false)
          setError('Timeout en la conexión en tiempo real')
          console.error('⏰ Timeout en el canal Realtime')
        } else if (status === 'CLOSED') {
          setIsConnected(false)
          console.log('🔒 Canal Realtime cerrado')
        }
      })

    return newChannel
  }, [user?.id, handleRealtimeChange])

  // Efecto para cargar datos iniciales
  useEffect(() => {
    loadInitialData()
  }, [loadInitialData])

  // Efecto principal para gestionar la suscripción en tiempo real
  useEffect(() => {
    if (!user?.id) {
      // Limpiar estado cuando no hay usuario
      setSubscription(null)
      setHasActiveSubscription(false)
      setIsConnected(false)
      setError(null)

      // Limpiar canal existente
      if (channel) {
        console.log('🧹 Limpiando canal por falta de usuario')
        channel.unsubscribe()
        setChannel(null)
      }
      return
    }

    // Configurar suscripción en tiempo real
    const newChannel = setupRealtimeSubscription()
    if (newChannel) {
      setChannel(newChannel)
    }

    // Cleanup function
    return () => {
      if (newChannel) {
        console.log('🧹 Limpiando suscripción en tiempo real')
        newChannel.unsubscribe()
      }
    }
  }, [user?.id, setupRealtimeSubscription]) // Incluir setupRealtimeSubscription aquí ya que es estable

  // Efecto para manejar reconexión automática
  useEffect(() => {
    if (!isConnected && user?.id && !isLoading && channel) {
      console.log('🔄 Detectada desconexión, reintentando en 5 segundos...')

      const reconnectTimer = setTimeout(() => {
        console.log('🔄 Intentando reconectar...')

        // Limpiar canal anterior
        if (channel) {
          channel.unsubscribe()
        }

        // Crear nuevo canal
        const newChannel = setupRealtimeSubscription()
        if (newChannel) {
          setChannel(newChannel)
        }
      }, 5000) // Reintentar después de 5 segundos

      return () => clearTimeout(reconnectTimer)
    }
  }, [isConnected, user?.id, isLoading])

  return {
    subscription,
    hasActiveSubscription,
    isLoading,
    error,
    isConnected,
    lastUpdate,
    refetch: loadInitialData,
  }
}

/**
 * Hook simplificado que solo retorna si el usuario tiene suscripción activa
 */
export function useHasActiveSubscription() {
  const { hasActiveSubscription, isLoading, error, isConnected } =
    useSubscription()

  return {
    hasActiveSubscription,
    isLoading,
    error,
    isConnected,
  }
}

/**
 * Hook avanzado con información detallada y helpers útiles
 */
export function useSubscriptionStatus() {
  const {
    subscription,
    hasActiveSubscription,
    isLoading,
    error,
    refetch,
    isConnected,
    lastUpdate,
  } = useSubscription()

  const isExpired = subscription?.status === 'expired'
  const isCanceled = subscription?.status === 'canceled'
  const isPaused = subscription?.status === 'paused'
  const isActive = subscription?.status === 'active'

  // Calcular días restantes si hay fecha de fin
  const daysRemaining = useMemo(() => {
    if (!subscription?.ends_at) return null

    return Math.max(
      0,
      Math.ceil(
        (new Date(subscription.ends_at).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      ),
    )
  }, [subscription?.ends_at])

  // Determinar si la suscripción expira pronto (menos de 7 días)
  const expiringSoon =
    daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0

  return {
    subscription,
    hasActiveSubscription,
    isLoading,
    error,
    refetch,
    isConnected,
    lastUpdate,
    // Estados específicos
    isExpired,
    isCanceled,
    isPaused,
    isActive,
    // Información útil para la UI
    daysRemaining,
    expiringSoon,
    subscriptionType: subscription?.subscription_type || null,
    startDate: subscription?.starts_at
      ? new Date(subscription.starts_at)
      : null,
    endDate: subscription?.ends_at ? new Date(subscription.ends_at) : null,
  }
}

/**
 * Hook para mostrar notificaciones de cambios en la suscripción
 */
export function useSubscriptionNotifications() {
  const { subscription, lastUpdate, isConnected } = useSubscription()
  const [notification, setNotification] = useState<string | null>(null)

  useEffect(() => {
    if (lastUpdate && subscription) {
      const timeSinceUpdate = Date.now() - lastUpdate.getTime()

      // Solo mostrar notificación si el cambio fue reciente (menos de 3 segundos)
      if (timeSinceUpdate < 3000) {
        let message = ''

        switch (subscription.status) {
          case 'active':
            message = '✅ Tu suscripción está activa'
            break
          case 'canceled':
            message = '⚠️ Tu suscripción ha sido cancelada'
            break
          case 'paused':
            message = '⏸️ Tu suscripción ha sido pausada'
            break
          case 'expired':
            message = '❌ Tu suscripción ha expirado'
            break
        }

        if (message) {
          setNotification(message)

          // Limpiar notificación después de 5 segundos
          setTimeout(() => setNotification(null), 5000)
        }
      }
    }
  }, [subscription, lastUpdate])

  return {
    notification,
    isConnected,
    clearNotification: () => setNotification(null),
  }
}

/**
 * Hook para obtener información de la suscripción del usuario autenticado
 * Pero sin suscribirse a los cambios en tiempo real
 */
export const useSubscriptionInfo = () => {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    null,
  )
  const [hasActiveSubscription, setHasActiveSubscription] =
    useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchSubInfo = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/subscription')
      const data = (await response.json()) as {
        subscription: SubscriptionData | null
        hasActiveSubscription: boolean
      }
      setSubscription(data.subscription)
      setHasActiveSubscription(data.hasActiveSubscription)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSubInfo()
  }, [])

  return {
    subscription,
    hasActiveSubscription,
    isLoading,
  }
}
