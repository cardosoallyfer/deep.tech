// Arquivo: lib/supabase/client.ts
// Localização: /lib/supabase/client.ts
// Descrição: Cliente Supabase para uso no browser

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}ß