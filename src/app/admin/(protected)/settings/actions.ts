"use server"

import { revalidatePath } from "next/cache"
import { createSupabaseServerClient } from "@/lib/data-access/supabase/server"
import { getCurrentProfile } from "@/lib/data-access/repositories/profile-repository"
import {
  createSpecField,
  deleteSpecField,
  listSpecFields,
  swapSpecFieldOrder,
  updateSpecField,
} from "@/lib/data-access/repositories/spec-field-repository"
import { permissions } from "@/lib/domain/auth/permissions"

async function requireOwner() {
  const supabase = await createSupabaseServerClient()
  const profile = await getCurrentProfile(supabase)
  if (!profile || !permissions.canManageSiteSettings(profile.role)) {
    throw new Error("You don't have permission to do that.")
  }
  return { supabase, profile }
}

// Spec fields are rendered on every published product page, so any change
// here has to bust the public catalogue cache too.
function revalidatePublic() {
  revalidatePath("/catalogue")
}

export async function createSpecFieldAction(formData: FormData) {
  const { supabase } = await requireOwner()
  const label = String(formData.get("label") || "").trim()
  const unit = String(formData.get("unit") || "").trim()
  if (!label) throw new Error("A label is required.")

  await createSpecField(supabase, { label, unit: unit || null })
  revalidatePath("/admin/settings")
}

export async function updateSpecFieldAction(fieldId: string, formData: FormData) {
  const { supabase } = await requireOwner()
  const label = String(formData.get("label") || "").trim()
  const unit = String(formData.get("unit") || "").trim()
  if (!label) throw new Error("A label is required.")

  await updateSpecField(supabase, fieldId, { label, unit: unit || null })
  revalidatePath("/admin/settings")
  revalidatePublic()
}

export async function deleteSpecFieldAction(fieldId: string) {
  const { supabase } = await requireOwner()
  await deleteSpecField(supabase, fieldId)
  revalidatePath("/admin/settings")
  revalidatePublic()
}

export async function moveSpecFieldAction(fieldId: string, direction: "up" | "down") {
  const { supabase } = await requireOwner()
  const fields = await listSpecFields(supabase)
  const index = fields.findIndex((f) => f.id === fieldId)
  if (index === -1) return

  const targetIndex = direction === "up" ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= fields.length) return

  await swapSpecFieldOrder(supabase, fields[index], fields[targetIndex])
  revalidatePath("/admin/settings")
}
