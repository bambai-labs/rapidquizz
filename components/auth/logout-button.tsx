'use client'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const handleLogout = async () => {}

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      className="flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
      Cerrar sesión
    </Button>
  )
}
