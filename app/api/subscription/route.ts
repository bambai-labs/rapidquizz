import {
  getUserSubscription,
  hasActiveSubscription,
} from '@/lib/subscription-database'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * GET /api/subscription
 * Obtiene la información de suscripción del usuario autenticado
 */
export async function GET() {
  try {
    const supabase = await createClient()

    // Verificar que el usuario esté autenticado
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 },
      )
    }

    // Obtener la suscripción del usuario
    const subscriptionResult = await getUserSubscription(user.id)

    if (!subscriptionResult.success) {
      return NextResponse.json(
        { error: subscriptionResult.errorMessage },
        { status: 500 },
      )
    }

    // Verificar si tiene suscripción activa
    const isActive = await hasActiveSubscription(user.id)

    return NextResponse.json({
      subscription: subscriptionResult.data,
      hasActiveSubscription: isActive,
      user: {
        id: user.id,
        email: user.email,
      },
    })
  } catch (error: any) {
    console.error('Error al obtener información de suscripción:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    )
  }
}

/**
 * GET /api/subscription/status
 * Verifica únicamente si el usuario tiene una suscripción activa
 */
export async function HEAD() {
  try {
    const supabase = await createClient()

    // Verificar que el usuario esté autenticado
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 },
      )
    }

    // Verificar si tiene suscripción activa
    const isActive = await hasActiveSubscription(user.id)

    return NextResponse.json({
      hasActiveSubscription: isActive,
      userId: user.id,
    })
  } catch (error: any) {
    console.error('Error al verificar estado de suscripción:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    )
  }
}
