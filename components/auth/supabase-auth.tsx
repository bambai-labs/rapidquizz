'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase'

const supabase = createClient()

export function SupabaseAuth() {
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
        redirectTo={`${window.location.origin}/auth/callback`}
      />
    </div>
  )
}

