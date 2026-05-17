import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/** Sunucuya yazılan kullanıcı ilerlemesi satırının şekli (`learning_progress` tablosu). */
export interface LearningProgressRow {
  user_id: string
  completed_lesson_ids: string[]
  last_lesson_id: string | null
  extended_progress?: unknown
  updated_at?: string | null
}

let client: SupabaseClient | null = null

/** `.env` tanımlıysa Tekil Supabase istemcisi. */
export function getSupabaseClient(): SupabaseClient | null {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
  if (!url?.trim() || !key?.trim()) return null
  client ??= createClient(url.trim(), key.trim())
  return client
}

/** Vite ortamında bulut senkronunun etkin olup olmayacağı. */
export function isCloudSyncConfigured(): boolean {
  return getSupabaseClient() !== null
}
