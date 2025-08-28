import { login, signInWithGoogle } from '@/actions/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email(),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const result = await login(data.email, data.password)

      if (result.success) {
        toast.success('Logged in successfully')
        router.replace('/dashboard')
        return
      }

      toast.error(result.errorMessage || 'Something went wrong')
    } catch (error) {
      console.error('Login error:', error)
      /*form.setError('root', {
        type: 'manual',
        message: 'Invalid credentials. Please try again.',
      })*/
    } finally {
      setIsLoading(false)
    }
  }

  const onGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const result = await signInWithGoogle()
      
      if (!result.success) {
        toast.error(result.errorMessage || 'Failed to sign in with Google')
      }
      // Success case is handled by redirect to callback
    } catch (error) {
      console.error('Google sign-in error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    form,
    isLoading,
    showPassword,
    onSubmit,
    onGoogleSignIn,
    setShowPassword,
  }
}
