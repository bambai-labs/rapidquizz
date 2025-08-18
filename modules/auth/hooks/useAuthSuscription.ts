'use client'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/stores/auth-store'
import { useEffect } from 'react'

export const useAuthSuscription = () => {
  const supabase = createClient()
  const { setUser } = useAuthStore()

  const getUser = async () => {
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      setUser(undefined)
      console.error(error)
      return
    }

    setUser({
      id: data.user.id,
      email: data.user.email || '',
      name: data.user.user_metadata.name || '',
      photoUrl: data.user.user_metadata.avatar_url || '',
    })
  }

  useEffect(() => {
    getUser()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event === 'USER_UPDATED' ||
        event === 'SIGNED_IN' ||
        event === 'SIGNED_OUT'
      ) {
        const user = session?.user

        if (user) {
          setUser({
            id: user.id,
            email: user.email || '',
            name: user.user_metadata.name || '',
            photoUrl: user.user_metadata.avatar_url || '',
          })
          return
        }

        setUser(undefined)
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [])
}
