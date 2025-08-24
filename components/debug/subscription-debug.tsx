'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSubscription } from '@/hooks/use-subscription'
import { useAuthStore } from '@/stores/auth-store'
import { RefreshCw, Wifi, WifiOff } from 'lucide-react'

/**
 * Componente de debugging para el hook useSubscription
 * Solo para desarrollo - ayuda a diagnosticar problemas con Realtime
 */
export function SubscriptionDebug() {
  const { user } = useAuthStore()
  const {
    subscription,
    hasActiveSubscription,
    isLoading,
    error,
    isConnected,
    lastUpdate,
    refetch,
  } = useSubscription()

  if (!user) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🐛 Debug: Suscripción
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Usuario no autenticado</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🐛 Debug: Suscripción
          <Badge variant={isConnected ? 'default' : 'destructive'}>
            {isConnected ? (
              <Wifi className="w-3 h-3 mr-1" />
            ) : (
              <WifiOff className="w-3 h-3 mr-1" />
            )}
            {isConnected ? 'Conectado' : 'Desconectado'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estado del usuario */}
        <div>
          <h4 className="text-sm font-medium mb-2">Usuario</h4>
          <div className="text-xs space-y-1">
            <p>ID: {user.id}</p>
            <p>Email: {user.email}</p>
          </div>
        </div>

        {/* Estado de carga */}
        <div>
          <h4 className="text-sm font-medium mb-2">Estado de carga</h4>
          <Badge variant={isLoading ? 'secondary' : 'outline'}>
            {isLoading ? 'Cargando...' : 'Completado'}
          </Badge>
        </div>

        {/* Estado de la suscripción */}
        <div>
          <h4 className="text-sm font-medium mb-2">Suscripción</h4>
          <div className="text-xs space-y-1">
            <p>
              Activa:{' '}
              <Badge variant={hasActiveSubscription ? 'default' : 'secondary'}>
                {hasActiveSubscription ? 'Sí' : 'No'}
              </Badge>
            </p>
            {subscription ? (
              <>
                <p>ID: {subscription.id}</p>
                <p>Paddle ID: {subscription.paddle_user_id}</p>
                <p>Estado: {subscription.status}</p>
                <p>Tipo: {subscription.subscription_type}</p>
                {subscription.starts_at && (
                  <p>
                    Inicio: {new Date(subscription.starts_at).toLocaleString()}
                  </p>
                )}
                {subscription.ends_at && (
                  <p>Fin: {new Date(subscription.ends_at).toLocaleString()}</p>
                )}
              </>
            ) : (
              <p>Sin suscripción</p>
            )}
          </div>
        </div>

        {/* Estado de conexión Realtime */}
        <div>
          <h4 className="text-sm font-medium mb-2">Realtime</h4>
          <div className="text-xs space-y-1">
            <p>
              Conectado:{' '}
              <Badge variant={isConnected ? 'default' : 'destructive'}>
                {isConnected ? 'Sí' : 'No'}
              </Badge>
            </p>
            {lastUpdate && (
              <p>Última actualización: {lastUpdate.toLocaleTimeString()}</p>
            )}
          </div>
        </div>

        {/* Errores */}
        {error && (
          <div>
            <h4 className="text-sm font-medium mb-2 text-red-600">Error</h4>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {/* Controles */}
        <div className="flex gap-2">
          <Button
            onClick={refetch}
            disabled={isLoading}
            size="sm"
            variant="outline"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Refrescar
          </Button>
        </div>

        {/* Información adicional */}
        <div className="text-xs text-muted-foreground space-y-1 border-t pt-2">
          <p>
            Comprueba la consola del navegador para ver logs detallados del
            canal Realtime
          </p>
          <p>
            Si los cambios no se reflejan, verifica que la tabla `subscriptions`
            tenga Realtime habilitado
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
