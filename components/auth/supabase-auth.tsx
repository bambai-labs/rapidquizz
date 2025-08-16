'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'

const supabase = createClient()

export function SupabaseAuth() {
  const [redirectUrl, setRedirectUrl] = useState<string>('')

  useEffect(() => {
    setRedirectUrl(`${window.location.origin}/auth/callback`)
  }, [])

  if (!redirectUrl) {
    return <div className="w-full max-w-md mx-auto">Cargando...</div>
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#3b82f6',
                brandAccent: '#1d4ed8',
              },
            },
          },
        }}
        providers={['google', 'github']}
        redirectTo={redirectUrl}
      />
    </div>
  )
}

