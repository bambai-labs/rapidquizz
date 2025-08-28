'use client'
import { UserAvatar } from '@/components/auth/user-avatar'
import { Button } from '@/components/ui/button'
import { useSubscription } from '@/hooks/use-subscription'
import { motion } from 'framer-motion'
import { Crown, GraduationCap, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useNavBar } from '../hooks/useNavBar'

export const NavBar = () => {
  const { user, loading, handleLogout } = useNavBar()
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

        <div className="flex items-center gap-3">
          {!hasActiveSubscription && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link href="/pricing">
                <Button className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 hover:from-purple-700 hover:via-purple-800 hover:to-indigo-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 px-6 py-2.5 rounded-full group overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                  <div className="relative flex items-center gap-2 z-10">
                    <Crown className="w-4 h-4" />
                    <span>Become Pro</span>
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                    </motion.div>
                  </div>
                </Button>
              </Link>
            </motion.div>
          )}

          {user && (
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
          )}
        </div>
      </div>
    </motion.header>
  )
}
