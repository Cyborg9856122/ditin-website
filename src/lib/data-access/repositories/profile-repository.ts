import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/data-access/supabase/database.types"
import type { Profile, Role } from "@/lib/domain/types"

/**
 * Data-access layer for the `profiles` table. Takes an already-constructed
 * Supabase client (browser, server, or admin) so callers control which
 * auth context the query runs under — this module has no opinion on that.
 */
export async function getCurrentProfile(
  supabase: SupabaseClient<Database>,
): Promise<Profile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error) {
    console.error("getCurrentProfile failed:", error.message)
    return null
  }

  return data
}

export async function listProfiles(
  supabase: SupabaseClient<Database>,
): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true })

  if (error) throw new Error(`listProfiles failed: ${error.message}`)
  return data
}

export async function updateProfileRole(
  supabase: SupabaseClient<Database>,
  id: string,
  role: Role,
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", id)
    .select("*")
    .single()

  if (error) throw new Error(`updateProfileRole failed: ${error.message}`)
  return data
}

/**
 * Creates a new staff auth user with a temporary password and the given
 * role/name in metadata (read by the `handle_new_user` trigger to seed the
 * profiles row). Requires the service-role admin client — never call this
 * with the browser/server (anon-key) client.
 */
export async function createStaffUser(
  supabaseAdmin: SupabaseClient<Database>,
  params: { email: string; fullName: string; role: Role; temporaryPassword: string },
): Promise<Profile> {
  const { data: userData, error: createError } =
    await supabaseAdmin.auth.admin.createUser({
      email: params.email,
      password: params.temporaryPassword,
      email_confirm: true,
      user_metadata: { role: params.role, full_name: params.fullName },
    })

  if (createError || !userData.user) {
    throw new Error(`createStaffUser failed: ${createError?.message}`)
  }

  // The handle_new_user trigger inserts the profiles row synchronously as
  // part of the same auth.users insert transaction, so it's already there.
  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", userData.user.id)
    .single()

  if (profileError) {
    throw new Error(`createStaffUser (profile lookup) failed: ${profileError.message}`)
  }

  return profile
}

export async function deleteStaffUser(
  supabaseAdmin: SupabaseClient<Database>,
  id: string,
): Promise<void> {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id)
  if (error) throw new Error(`deleteStaffUser failed: ${error.message}`)
}
