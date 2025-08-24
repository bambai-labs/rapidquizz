import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Verificar que el usuario esté autenticado
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { message: 'Usuario no autenticado' },
        { status: 401 },
      )
    }

    // Obtener la suscripción del usuario
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (subscriptionError || !subscription) {
      return NextResponse.json(
        { message: 'No se encontró una suscripción activa' },
        { status: 404 },
      )
    }

    const PADDLE_API_KEY = process.env.PADDLE_SECRET_TOKEN
    const PADDLE_API_URL = process.env.PADDLE_API_URL

    if (!PADDLE_API_KEY || !PADDLE_API_URL) {
      return NextResponse.json(
        { message: 'Error de configuración del servidor' },
        { status: 500 },
      )
    }

    // Crear sesión del portal de cliente de Paddle
    const response = await fetch(
      `${PADDLE_API_URL}customers/${subscription.paddle_user_id}/portal-sessions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${PADDLE_API_KEY}`,
        },
      },
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `Paddle API error: ${response.status} - ${JSON.stringify(errorData)}`,
      )
    }

    const data = await response.json()
    const manageUrl = data.data.urls.general.overview

    return NextResponse.json(
      {
        message: 'URL de gestión obtenida exitosamente',
        manageUrl,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          ends_at: subscription.ends_at,
        },
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error('Error fetching manage URL from Paddle:', error.message)

    // Manejar errores específicos de Paddle basados en el mensaje de error
    if (error.message.includes('404')) {
      return NextResponse.json(
        { message: 'Suscripción no encontrada en Paddle' },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        message: 'Error al obtener URL de gestión',
        error: error.message,
      },
      { status: 500 },
    )
  }
}
