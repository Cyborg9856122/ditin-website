import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

/**
 * Anon-key Supabase client with no cookie/session handling at all. Use this
 * anywhere there's no HTTP request to read cookies from — most notably
 * `generateStaticParams`, which runs at build time. Never returns anything
 * a session-aware query wouldn't (RLS still applies as anon), so it's safe
 * for any public, unauthenticated read.
 */
export function createSupabasePublicClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
