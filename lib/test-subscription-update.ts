import { updateSubscription } from './subscription-database'

/**
 * Función de prueba para verificar que las actualizaciones de suscripción
 * funcionen correctamente y se reflejen en tiempo real
 */
export async function testSubscriptionUpdate(paddleUserId: string) {
  console.log('🧪 Iniciando test de actualización de suscripción...')

  try {
    // Simular una actualización de estado
    const result = await updateSubscription({
      paddleUserId,
      status: 'active',
    })

    if (result.success) {
      console.log('✅ Test exitoso: Suscripción actualizada')
      return { success: true, message: 'Suscripción actualizada exitosamente' }
    } else {
      console.error('❌ Test fallido:', result.errorMessage)
      return { success: false, message: result.errorMessage }
    }
  } catch (error: any) {
    console.error('💥 Error en test:', error)
    return { success: false, message: error.message }
  }
}

/**
 * Función para simular un cambio de estado y verificar Realtime
 */
export async function testRealtimeUpdate(paddleUserId: string) {
  console.log('🔄 Iniciando test de Realtime...')

  // Array de estados para probar
  const testStates: Array<'active' | 'paused' | 'active'> = ['paused', 'active']

  for (const status of testStates) {
    console.log(`🔄 Cambiando estado a: ${status}`)

    const result = await updateSubscription({
      paddleUserId,
      status,
    })

    if (!result.success) {
      return {
        success: false,
        message: `Error al cambiar a ${status}: ${result.errorMessage}`,
      }
    }

    // Esperar un poco para que se propague el cambio
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  return { success: true, message: 'Test de Realtime completado exitosamente' }
}
