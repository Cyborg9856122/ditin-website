import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/data-access/supabase/database.types"
import type { SpecField, SpecFieldOption, SpecFieldType } from "@/lib/domain/types"

/**
 * The single, unified specification-field library (Settings → Product
 * Specifications). Every field — whether it's one of the four fields the
 * app seeded from the old fixed columns (field_key set) or one an admin
 * added — lives here and works the same way. field_key fields can be
 * renamed/reordered/typed like any other, but can't be hard-deleted (only
 * archived) since app code (the pixel-pitch calculator) depends on being
 * able to find them.
 */
export async function listSpecFields(
  supabase: SupabaseClient<Database>,
  opts: { includeArchived?: boolean } = {},
): Promise<SpecField[]> {
  let query = supabase.from("spec_fields").select("*").order("sort_order", { ascending: true })
  if (!opts.includeArchived) query = query.eq("is_archived", false)

  const { data, error } = await query
  if (error) throw new Error(`listSpecFields failed: ${error.message}`)
  return data
}

export async function getSpecFieldByKey(
  supabase: SupabaseClient<Database>,
  fieldKey: string,
): Promise<SpecField | null> {
  const { data, error } = await supabase
    .from("spec_fields")
    .select("*")
    .eq("field_key", fieldKey)
    .maybeSingle()

  if (error) throw new Error(`getSpecFieldByKey failed: ${error.message}`)
  return data
}

export async function createSpecField(
  supabase: SupabaseClient<Database>,
  input: { label: string; unit?: string | null; field_type: SpecFieldType },
): Promise<SpecField> {
  const existing = await listSpecFields(supabase, { includeArchived: true })
  const { data, error } = await supabase
    .from("spec_fields")
    .insert({
      label: input.label,
      unit: input.unit || null,
      field_type: input.field_type,
      sort_order: existing.length,
    })
    .select("*")
    .single()

  if (error) throw new Error(`createSpecField failed: ${error.message}`)
  return data
}

export async function updateSpecField(
  supabase: SupabaseClient<Database>,
  id: string,
  input: { label: string; unit?: string | null; field_type: SpecFieldType },
): Promise<SpecField> {
  const { data, error } = await supabase
    .from("spec_fields")
    .update({ label: input.label, unit: input.unit || null, field_type: input.field_type })
    .eq("id", id)
    .select("*")
    .single()

  if (error) throw new Error(`updateSpecField failed: ${error.message}`)
  return data
}

export async function setSpecFieldArchived(
  supabase: SupabaseClient<Database>,
  id: string,
  isArchived: boolean,
): Promise<void> {
  const { error } = await supabase
    .from("spec_fields")
    .update({ is_archived: isArchived })
    .eq("id", id)
  if (error) throw new Error(`setSpecFieldArchived failed: ${error.message}`)
}

/**
 * Fields seeded from the old fixed columns (field_key set) can't be
 * hard-deleted — the app depends on being able to find them (e.g. the
 * pixel-pitch calculator) and deleting would cascade-delete every
 * product's historical value. Archive them instead.
 */
export async function deleteSpecField(
  supabase: SupabaseClient<Database>,
  id: string,
): Promise<void> {
  const field = await supabase.from("spec_fields").select("field_key").eq("id", id).single()
  if (field.error) throw new Error(`deleteSpecField failed: ${field.error.message}`)
  if (field.data.field_key) {
    throw new Error("This field is used by the site and can only be archived, not deleted.")
  }

  const { error } = await supabase.from("spec_fields").delete().eq("id", id)
  if (error) throw new Error(`deleteSpecField failed: ${error.message}`)
}

/**
 * Swaps the sort_order of two fields — used by the Settings page's simple
 * move-up/move-down controls (no drag-and-drop needed for a short list).
 */
export async function swapSpecFieldOrder(
  supabase: SupabaseClient<Database>,
  fieldA: { id: string; sort_order: number },
  fieldB: { id: string; sort_order: number },
): Promise<void> {
  const [a, b] = await Promise.all([
    supabase.from("spec_fields").update({ sort_order: fieldB.sort_order }).eq("id", fieldA.id),
    supabase.from("spec_fields").update({ sort_order: fieldA.sort_order }).eq("id", fieldB.id),
  ])
  if (a.error) throw new Error(`swapSpecFieldOrder failed: ${a.error.message}`)
  if (b.error) throw new Error(`swapSpecFieldOrder failed: ${b.error.message}`)
}

// --- Options (for dropdown / multiselect fields) ---------------------------

export async function listSpecFieldOptions(
  supabase: SupabaseClient<Database>,
  specFieldId: string,
): Promise<SpecFieldOption[]> {
  const { data, error } = await supabase
    .from("spec_field_options")
    .select("*")
    .eq("spec_field_id", specFieldId)
    .order("sort_order", { ascending: true })

  if (error) throw new Error(`listSpecFieldOptions failed: ${error.message}`)
  return data
}

/** All options for every given field, grouped by spec_field_id — for rendering many fields at once. */
export async function listSpecFieldOptionsForFields(
  supabase: SupabaseClient<Database>,
  specFieldIds: string[],
): Promise<Map<string, SpecFieldOption[]>> {
  if (specFieldIds.length === 0) return new Map()

  const { data, error } = await supabase
    .from("spec_field_options")
    .select("*")
    .in("spec_field_id", specFieldIds)
    .order("sort_order", { ascending: true })

  if (error) throw new Error(`listSpecFieldOptionsForFields failed: ${error.message}`)

  const map = new Map<string, SpecFieldOption[]>()
  for (const option of data) {
    const list = map.get(option.spec_field_id) ?? []
    list.push(option)
    map.set(option.spec_field_id, list)
  }
  return map
}

export async function createSpecFieldOption(
  supabase: SupabaseClient<Database>,
  specFieldId: string,
  label: string,
): Promise<SpecFieldOption> {
  const existing = await listSpecFieldOptions(supabase, specFieldId)
  const { data, error } = await supabase
    .from("spec_field_options")
    .insert({ spec_field_id: specFieldId, label, sort_order: existing.length })
    .select("*")
    .single()

  if (error) throw new Error(`createSpecFieldOption failed: ${error.message}`)
  return data
}

export async function updateSpecFieldOption(
  supabase: SupabaseClient<Database>,
  id: string,
  label: string,
): Promise<SpecFieldOption> {
  const { data, error } = await supabase
    .from("spec_field_options")
    .update({ label })
    .eq("id", id)
    .select("*")
    .single()

  if (error) throw new Error(`updateSpecFieldOption failed: ${error.message}`)
  return data
}

export async function deleteSpecFieldOption(
  supabase: SupabaseClient<Database>,
  id: string,
): Promise<void> {
  const { error } = await supabase.from("spec_field_options").delete().eq("id", id)
  if (error) throw new Error(`deleteSpecFieldOption failed: ${error.message}`)
}

export async function swapSpecFieldOptionOrder(
  supabase: SupabaseClient<Database>,
  optionA: { id: string; sort_order: number },
  optionB: { id: string; sort_order: number },
): Promise<void> {
  const [a, b] = await Promise.all([
    supabase.from("spec_field_options").update({ sort_order: optionB.sort_order }).eq("id", optionA.id),
    supabase.from("spec_field_options").update({ sort_order: optionA.sort_order }).eq("id", optionB.id),
  ])
  if (a.error) throw new Error(`swapSpecFieldOptionOrder failed: ${a.error.message}`)
  if (b.error) throw new Error(`swapSpecFieldOptionOrder failed: ${b.error.message}`)
}
