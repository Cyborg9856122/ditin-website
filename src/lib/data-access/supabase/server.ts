import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import type { Database } from "./database.types"

/**
 * Server-side Supabase client for use in Server Components, Server Actions,
 * and Route Handlers. Reads/writes the auth session via cookies. Still uses
 * the publishable (anon) key — access is governed entirely by RLS, matching
 * whichever user's session is in the request.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // Called from a Server Component — the middleware already
            // refreshes the session, so writes here can be safely ignored.
          }
        },
      },
    },
  )
}
