import { Toaster } from '@/components/ui/sonner'
import { AuthWrapper } from '@/modules/auth/components/AuthWrapper'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QuizCraft - Interactive Quiz Generator for Educators',
  description:
    'Create engaging, interactive quizzes with stunning animations and instant feedback. Perfect for educators who want to make learning fun and memorable.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthWrapper>
          {children}
          <Toaster position="top-center" />
        </AuthWrapper>
      </body>
    </html>
  )
}
