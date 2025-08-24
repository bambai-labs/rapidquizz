import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { Result } from '@/types/result.type'

// Tipos específicos para las suscripciones
export interface Subscription {
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

export interface CreateSubscriptionData {
  paddleUserId: string
  email: string
}

export interface UpdateSubscriptionData {
  paddleUserId: string
  startsAt?: string
  endsAt?: string
  subscriptionType?: 'pro'
  status?: 'active' | 'canceled' | 'paused' | 'expired'
}

/**
 * Crea una nueva suscripción cuando se crea un cliente en Paddle
 * Busca el usuario por email y asocia el paddle_user_id
 */
export async function createSubscription(
  data: CreateSubscriptionData,
): Promise<Result<string>> {
  const supabaseAdmin = createAdminClient()

  try {
    // Buscar el usuario por email usando el cliente administrativo
    const {
      data: { users },
      error: userError,
    } = await supabaseAdmin.auth.admin.listUsers()

    if (userError) {
      console.error('Error al buscar usuarios:', userError)
      return {
        success: false,
        errorMessage: `Error al buscar usuario por email: ${userError.message}`,
      }
    }

    // Encontrar el usuario que coincida con el email
    const user = users.find((u) => u.email === data.email)

    if (!user) {
      return {
        success: false,
        errorMessage: `No se encontró un usuario con el email: ${data.email}`,
      }
    }

    // Verificar si ya existe una suscripción para este paddle_user_id
    const { data: existingSubscription, error: checkError } =
      await supabaseAdmin
        .from('subscriptions')
        .select('id')
        .eq('paddle_user_id', data.paddleUserId)
        .single()

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 = no rows found
      console.error('Error al verificar suscripción existente:', checkError)
      return {
        success: false,
        errorMessage: `Error al verificar suscripción existente: ${checkError.message}`,
      }
    }

    if (existingSubscription) {
      return {
        success: false,
        errorMessage: `Ya existe una suscripción para el paddle_user_id: ${data.paddleUserId}`,
      }
    }

    // Crear la nueva suscripción usando el cliente administrativo para bypasser RLS
    const { data: subscriptionData, error: subscriptionError } =
      await supabaseAdmin
        .from('subscriptions')
        .insert({
          user_id: user.id,
          email: data.email,
          paddle_user_id: data.paddleUserId,
          subscription_type: 'pro',
          status: 'active', // Estado inicial
        })
        .select('id')
        .single()

    if (subscriptionError) {
      console.error('Error al crear suscripción:', subscriptionError)
      return {
        success: false,
        errorMessage: `Error al crear la suscripción: ${subscriptionError.message}`,
      }
    }

    return {
      success: true,
      data: subscriptionData.id,
    }
  } catch (error: any) {
    console.error('Error inesperado al crear suscripción:', error)
    return {
      success: false,
      errorMessage: `Error inesperado: ${error.message}`,
    }
  }
}

/**
 * Actualiza una suscripción existente basada en el paddle_user_id
 * Usado para SubscriptionActivated y otros eventos de actualización
 */
export async function updateSubscription(
  data: UpdateSubscriptionData,
): Promise<Result<void>> {
  const supabaseAdmin = createAdminClient()

  try {
    // Buscar la suscripción por paddle_user_id
    const { data: subscription, error: findError } = await supabaseAdmin
      .from('subscriptions')
      .select('id, user_id')
      .eq('paddle_user_id', data.paddleUserId)
      .single()

    if (findError) {
      console.error('Error al buscar suscripción:', findError)
      return {
        success: false,
        errorMessage: `Error al buscar suscripción: ${findError.message}`,
      }
    }

    if (!subscription) {
      return {
        success: false,
        errorMessage: `No se encontró una suscripción con paddle_user_id: ${data.paddleUserId}`,
      }
    }

    // Preparar los datos de actualización
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (data.startsAt) updateData.starts_at = data.startsAt
    if (data.endsAt) updateData.ends_at = data.endsAt
    if (data.subscriptionType)
      updateData.subscription_type = data.subscriptionType
    if (data.status) updateData.status = data.status

    // Actualizar la suscripción
    console.log(
      `🔄 Actualizando suscripción ${subscription.id} para usuario ${subscription.user_id}:`,
      updateData,
    )

    const { error: updateError } = await supabaseAdmin
      .from('subscriptions')
      .update(updateData)
      .eq('id', subscription.id)

    if (updateError) {
      console.error('Error al actualizar suscripción:', updateError)
      return {
        success: false,
        errorMessage: `Error al actualizar la suscripción: ${updateError.message}`,
      }
    }

    console.log(`✅ Suscripción ${subscription.id} actualizada exitosamente`)

    return {
      success: true,
    }
  } catch (error: any) {
    console.error('Error inesperado al actualizar suscripción:', error)
    return {
      success: false,
      errorMessage: `Error inesperado: ${error.message}`,
    }
  }
}

/**
 * Actualiza el estado de una suscripción a 'canceled'
 * Usado para el evento SubscriptionCanceled
 */
export async function cancelSubscription(
  paddleUserId: string,
): Promise<Result<void>> {
  return updateSubscription({
    paddleUserId,
    status: 'canceled',
  })
}

/**
 * Actualiza el estado de una suscripción a 'paused'
 * Usado para el evento SubscriptionPaused
 */
export async function pauseSubscription(
  paddleUserId: string,
): Promise<Result<void>> {
  return updateSubscription({
    paddleUserId,
    status: 'paused',
  })
}

/**
 * Actualiza el estado de una suscripción a 'active'
 * Usado para el evento SubscriptionResumed
 */
export async function resumeSubscription(
  paddleUserId: string,
): Promise<Result<void>> {
  return updateSubscription({
    paddleUserId,
    status: 'active',
  })
}

/**
 * Actualiza el estado de una suscripción a 'expired'
 * Usado para el evento SubscriptionPastDue
 */
export async function expireSubscription(
  paddleUserId: string,
): Promise<Result<void>> {
  return updateSubscription({
    paddleUserId,
    status: 'expired',
  })
}

/**
 * Obtiene la suscripción de un usuario por su ID
 */
export async function getUserSubscription(
  userId: string,
): Promise<Result<Subscription | null>> {
  const supabase = await createClient()

  try {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found
      console.error('Error al obtener suscripción del usuario:', error)
      return {
        success: false,
        errorMessage: `Error al obtener suscripción: ${error.message}`,
      }
    }

    return {
      success: true,
      data: subscription,
    }
  } catch (error: any) {
    console.error('Error inesperado al obtener suscripción del usuario:', error)
    return {
      success: false,
      errorMessage: `Error inesperado: ${error.message}`,
    }
  }
}

/**
 * Verifica si un usuario tiene una suscripción activa
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  try {
    const result = await getUserSubscription(userId)

    if (!result.success || !result.data) {
      return false
    }

    return result.data.status === 'active'
  } catch (error) {
    console.error('Error al verificar suscripción activa:', error)
    return false
  }
}

/**
 * Obtiene todas las suscripciones (para administración)
 */
export async function getAllSubscriptions(): Promise<Result<Subscription[]>> {
  const supabase = await createClient()

  try {
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error al obtener todas las suscripciones:', error)
      return {
        success: false,
        errorMessage: `Error al obtener suscripciones: ${error.message}`,
      }
    }

    return {
      success: true,
      data: subscriptions || [],
    }
  } catch (error: any) {
    console.error('Error inesperado al obtener todas las suscripciones:', error)
    return {
      success: false,
      errorMessage: `Error inesperado: ${error.message}`,
    }
  }
}
