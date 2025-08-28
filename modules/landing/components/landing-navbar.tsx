'use client'
import { GoogleAuthButton } from '@/components/auth/google-auth-button'
import { UserAvatar } from '@/components/auth/user-avatar'
import { Button } from '@/components/ui/button'
import { useSubscription } from '@/hooks/use-subscription'
import { LoginButton } from '@/modules/auth/components/LoginButton'
import { useNavBar } from '@/modules/shared/hooks/useNavBar'
import { motion } from 'framer-motion'
import { Crown, GraduationCap, Sparkles } from 'lucide-react'
import Link from 'next/link'

export const LandingNavBar = () => {
  const { user, isAuthenticated, loading, handleLogout } = useNavBar()
  const { hasActiveSubscription } = useSubscription()
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <GraduationCap className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">RapidQuiz</h1>
          </motion.div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#what-includes" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            What Includes?
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Plans
          </Link>
          <Link href="#faq" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Frequent questions
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <UserAvatar user={user} size="sm" showName={true} />
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  disabled={loading}
                  size="sm"
                >
                  Logout
                </Button>
              </motion.div>
            </div>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </motion.header>
  )
}
