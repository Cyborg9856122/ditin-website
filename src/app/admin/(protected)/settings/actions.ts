"use server"

import { revalidatePath } from "next/cache"
import { createSupabaseServerClient } from "@/lib/data-access/supabase/server"
import { getCurrentProfile } from "@/lib/data-access/repositories/profile-repository"
import {
  createSpecField,
  createSpecFieldOption,
  deleteSpecField,
  deleteSpecFieldOption,
  listSpecFieldOptions,
  listSpecFields,
  setSpecFieldArchived,
  swapSpecFieldOptionOrder,
  swapSpecFieldOrder,
  updateSpecField,
  updateSpecFieldOption,
} from "@/lib/data-access/repositories/spec-field-repository"
import { permissions } from "@/lib/domain/auth/permissions"
import type { SpecFieldType } from "@/lib/domain/types"

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

const VALID_TYPES: SpecFieldType[] = ["text", "number", "dropdown", "multiselect", "boolean"]

function parseFieldType(formData: FormData): SpecFieldType {
  const raw = String(formData.get("field_type") || "text")
  return (VALID_TYPES as string[]).includes(raw) ? (raw as SpecFieldType) : "text"
}

export async function createSpecFieldAction(formData: FormData) {
  const { supabase } = await requireOwner()
  const label = String(formData.get("label") || "").trim()
  const unit = String(formData.get("unit") || "").trim()
  if (!label) throw new Error("A label is required.")

  await createSpecField(supabase, { label, unit: unit || null, field_type: parseFieldType(formData) })
  revalidatePath("/admin/settings")
}

export async function updateSpecFieldAction(fieldId: string, formData: FormData) {
  const { supabase } = await requireOwner()
  const label = String(formData.get("label") || "").trim()
  const unit = String(formData.get("unit") || "").trim()
  if (!label) throw new Error("A label is required.")

  await updateSpecField(supabase, fieldId, {
    label,
    unit: unit || null,
    field_type: parseFieldType(formData),
  })
  revalidatePath("/admin/settings")
  revalidatePublic()
}

export async function setSpecFieldArchivedAction(fieldId: string, archived: boolean) {
  const { supabase } = await requireOwner()
  await setSpecFieldArchived(supabase, fieldId, archived)
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
  const fields = await listSpecFields(supabase, { includeArchived: true })
  const index = fields.findIndex((f) => f.id === fieldId)
  if (index === -1) return

  const targetIndex = direction === "up" ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= fields.length) return

  await swapSpecFieldOrder(supabase, fields[index], fields[targetIndex])
  revalidatePath("/admin/settings")
}

export async function createSpecFieldOptionAction(specFieldId: string, formData: FormData) {
  const { supabase } = await requireOwner()
  const label = String(formData.get("label") || "").trim()
  if (!label) throw new Error("An option label is required.")

  await createSpecFieldOption(supabase, specFieldId, label)
  revalidatePath("/admin/settings")
  revalidatePublic()
}

export async function updateSpecFieldOptionAction(optionId: string, formData: FormData) {
  const { supabase } = await requireOwner()
  const label = String(formData.get("label") || "").trim()
  if (!label) throw new Error("An option label is required.")

  await updateSpecFieldOption(supabase, optionId, label)
  revalidatePath("/admin/settings")
  revalidatePublic()
}

export async function deleteSpecFieldOptionAction(optionId: string) {
  const { supabase } = await requireOwner()
  await deleteSpecFieldOption(supabase, optionId)
  revalidatePath("/admin/settings")
  revalidatePublic()
}

export async function moveSpecFieldOptionAction(
  specFieldId: string,
  optionId: string,
  direction: "up" | "down",
) {
  const { supabase } = await requireOwner()
  const options = await listSpecFieldOptions(supabase, specFieldId)
  const index = options.findIndex((o) => o.id === optionId)
  if (index === -1) return

  const targetIndex = direction === "up" ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= options.length) return

  await swapSpecFieldOptionOrder(supabase, options[index], options[targetIndex])
  revalidatePath("/admin/settings")
}
