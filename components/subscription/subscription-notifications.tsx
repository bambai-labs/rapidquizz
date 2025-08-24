'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useSubscriptionNotifications } from '@/hooks/use-subscription'
import {
  AlertTriangle,
  CheckCircle,
  Pause,
  Wifi,
  WifiOff,
  X,
  XCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface SubscriptionNotificationsProps {
  showConnectionStatus?: boolean
  autoHide?: boolean
  position?: 'top' | 'bottom'
}

/**
 * Componente que muestra notificaciones en tiempo real de cambios en la suscripción
 */
export function SubscriptionNotifications({
  showConnectionStatus = true,
  autoHide = true,
  position = 'top',
}: SubscriptionNotificationsProps) {
  const { notification, isConnected, clearNotification } =
    useSubscriptionNotifications()
  const [visible, setVisible] = useState(false)

  // Mostrar/ocultar notificación
  useEffect(() => {
    if (notification) {
      setVisible(true)

      if (autoHide) {
        const timer = setTimeout(() => {
          setVisible(false)
        }, 4000)

        return () => clearTimeout(timer)
      }
    }
  }, [notification, autoHide])

  const getNotificationIcon = (message: string) => {
    if (message.includes('✅'))
      return <CheckCircle className="h-4 w-4 text-green-600" />
    if (message.includes('❌'))
      return <XCircle className="h-4 w-4 text-red-600" />
    if (message.includes('⚠️'))
      return <AlertTriangle className="h-4 w-4 text-orange-600" />
    if (message.includes('⏸️'))
      return <Pause className="h-4 w-4 text-yellow-600" />
    return <CheckCircle className="h-4 w-4 text-blue-600" />
  }

  const getNotificationVariant = (
    message: string,
  ): 'default' | 'destructive' => {
    if (message.includes('❌') || message.includes('⚠️')) return 'destructive'
    return 'default'
  }

  if (!notification && !showConnectionStatus) return null

  return (
    <div
      className={`fixed ${position === 'top' ? 'top-4' : 'bottom-4'} right-4 z-50 space-y-2`}
    >
      {/* Estado de conexión */}
      {showConnectionStatus && (
        <div className="flex items-center gap-2">
          <Badge
            variant={isConnected ? 'default' : 'destructive'}
            className="text-xs"
          >
            {isConnected ? (
              <>
                <Wifi className="h-3 w-3 mr-1" />
                Conectado
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 mr-1" />
                Desconectado
              </>
            )}
          </Badge>
        </div>
      )}

      {/* Notificación de cambio en suscripción */}
      {notification && visible && (
        <Alert
          variant={getNotificationVariant(notification)}
          className="w-80 shadow-lg border animate-in slide-in-from-right-2 duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getNotificationIcon(notification)}
              <AlertDescription className="font-medium">
                {notification.replace(/[✅❌⚠️⏸️]/g, '').trim()}
              </AlertDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setVisible(false)
                clearNotification()
              }}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </Alert>
      )}
    </div>
  )
}

/**
 * Componente compacto que solo muestra el estado de conexión
 */
export function ConnectionStatus() {
  const { isConnected } = useSubscriptionNotifications()

  return (
    <Badge variant={isConnected ? 'default' : 'secondary'} className="text-xs">
      {isConnected ? (
        <>
          <Wifi className="h-3 w-3 mr-1" />
          En vivo
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3 mr-1" />
          Sin conexión
        </>
      )}
    </Badge>
  )
}

/**
 * Hook personalizado para integrar notificaciones con toast systems externos
 */
export function useSubscriptionToasts() {
  const { notification, clearNotification } = useSubscriptionNotifications()
  const [lastNotification, setLastNotification] = useState<string | null>(null)

  useEffect(() => {
    if (notification && notification !== lastNotification) {
      // Aquí puedes integrar con tu sistema de toast preferido
      // Ejemplo con sonner:
      // import { toast } from 'sonner'
      //
      // if (notification.includes('✅')) {
      //   toast.success(notification.replace('✅', '').trim())
      // } else if (notification.includes('❌') || notification.includes('⚠️')) {
      //   toast.error(notification.replace(/[❌⚠️]/g, '').trim())
      // } else {
      //   toast.info(notification.replace(/[✅❌⚠️⏸️]/g, '').trim())
      // }

      setLastNotification(notification)
      clearNotification()
    }
  }, [notification, lastNotification, clearNotification])

  return {
    notification,
    hasNewNotification: notification !== lastNotification,
  }
}
