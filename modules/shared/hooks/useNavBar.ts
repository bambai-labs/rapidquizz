import { logout } from '@/actions/auth'
import { useAuthStore } from '@/stores/auth-store'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

export const useNavBar = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { user } = useAuthStore()
  const isAuthenticated = useMemo(() => !!user, [user])

  const handleLogout = async () => {
    setLoading(true)
    const { success, errorMessage } = await logout()

    if (!success) {
      toast.error(errorMessage)
      setLoading(false)
      return
    }

    setLoading(false)
    router.replace('/')
  }

  return {
    user,
    isAuthenticated,
    loading,
    handleLogout,
  }
}
