import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/stores/auth-store'
import { useEffect, useState } from 'react'

interface UserProfile {
  id: string
  user_id: string
  username: string
  user_role: 'student' | 'teacher' | 'other'
  custom_role?: string
  created_at: string
  updated_at: string
}

export const useUserProfile = () => {
  const { user } = useAuthStore()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasRole, setHasRole] = useState<boolean | null>(null)

  const fetchUserProfile = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error)
        setHasRole(false)
        return
      }

      if (data) {
        setProfile(data)
        setHasRole(!!data.user_role)
      } else {
        setProfile(null)
        setHasRole(false)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setHasRole(false)
    } finally {
      setIsLoading(false)
    }
  }

  const updateUserRole = async (userRole: string, customRole?: string) => {
    if (!user) return { success: false, error: 'No user found' }

    try {
      const supabase = createClient()
      
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('user_profiles')
          .update({
            user_role: userRole,
            custom_role: userRole === 'other' ? customRole : null,
          })
          .eq('user_id', user.id)

        if (error) {
          console.error('Error updating user profile:', error)
          return { success: false, error: error.message }
        }
      } else {
        // Create new profile using the secure function
        const { error } = await supabase.rpc('create_user_profile', {
          p_user_id: user.id,
          p_username: user.username || user.email?.split('@')[0] || 'User',
          p_user_role: userRole,
          p_custom_role: userRole === 'other' ? customRole : null,
        })

        if (error) {
          console.error('Error creating user profile:', error)
          return { success: false, error: error.message }
        }
      }

      // Refresh profile data
      await fetchUserProfile()
      return { success: true }
    } catch (error: any) {
      console.error('Error updating user role:', error)
      return { success: false, error: error.message }
    }
  }

  useEffect(() => {
    if (user) {
      fetchUserProfile()
    } else {
      setProfile(null)
      setHasRole(null)
    }
  }, [user])

  return {
    profile,
    isLoading,
    hasRole,
    updateUserRole,
    refetch: fetchUserProfile,
  }
}
