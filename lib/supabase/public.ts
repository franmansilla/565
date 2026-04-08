import { createClient } from '@supabase/supabase-js'

// Cliente sin manejo de sesión — para páginas públicas que no requieren auth.
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
