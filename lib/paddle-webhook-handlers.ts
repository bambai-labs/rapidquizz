import { Result } from '@/types/result.type'
import {
  cancelSubscription,
  createSubscription,
  pauseSubscription,
  resumeSubscription,
  updateSubscription,
} from './subscription-database'

// Tipos específicos para los eventos de Paddle
export interface PaddleCustomerCreatedData {
  id: string // paddle customer ID
  email: string
}

export interface PaddleSubscriptionActivatedData {
  id: string // subscription ID
  customerId: string // paddle customer ID
  scheduledChange?: {
    effectiveAt: string
  }
  currentBillingPeriod?: {
    startsAt: string
    endsAt: string
  }
  items?: any // Usamos any temporalmente para evitar problemas de tipado con Paddle
}

export interface PaddleSubscriptionCanceledData {
  id: string // subscription ID
  customerId: string // paddle customer ID
  canceledAt: string
}

export interface PaddleSubscriptionPausedData {
  id: string // subscription ID
  customerId: string // paddle customer ID
  pausedAt: string
}

export interface PaddleSubscriptionResumedData {
  id: string // subscription ID
  customerId: string // paddle customer ID
  resumedAt: string
}

/**
 * Maneja el evento CustomerCreated de Paddle
 * Crea una nueva suscripción en la base de datos asociando el email con el usuario de Supabase
 */
export async function handleCustomerCreated(
  eventData: PaddleCustomerCreatedData,
): Promise<Result<string>> {
  try {
    console.log('📧 Procesando CustomerCreated:', {
      paddleCustomerId: eventData.id,
      email: eventData.email,
    })

    const result = await createSubscription({
      paddleUserId: eventData.id,
      email: eventData.email,
    })

    if (result.success) {
      console.log('✅ Suscripción creada exitosamente:', result.data)
    } else {
      console.error('❌ Error al crear suscripción:', result.errorMessage)
    }

    return result
  } catch (error: any) {
    console.error('💥 Error inesperado en handleCustomerCreated:', error)
    return {
      success: false,
      errorMessage: `Error inesperado: ${error.message}`,
    }
  }
}

/**
 * Maneja el evento SubscriptionActivated de Paddle
 * Actualiza la suscripción con las fechas de inicio y fin, y marca como activa
 */
export async function handleSubscriptionActivated(
  eventData: PaddleSubscriptionActivatedData,
): Promise<Result<void>> {
  try {
    console.log('🚀 Procesando SubscriptionActivated:', {
      subscriptionId: eventData.id,
      customerId: eventData.customerId,
      currentBillingPeriod: eventData.currentBillingPeriod,
    })

    const updateData: any = {
      paddleUserId: eventData.customerId,
      subscriptionType: 'pro' as const,
      status: 'active' as const,
    }

    // Extraer fechas del período de facturación actual si están disponibles
    if (eventData.currentBillingPeriod) {
      updateData.startsAt = eventData.currentBillingPeriod.startsAt
      updateData.endsAt = eventData.currentBillingPeriod.endsAt
    }

    const result = await updateSubscription(updateData)

    if (result.success) {
      console.log('✅ Suscripción activada exitosamente')
    } else {
      console.error('❌ Error al activar suscripción:', result.errorMessage)
    }

    return result
  } catch (error: any) {
    console.error('💥 Error inesperado en handleSubscriptionActivated:', error)
    return {
      success: false,
      errorMessage: `Error inesperado: ${error.message}`,
    }
  }
}

/**
 * Maneja el evento SubscriptionCanceled de Paddle
 * Actualiza el estado de la suscripción a 'canceled'
 */
export async function handleSubscriptionCanceled(
  eventData: PaddleSubscriptionCanceledData,
): Promise<Result<void>> {
  try {
    console.log('🚫 Procesando SubscriptionCanceled:', {
      subscriptionId: eventData.id,
      customerId: eventData.customerId,
      canceledAt: eventData.canceledAt,
    })

    const result = await cancelSubscription(eventData.customerId)

    if (result.success) {
      console.log('✅ Suscripción cancelada exitosamente')
    } else {
      console.error('❌ Error al cancelar suscripción:', result.errorMessage)
    }

    return result
  } catch (error: any) {
    console.error('💥 Error inesperado en handleSubscriptionCanceled:', error)
    return {
      success: false,
      errorMessage: `Error inesperado: ${error.message}`,
    }
  }
}

/**
 * Maneja el evento SubscriptionPaused de Paddle
 * Actualiza el estado de la suscripción a 'paused'
 */
export async function handleSubscriptionPaused(
  eventData: PaddleSubscriptionPausedData,
): Promise<Result<void>> {
  try {
    console.log('⏸️ Procesando SubscriptionPaused:', {
      subscriptionId: eventData.id,
      customerId: eventData.customerId,
      pausedAt: eventData.pausedAt,
    })

    const result = await pauseSubscription(eventData.customerId)

    if (result.success) {
      console.log('✅ Suscripción pausada exitosamente')
    } else {
      console.error('❌ Error al pausar suscripción:', result.errorMessage)
    }

    return result
  } catch (error: any) {
    console.error('💥 Error inesperado en handleSubscriptionPaused:', error)
    return {
      success: false,
      errorMessage: `Error inesperado: ${error.message}`,
    }
  }
}

/**
 * Maneja el evento SubscriptionResumed de Paddle
 * Actualiza el estado de la suscripción a 'active'
 */
export async function handleSubscriptionResumed(
  eventData: PaddleSubscriptionResumedData,
): Promise<Result<void>> {
  try {
    console.log('▶️ Procesando SubscriptionResumed:', {
      subscriptionId: eventData.id,
      customerId: eventData.customerId,
      resumedAt: eventData.resumedAt,
    })

    const result = await resumeSubscription(eventData.customerId)

    if (result.success) {
      console.log('✅ Suscripción reanudada exitosamente')
    } else {
      console.error('❌ Error al reanudar suscripción:', result.errorMessage)
    }

    return result
  } catch (error: any) {
    console.error('💥 Error inesperado en handleSubscriptionResumed:', error)
    return {
      success: false,
      errorMessage: `Error inesperado: ${error.message}`,
    }
  }
}
