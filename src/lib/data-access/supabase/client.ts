"use client"

// Browser-side Supabase client. Uses the publishable (anon) key only —
// safe to expose to the client bundle. All access is governed by RLS.
import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "./database.types"

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
