'use client'
import { signInWithGoogle } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Chrome } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface GoogleAuthButtonProps {
  className?: string
}

export function GoogleAuthButton({ className }: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAuth = async () => {
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

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        onClick={handleAuth}
        disabled={isLoading}
        variant="outline"
        className={`flex items-center gap-2 w-full ${className}`}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            <Chrome className="w-5 h-5" />
            Sign in with Google
          </>
        )}
      </Button>
    </motion.div>
  )
}
