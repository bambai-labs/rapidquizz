import { createClient } from '@supabase/supabase-js'

/**
 * Cliente de Supabase con privilegios administrativos
 * SOLO debe usarse en el servidor y para operaciones que requieren acceso de administrador
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
