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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useSubscriptionStatus } from '@/hooks/use-subscription'
import { NavBar } from '@/modules/shared/components/NavBar'
import { useAuthStore } from '@/stores/auth-store'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  CreditCard,
  Crown,
  ExternalLink,
  FileText,
  Settings,
  Shield,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const {
    subscription,
    hasActiveSubscription,
    isLoading,
    error,
    isExpired,
    isCanceled,
    isPaused,
    isActive,
    daysRemaining,
    expiringSoon,
    subscriptionType,
    startDate,
    endDate,
  } = useSubscriptionStatus()

  const [cancelLoading, setCancelLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  const handleConfirmCancelSubscription = async () => {
    if (!subscription) return

    setCancelLoading(true)
    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener URL de gestión')
      }

      // Redirigir al usuario al panel de gestión de Paddle
      if (data.manageUrl) {
        toast.success('Redirigiendo al panel de gestión...')
        window.open(data.manageUrl, '_blank')
      } else {
        throw new Error('URL de gestión no disponible')
      }
    } catch (error: any) {
      console.error('Error getting manage URL:', error)
      toast.error(error.message || 'Error al acceder al panel de gestión')
    } finally {
      setCancelLoading(false)
    }
  }

  const getSubscriptionStatusBadge = () => {
    if (isActive)
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Activa
        </Badge>
      )
    if (isCanceled) return <Badge variant="destructive">Cancelada</Badge>
    if (isPaused) return <Badge variant="secondary">Pausada</Badge>
    if (isExpired)
      return (
        <Badge variant="outline" className="border-orange-500 text-orange-700">
          Expirada
        </Badge>
      )
    return <Badge variant="outline">Sin suscripción</Badge>
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Ajustes de la cuenta</h1>
          </div>
          <p className="text-muted-foreground">
            Gestiona tu cuenta y configuraciones de suscripción
          </p>
        </motion.div>

        <div className="grid gap-6">
          {/* Información del usuario */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información personal
                </CardTitle>
                <CardDescription>Tu información de cuenta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Nombre
                    </label>
                    <p className="text-sm">{user.name || 'No especificado'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Email
                    </label>
                    <p className="text-sm">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Usuario
                    </label>
                    <p className="text-sm">
                      {user.username || 'No especificado'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sección de suscripciones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Suscripciones
                </CardTitle>
                <CardDescription>
                  Gestiona tu plan de suscripción y facturación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : error ? (
                  <div className="flex items-center gap-2 text-destructive py-4">
                    <AlertTriangle className="w-5 h-5" />
                    <span>
                      Error al cargar información de suscripción: {error}
                    </span>
                  </div>
                ) : (
                  <>
                    {/* Estado del plan */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Crown className="w-6 h-6 text-yellow-500" />
                        <div>
                          <h3 className="font-semibold">
                            Plan {hasActiveSubscription ? 'Pro' : 'Gratuito'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {hasActiveSubscription
                              ? 'Acceso completo a todas las funciones'
                              : 'Funciones limitadas'}
                          </p>
                        </div>
                      </div>
                      {getSubscriptionStatusBadge()}
                    </div>

                    <Separator />

                    {/* Detalles de la suscripción */}
                    {subscription ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Tipo de suscripción
                            </label>
                            <p className="text-sm font-medium capitalize">
                              {subscriptionType}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Estado
                            </label>
                            <p className="text-sm font-medium capitalize">
                              {subscription.status}
                            </p>
                          </div>
                          {startDate && (
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">
                                Fecha de inicio
                              </label>
                              <p className="text-sm">{formatDate(startDate)}</p>
                            </div>
                          )}
                          {endDate && (
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">
                                {isActive
                                  ? 'Próxima renovación'
                                  : 'Fecha de fin'}
                              </label>
                              <p className="text-sm">{formatDate(endDate)}</p>
                            </div>
                          )}
                        </div>

                        {/* Alertas */}
                        {expiringSoon && daysRemaining !== null && (
                          <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-md">
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                            <span className="text-sm text-orange-800">
                              Tu suscripción expira en {daysRemaining}{' '}
                              {daysRemaining === 1 ? 'día' : 'días'}
                            </span>
                          </div>
                        )}

                        {/* Acciones */}
                        <div className="flex gap-3 pt-4">
                          {isActive && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  disabled={cancelLoading}
                                  className="flex items-center gap-2"
                                >
                                  <Settings className="w-4 h-4" />
                                  Gestionar suscripción
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-primary" />
                                    Gestionar suscripción
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="space-y-2">
                                    <p>
                                      Serás redirigido al panel de gestión de
                                      Paddle donde podrás:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                      <li>Cancelar tu suscripción</li>
                                      <li>Modificar tu método de pago</li>
                                      <li>Ver tu historial de facturación</li>
                                      <li>Descargar facturas</li>
                                    </ul>
                                    <p className="text-sm text-muted-foreground mt-3">
                                      El panel se abrirá en una nueva pestaña
                                      para tu seguridad.
                                    </p>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleConfirmCancelSubscription}
                                    disabled={cancelLoading}
                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                  >
                                    {cancelLoading ? (
                                      <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Obteniendo enlace...
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        <Settings className="w-4 h-4" />
                                        Ir al panel de gestión
                                      </div>
                                    )}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                          {!hasActiveSubscription && (
                            <Button
                              onClick={() => router.push('/pricing')}
                              className="flex items-center gap-2"
                            >
                              <Crown className="w-4 h-4" />
                              Actualizar a Pro
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Crown className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-semibold mb-2">
                          Sin suscripción activa
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Actualiza a Pro para acceder a todas las funciones
                        </p>
                        <Button
                          onClick={() => router.push('/pricing')}
                          className="flex items-center gap-2"
                        >
                          <Crown className="w-4 h-4" />
                          Ver planes
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Sección de políticas y privacidad */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Políticas y privacidad
                </CardTitle>
                <CardDescription>
                  Información legal y sobre el manejo de tus datos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <h3 className="font-medium">Política de Privacidad</h3>
                        <p className="text-sm text-muted-foreground">
                          Conoce cómo recopilamos, utilizamos y protegemos tu
                          información
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        Ver política
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <h4 className="font-medium text-blue-900">
                          Tu privacidad es importante
                        </h4>
                        <p className="text-sm text-blue-700">
                          Solo recopilamos tu email y nombre. No compartimos tus
                          datos con terceros y utilizamos Supabase y Paddle bajo
                          estrictos acuerdos de seguridad.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
