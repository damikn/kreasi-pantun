import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null
let warned = false

/**
 * Mengembalikan Supabase client yang dibuat dari runtimeConfig.public.
 * Mengembalikan null bila URL/key belum dikonfigurasi — aplikasi tetap
 * berjalan dengan data lokal (mode offline).
 */
export function useSupabase(): SupabaseClient | null {
  if (client) return client
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl as string
  const key = config.public.supabaseAnonKey as string
  if (!url || !key) {
    if (!warned && import.meta.client) {
      console.warn('[kreasi-pantun] Supabase belum dikonfigurasi. Berjalan dalam mode lokal.')
      warned = true
    }
    return null
  }
  client = createClient(url, key)
  return client
}

/** true bila kredensial Supabase tersedia. */
export function useSupabaseReady(): boolean {
  const config = useRuntimeConfig()
  return Boolean(config.public.supabaseUrl && config.public.supabaseAnonKey)
}
