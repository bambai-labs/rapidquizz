'use server'
import { createClient } from '@/lib/supabase/server'
import { Result } from '@/types/result.type'
import { revalidatePath } from 'next/cache'

export async function login(formData: FormData): Promise<Result<void>> {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return {
      success: false,
      errorMessage: error.message,
    }
  }

  revalidatePath('/', 'layout')
  return {
    success: true,
  }
}

export async function signup(formData: FormData): Promise<Result<void>> {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return {
      success: false,
      errorMessage: error.message,
    }
  }

  revalidatePath('/', 'layout')
  return {
    success: true,
  }
}

export async function logout(): Promise<Result<void>> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    return {
      success: false,
      errorMessage: error.message,
    }
  }

  revalidatePath('/', 'layout')
  return {
    success: true,
  }
}
