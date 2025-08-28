import { signup } from '@/actions/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, 'Username is required')
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username cannot be more than 20 characters')
      .regex(
        /^[a-zA-Z0-9_]+$/,
        'Username can only contain letters, numbers and underscores',
      ),
    email: z.string().min(1, 'Email is required').email(),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase, one lowercase and one number',
      ),
    confirmPassword: z.string().min(1, 'Confirm your password'),
    userRole: z.enum(['student', 'teacher', 'other'], {
      message: 'Please select your role',
    }),
    customRole: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.userRole !== 'other' || (data.customRole && data.customRole.trim().length > 0), {
    message: 'Please specify your role',
    path: ['customRole'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      userRole: undefined,
      customRole: '',
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      const result = await signup(
        data.email, 
        data.password, 
        data.username,
        data.userRole,
        data.customRole
      )

      if (result.success) {
        toast.success(
          'Your account has been successfully created. Please check your email and follow the instructions to activate your account',
        )
        router.replace('/login')
        return
      }

      toast.error(result.errorMessage || 'Something went wrong')
    } catch (error) {
      console.error('Registration error:', error)
      form.setError('root', {
        type: 'manual',
        message: 'Something went wrong. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    form,
    isLoading,
    showPassword,
    showConfirmPassword,
    onSubmit,
    setShowPassword,
    setShowConfirmPassword,
  }
}
