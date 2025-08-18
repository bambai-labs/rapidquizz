'use client'
import { useAuthSuscription } from '../hooks/useAuthSuscription'

interface Props {
  children: React.ReactNode
}

export const AuthWrapper = ({ children }: Props) => {
  useAuthSuscription()

  return <>{children}</>
}
