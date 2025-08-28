'use client'
import { UserAvatar } from '@/components/auth/user-avatar'
import { Button } from '@/components/ui/button'
import { LoginButton } from '@/modules/auth/components/LoginButton'
import { useNavBar } from '@/modules/shared/hooks/useNavBar'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export const LandingNavBar = () => {
  const { user, isAuthenticated, loading, handleLogout } = useNavBar()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
          <Link
            href="#what-includes"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            What Includes?
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Plans
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Frequent questions
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
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

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {/* Mobile Navigation Links */}
              <nav className="space-y-4">
                <Link
                  href="#what-includes"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-lg font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                >
                  What Includes?
                </Link>
                <Link
                  href="#pricing"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-lg font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                >
                  Plans
                </Link>
                <Link
                  href="#faq"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-lg font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                >
                  Frequent questions
                </Link>
              </nav>

              {/* Mobile Auth */}
              <div className="pt-4 border-t">
                {isAuthenticated && user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar user={user} size="sm" showName={true} />
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleLogout()
                          setIsMobileMenuOpen(false)
                        }}
                        disabled={loading}
                        className="w-full"
                      >
                        Logout
                      </Button>
                    </motion.div>
                  </div>
                ) : (
                  <div onClick={() => setIsMobileMenuOpen(false)}>
                    <LoginButton />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
