import {
  testRealtimeUpdate,
  testSubscriptionUpdate,
} from '@/lib/test-subscription-update'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Endpoint para probar actualizaciones de suscripción y Realtime
 * Solo para desarrollo/debugging
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paddleUserId, testType = 'simple' } = body

    if (!paddleUserId) {
      return NextResponse.json(
        { error: 'paddleUserId es requerido' },
        { status: 400 },
      )
    }

    let result

    if (testType === 'realtime') {
      result = await testRealtimeUpdate(paddleUserId)
    } else {
      result = await testSubscriptionUpdate(paddleUserId)
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error en test endpoint:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 },
    )
  }
}
