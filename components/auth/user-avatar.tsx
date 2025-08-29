'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { User } from '@/modules/auth/types/user.type'
import { motion } from 'framer-motion'
import {
  Crown,
  LogOut,
  Settings,
  Sparkles,
  User as UserIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UserAvatarProps {
  user: User
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showName?: boolean
  hasActiveSubscription?: boolean
  onLogout?: () => void
  isLoading?: boolean
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
}

const textSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

export const UserAvatar = ({
  user,
  size = 'md',
  className,
  showName = false,
  hasActiveSubscription = false,
  onLogout,
  isLoading = false,
}: UserAvatarProps) => {
  const router = useRouter()

  // Función para obtener las iniciales del usuario
  const getInitials = (name: string, email: string) => {
    if (name && name.trim()) {
      return name
        .split(' ')
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join('')
    }

    // Si no tiene nombre, usar las iniciales del email
    return email.charAt(0).toUpperCase()
  }

  // Obtener el nombre para mostrar
  const displayName = user.name || user.username || user.email.split('@')[0]
  const initials = getInitials(user.name, user.email)

  // Premium avatar wrapper component
  const PremiumAvatarWrapper = ({
    children,
  }: {
    children: React.ReactNode
  }) => {
    if (!hasActiveSubscription) return <>{children}</>

    return (
      <div className="relative">
        {/* Golden glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/30 via-amber-500/30 to-yellow-600/30 blur-sm"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Sparkles animation */}
        <motion.div
          className="absolute -top-1 -right-1 text-yellow-400"
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Sparkles className="w-3 h-3" />
        </motion.div>

        {/* Crown icon for premium users */}
        <motion.div
          className="absolute -top-2 -left-1 text-yellow-500"
          animate={{
            y: [-2, 0, -2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Crown className="w-3 h-3" />
        </motion.div>

        {children}
      </div>
    )
  }

  if (showName) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div
            className={cn(
              'flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity',
              className,
            )}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <PremiumAvatarWrapper>
              <Avatar
                className={cn(
                  sizeClasses[size],
                  hasActiveSubscription
                    ? 'border-2 border-yellow-400/50 shadow-lg shadow-yellow-400/25'
                    : 'border-2 border-primary/20',
                )}
              >
                <AvatarImage
                  src={user.photoUrl}
                  alt={`Foto de perfil de ${displayName}`}
                  className="object-cover"
                />
                <AvatarFallback
                  className={cn(
                    'text-primary font-semibold',
                    hasActiveSubscription
                      ? 'bg-gradient-to-br from-yellow-400/20 to-amber-500/30'
                      : 'bg-gradient-to-br from-primary/20 to-primary/30',
                  )}
                >
                  {user.photoUrl ? (
                    <UserIcon className="h-1/2 w-1/2" />
                  ) : (
                    initials
                  )}
                </AvatarFallback>
              </Avatar>
            </PremiumAvatarWrapper>
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  'font-medium text-foreground',
                  textSizeClasses[size],
                )}
              >
                {displayName}
              </span>
            </div>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push('/settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          {onLogout && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={onLogout}
                disabled={isLoading}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <PremiumAvatarWrapper>
        <Avatar
          className={cn(
            sizeClasses[size],
            hasActiveSubscription
              ? 'border-2 border-yellow-400/50 shadow-lg shadow-yellow-400/25 cursor-pointer hover:border-yellow-400/70 transition-colors'
              : 'border-2 border-primary/20 cursor-pointer hover:border-primary/40 transition-colors',
          )}
        >
          <AvatarImage
            src={user.photoUrl}
            alt={`Foto de perfil de ${displayName}`}
            className="object-cover"
          />
          <AvatarFallback
            className={cn(
              'text-primary font-semibold',
              hasActiveSubscription
                ? 'bg-gradient-to-br from-yellow-400/20 to-amber-500/30'
                : 'bg-gradient-to-br from-primary/20 to-primary/30',
            )}
          >
            {user.photoUrl ? <UserIcon className="h-1/2 w-1/2" /> : initials}
          </AvatarFallback>
        </Avatar>
      </PremiumAvatarWrapper>
    </motion.div>
  )
}
