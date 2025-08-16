import { SupabaseAuth } from '@/components/auth/supabase-auth'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Inicia sesión en tu cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            O{' '}
            <a
              href="/auth/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              crea una nueva cuenta
            </a>
          </p>
        </div>
        <SupabaseAuth />
      </div>
    </div>
  )
}

