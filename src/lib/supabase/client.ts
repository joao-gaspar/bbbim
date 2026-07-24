import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Retornar um cliente placeholder seguro durante o build estático se as variáveis estiverem ausentes
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

  return createBrowserClient(
    supabaseUrl,
    supabaseKey
  )
}
