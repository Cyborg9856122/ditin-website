"use server"

import { revalidatePath } from "next/cache"
import { createSupabaseServerClient } from "@/lib/data-access/supabase/server"
import { createSupabaseAdminClient } from "@/lib/data-access/supabase/admin"
import {
  createStaffUser,
  deleteStaffUser,
  getCurrentProfile,
  updateProfileRole,
} from "@/lib/data-access/repositories/profile-repository"
import { permissions } from "@/lib/domain/auth/permissions"
import { inviteUserSchema } from "@/lib/domain/validation/user-schema"
import { generateTemporaryPassword } from "@/lib/domain/utils/password"
import type { Role } from "@/lib/domain/types"

export type CreateUserState = {
  error: string | null
  fieldErrors?: Record<string, string>
  created?: { email: string; temporaryPassword: string }
}

async function requireOwner() {
  const supabase = await createSupabaseServerClient()
  const profile = await getCurrentProfile(supabase)
  if (!profile || !permissions.canManageUsers(profile.role)) {
    throw new Error("Only the Owner can manage users.")
  }
  return profile
}

export async function createUserAction(
  _prevState: CreateUserState,
  formData: FormData,
): Promise<CreateUserState> {
  await requireOwner()

  const parsed = inviteUserSchema.safeParse({
    email: formData.get("email"),
    fullName: formData.get("fullName"),
    role: formData.get("role"),
  })

  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors
    const fieldErrors: Record<string, string> = {}
    for (const [key, messages] of Object.entries(flat)) {
      if (messages?.[0]) fieldErrors[key] = messages[0]
    }
    return { error: "Check the fields below.", fieldErrors }
  }

  let admin
  try {
    admin = createSupabaseAdminClient()
  } catch {
    return {
      error:
        "SUPABASE_SERVICE_ROLE_KEY isn't configured yet — add it to .env.local before creating users.",
    }
  }

  const temporaryPassword = generateTemporaryPassword()

  try {
    await createStaffUser(admin, {
      email: parsed.data.email,
      fullName: parsed.data.fullName,
      role: parsed.data.role,
      temporaryPassword,
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create user." }
  }

  revalidatePath("/admin/users")
  return {
    error: null,
    created: { email: parsed.data.email, temporaryPassword },
  }
}

export async function updateUserRoleAction(userId: string, role: Role) {
  const supabase = await createSupabaseServerClient()
  await requireOwner()
  await updateProfileRole(supabase, userId, role)
  revalidatePath("/admin/users")
}

export async function deleteUserAction(userId: string) {
  const actingProfile = await requireOwner()
  if (actingProfile.id === userId) {
    throw new Error("You can't remove your own account.")
  }

  let admin
  try {
    admin = createSupabaseAdminClient()
  } catch {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY isn't configured yet — add it to .env.local before removing users.",
    )
  }

  await deleteStaffUser(admin, userId)
  revalidatePath("/admin/users")
}
