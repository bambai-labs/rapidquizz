"use client";

import { Button } from '@/components/ui/button';
import { AuthStatus } from '@/modules/auth/types/AuthStatus';
import { useAuthStore } from '@/stores/auth-store';
import { motion } from 'framer-motion';
import { Chrome } from 'lucide-react';

export function GoogleAuthButton() {
  const { authStatus, user, login, logout } = useAuthStore();

  const handleAuth = () => {
    if (authStatus === AuthStatus.AUTHENTICATED) {
      logout();
    } else {
      // Mock Google OAuth - In a real app, use NextAuth or similar
      const mockUser = {
        id: 'user-123',
        name: 'John Educator',
        email: 'john@example.com',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      };
      login(mockUser);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        onClick={handleAuth}
        variant={authStatus === AuthStatus.AUTHENTICATED ? "outline" : "default"}
        className="flex items-center gap-2 min-w-[200px]"
      >
        {authStatus === AuthStatus.AUTHENTICATED ? (
          <>
            <img 
              src={user?.image} 
              alt={user?.name}
              className="w-5 h-5 rounded-full"
            />
            Sign Out
          </>
        ) : (
          <>
            <Chrome className="w-5 h-5" />
            Sign in with Google
          </>
        )}
      </Button>
    </motion.div>
  );
}