'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSubscriptionStatus } from '@/hooks/use-subscription'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  AlertTriangle,
  CheckCircle,
  Crown,
  Pause,
  RefreshCw,
  XCircle,
} from 'lucide-react'

export function SubscriptionStatus() {
  const {
    subscription,
    hasActiveSubscription,
    isLoading,
    error,
    refetch,
    isExpired,
    isCanceled,
    isPaused,
    isActive,
    daysRemaining,
    expiringSoon,
    startDate,
    endDate,
  } = useSubscriptionStatus()

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span className="ml-2">Cargando estado de suscripción...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            <span>Error: {error}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            className="mt-3"
          >
            Reintentar
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Plan Gratuito
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            No tienes una suscripción activa. Actualiza a Pro para acceder a
            todas las funcionalidades.
          </p>
          <Button>Actualizar a Pro</Button>
        </CardContent>
      </Card>
    )
  }

  const getStatusIcon = () => {
    if (isActive) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (isPaused) return <Pause className="h-5 w-5 text-yellow-600" />
    if (isCanceled || isExpired)
      return <XCircle className="h-5 w-5 text-red-600" />
    return <AlertTriangle className="h-5 w-5 text-orange-600" />
  }

  const getStatusBadge = () => {
    if (isActive && expiringSoon) {
      return <Badge variant="destructive">Expira pronto</Badge>
    }
    if (isActive)
      return (
        <Badge variant="default" className="bg-green-600">
          Activa
        </Badge>
      )
    if (isPaused) return <Badge variant="secondary">Pausada</Badge>
    if (isCanceled) return <Badge variant="destructive">Cancelada</Badge>
    if (isExpired) return <Badge variant="destructive">Expirada</Badge>
    return <Badge variant="outline">Desconocido</Badge>
  }

  return (
    <Card
      className={`${hasActiveSubscription ? 'border-green-200' : 'border-orange-200'}`}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            Suscripción Pro
          </div>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Información de fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {startDate && (
            <div>
              <span className="font-medium">Inicio:</span>
              <p className="text-muted-foreground">
                {format(startDate, 'dd MMMM yyyy', { locale: es })}
              </p>
            </div>
          )}
          {endDate && (
            <div>
              <span className="font-medium">Vencimiento:</span>
              <p className="text-muted-foreground">
                {format(endDate, 'dd MMMM yyyy', { locale: es })}
              </p>
            </div>
          )}
        </div>

        {/* Días restantes */}
        {daysRemaining !== null && isActive && (
          <div
            className={`p-3 rounded-lg ${expiringSoon ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'}`}
          >
            <div className="flex items-center gap-2">
              {expiringSoon && (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
              <span
                className={`font-medium ${expiringSoon ? 'text-red-700' : 'text-blue-700'}`}
              >
                {daysRemaining === 0
                  ? 'Expira hoy'
                  : `${daysRemaining} día${daysRemaining > 1 ? 's' : ''} restante${daysRemaining > 1 ? 's' : ''}`}
              </span>
            </div>
          </div>
        )}

        {/* Mensajes según el estado */}
        {isCanceled && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-orange-700 text-sm">
              Tu suscripción ha sido cancelada. Aún puedes usar las funciones
              Pro hasta la fecha de vencimiento.
            </p>
          </div>
        )}

        {isPaused && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700 text-sm">
              Tu suscripción está pausada. Contáctanos si necesitas reactivarla.
            </p>
          </div>
        )}

        {isExpired && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">
              Tu suscripción ha expirado. Renueva para continuar accediendo a
              las funciones Pro.
            </p>
            <Button className="mt-2" size="sm">
              Renovar Suscripción
            </Button>
          </div>
        )}

        {/* Botón de actualizar */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
            />
            Actualizar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
