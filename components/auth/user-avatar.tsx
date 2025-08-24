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
import { Settings, User as UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UserAvatarProps {
  user: User
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showName?: boolean
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
            <Avatar
              className={cn(sizeClasses[size], 'border-2 border-primary/20')}
            >
              <AvatarImage
                src={user.photoUrl}
                alt={`Foto de perfil de ${displayName}`}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/30 text-primary font-semibold">
                {user.photoUrl ? (
                  <UserIcon className="h-1/2 w-1/2" />
                ) : (
                  initials
                )}
              </AvatarFallback>
            </Avatar>
            <span
              className={cn(
                'font-medium text-foreground',
                textSizeClasses[size],
              )}
            >
              {displayName}
            </span>
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
            <span>Ajustes</span>
          </DropdownMenuItem>
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
      <Avatar
        className={cn(
          sizeClasses[size],
          'border-2 border-primary/20 cursor-pointer hover:border-primary/40 transition-colors',
        )}
      >
        <AvatarImage
          src={user.photoUrl}
          alt={`Foto de perfil de ${displayName}`}
          className="object-cover"
        />
        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/30 text-primary font-semibold">
          {user.photoUrl ? <UserIcon className="h-1/2 w-1/2" /> : initials}
        </AvatarFallback>
      </Avatar>
    </motion.div>
  )
}
