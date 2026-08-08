import "server-only"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

/**
 * Service-role Supabase client. BYPASSES ROW LEVEL SECURITY — never import
 * this outside of Server Actions / Route Handlers, and never send its
 * client to the browser. Used for admin-only operations RLS can't express,
 * such as creating and inviting new admin users (Owner → user management,
 * built in the admin panel phase).
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY, which is intentionally NOT prefixed
 * with NEXT_PUBLIC_ and must never be committed or exposed client-side.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for admin client.",
    )
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
