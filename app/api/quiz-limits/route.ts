import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface QuizLimits {
  withFiles: {
    used: number
    limit: number
    remaining: number
  }
  withoutFiles: {
    used: number
    limit: number
    remaining: number
  }
  hasActiveSubscription: boolean
  subscriptionInfo?: {
    status: 'active' | 'canceled' | 'paused' | 'expired'
    endsAt: string
    daysRemaining: number
  }
}

/**
 * GET /api/quiz-limits
 * Obtiene los límites de quizzes para usuarios de capa gratuita
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

    // Verificar si tiene suscripción activa
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Verificar si la suscripción permite acceso premium
    // Una suscripción permite acceso premium si:
    // 1. Existe la suscripción
    // 2. El status NO es 'expired' (puede ser active, canceled, paused)
    // 3. La fecha actual está dentro del período de suscripción (no vencida por fecha)
    const now = new Date()
    const isWithinDateLimits = subscription &&
      subscription.starts_at &&
      subscription.ends_at &&
      new Date(subscription.starts_at) <= now &&
      new Date(subscription.ends_at) > now

    const hasActiveSubscription =
      subscription &&
      subscription.status !== 'expired' &&
      isWithinDateLimits

    console.log('Subscription validation:', {
      exists: !!subscription,
      status: subscription?.status,
      starts_at: subscription?.starts_at,
      ends_at: subscription?.ends_at,
      now: now.toISOString(),
      isWithinDateLimits,
      hasActiveSubscription
    })

    // Si no tiene suscripción activa (sin suscripción, cancelada, pausada, o vencida)
    const isFreeTierUser = !hasActiveSubscription

    // Si tiene suscripción activa, no hay límites
    if (hasActiveSubscription) {
      const endsAt = new Date(subscription.ends_at!)
      const daysRemaining = Math.ceil((endsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      
      return NextResponse.json({
        withFiles: {
          used: 0,
          limit: -1, // -1 significa ilimitado
          remaining: -1,
        },
        withoutFiles: {
          used: 0,
          limit: -1,
          remaining: -1,
        },
        hasActiveSubscription: true,
        subscriptionInfo: {
          status: subscription.status,
          endsAt: subscription.ends_at!,
          daysRemaining,
        },
      } as QuizLimits)
    }

    // Para usuarios de capa gratuita (sin suscripción activa, cancelada, pausada, o vencida)
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const endOfMonth = new Date(startOfMonth)
    endOfMonth.setMonth(endOfMonth.getMonth() + 1)

    // Contar quizzes creados en el mes actual
    const { data: allQuizzes, error: quizzesError } = await supabase
      .from('quizzes')
      .select('id, created_at, has_files')
      .eq('created_by', user.id)
      .gte('created_at', startOfMonth.toISOString())
      .lt('created_at', endOfMonth.toISOString())

    if (quizzesError) {
      console.error('Error al obtener quizzes:', quizzesError)
      return NextResponse.json(
        { error: 'Error al obtener información de quizzes' },
        { status: 500 },
      )
    }

    // Separar quizzes con y sin archivos
    const quizzesWithFiles =
      allQuizzes?.filter((quiz) => quiz.has_files === true) || []
    const quizzesWithoutFiles =
      allQuizzes?.filter((quiz) => quiz.has_files !== true) || []

    const limits: QuizLimits = {
      withFiles: {
        used: quizzesWithFiles.length,
        limit: 5,
        remaining: Math.max(0, 5 - quizzesWithFiles.length),
      },
      withoutFiles: {
        used: quizzesWithoutFiles.length,
        limit: 20,
        remaining: Math.max(0, 20 - quizzesWithoutFiles.length),
      },
      hasActiveSubscription: false,
    }

    return NextResponse.json(limits)
  } catch (error: any) {
    console.error('Error al obtener límites de quiz:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    )
  }
}
