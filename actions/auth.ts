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
): Promise<Result<void>> {
  const supabase = createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username,
        name: username, // También guardamos el username como name para compatibilidad
      },
    },
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
