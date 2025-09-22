import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  let next = searchParams.get('next') ?? '/'

  if (!next.startsWith('/')) {
    next = '/'
  }

  // 🔧 Función para obtener el baseUrl correcto
  function getBaseUrl(request: Request): string {
    const isLocalEnv = process.env.NODE_ENV === 'development'

    if (isLocalEnv) {
      return new URL(request.url).origin
    }

    // En producción, prioriza los headers de proxy
    const forwardedHost = request.headers.get('x-forwarded-host')
    const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'

    if (forwardedHost) {
      return `${forwardedProto}://${forwardedHost}`
    }

    // Fallback a tu dominio
    return 'https://rapidquizz.com'
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const baseUrl = getBaseUrl(request)
      console.log('🔍 Redirecting to:', `${baseUrl}${next}`)
      return NextResponse.redirect(`${baseUrl}${next}`)
    }
  }

  const baseUrl = getBaseUrl(request)
  return NextResponse.redirect(`${baseUrl}/auth/auth-code-error`)
}
