import { login } from '@/actions/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().min(1, 'El email es requerido').email(),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
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
      const formData = new FormData()
      formData.append('email', data.email)
      formData.append('password', data.password)

      const result = await login(formData)

      if (result.success) {
        toast.success('Logged in successfully')
        router.replace('/dashboard')
        return
      }

      toast.error(result.errorMessage || 'Something went wrong')
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      /*form.setError('root', {
        type: 'manual',
        message: 'Credenciales inválidas. Intenta de nuevo.',
      })*/
    } finally {
      setIsLoading(false)
    }
  }

  return {
    form,
    isLoading,
    showPassword,
    onSubmit,
    setShowPassword,
  }
}
