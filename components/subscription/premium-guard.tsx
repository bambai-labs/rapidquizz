'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useHasActiveSubscription } from '@/hooks/use-subscription'
import { Crown, Lock, RefreshCw } from 'lucide-react'
import { ReactNode } from 'react'

interface PremiumGuardProps {
  children: ReactNode
  fallback?: ReactNode
  showUpgradeCard?: boolean
}

/**
 * Componente que protege contenido premium
 * Muestra el contenido solo si el usuario tiene suscripción activa
 */
export function PremiumGuard({
  children,
  fallback,
  showUpgradeCard = true,
}: PremiumGuardProps) {
  const { hasActiveSubscription, isLoading, error } = useHasActiveSubscription()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Verificando suscripción...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6">
          <div className="text-center">
            <Lock className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">
              Error al verificar suscripción
            </h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (hasActiveSubscription) {
    return <>{children}</>
  }

  // Si hay un fallback personalizado, usarlo
  if (fallback) {
    return <>{fallback}</>
  }

  // Mostrar tarjeta de actualización por defecto
  if (showUpgradeCard) {
    return <UpgradeCard />
  }

  // No mostrar nada
  return null
}

/**
 * Tarjeta de actualización por defecto
 */
function UpgradeCard() {
  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Crown className="h-6 w-6 text-amber-600" />
          Contenido Premium
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="space-y-2">
          <Lock className="h-12 w-12 text-amber-600 mx-auto" />
          <p className="text-amber-700">
            Este contenido está disponible solo para suscriptores Pro.
          </p>
          <p className="text-sm text-amber-600">
            Actualiza tu plan para acceder a todas las funcionalidades premium.
          </p>
        </div>

        <div className="space-y-3">
          <Button className="w-full">
            <Crown className="h-4 w-4 mr-2" />
            Actualizar a Pro
          </Button>
          <Button variant="outline" className="w-full">
            Ver Planes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Hook de conveniencia para proteger rutas en páginas
 */
export function usePremiumGuard() {
  const { hasActiveSubscription, isLoading, error } = useHasActiveSubscription()

  return {
    hasAccess: hasActiveSubscription,
    isLoading,
    error,
    canAccess: hasActiveSubscription && !isLoading && !error,
  }
}
