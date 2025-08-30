import { logout } from '@/actions/auth'
import { useAuthStore } from '@/stores/auth-store'
import { useState } from 'react'
import { toast } from 'sonner'

export const useNavBar = () => {
  const [loading, setLoading] = useState(false)
  const { user } = useAuthStore()

  const handleLogout = async () => {
    setLoading(true)
    const { success, errorMessage } = await logout()

    if (!success) {
      toast.error(errorMessage)
      setLoading(false)
      return
    }

    setLoading(false)
    window.location.href = '/'
  }

  return {
    user,
    loading,
    handleLogout,
  }
}
