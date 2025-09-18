import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/'
  if (!next.startsWith('/')) {
    // if "next" is not a relative URL, use the default
    next = '/'
  }

  // Get the client URL from environment variable or fallback to origin
  const clientUrl = process.env.CLIENT_URL || origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Use CLIENT_URL environment variable for production deployments
      // This ensures correct redirects when deployed behind proxies/load balancers
      return NextResponse.redirect(`${clientUrl}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${clientUrl}/auth/auth-code-error`)
}
