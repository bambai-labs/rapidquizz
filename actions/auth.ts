'use client'
import { createClient } from '@/lib/supabase/client'
import { Result } from '@/types/result.type'

export async function login(
  email: string,
  password: string,
): Promise<Result<void>> {
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      success: false,
      errorMessage: error.message,
    }
  }

  return {
    success: true,
  }
}

export async function signup(
  email: string,
  password: string,
  username: string,
  userRole?: string,
  customRole?: string,
): Promise<Result<void>> {
  const supabase = createClient()

  const userData: any = {
    username: username,
    name: username, // También guardamos el username como name para compatibilidad
  }

  if (userRole) {
    userData.user_role = userRole
    if (userRole === 'other' && customRole) {
      userData.custom_role = customRole
    }
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  })

  if (authError) {
    return {
      success: false,
      errorMessage: authError.message,
    }
  }

  console.log('creating user with role: ', userRole ?? customRole)

  // If user was created successfully and we have role data, save to user_profiles
  if (authData.user && userRole) {
    const { error: profileError } = await supabase.rpc('create_user_profile', {
      p_user_id: authData.user.id,
      p_username: username,
      p_user_role: userRole,
      p_custom_role: userRole === 'other' ? customRole : null,
    })

    if (profileError) {
      console.error('Error creating user profile:', profileError)
      // Don't fail the signup if profile creation fails, but log it
    }
  }

  return {
    success: true,
  }
}

export async function logout(): Promise<Result<void>> {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    return {
      success: false,
      errorMessage: error.message,
    }
  }

  return {
    success: true,
  }
}
