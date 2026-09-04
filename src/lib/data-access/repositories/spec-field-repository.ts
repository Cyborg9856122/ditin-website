import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/data-access/supabase/database.types"
import type { SpecField } from "@/lib/domain/types"

/**
 * Owner-managed specification field definitions (labels shown as row
 * headings on the public product page). Values per product live in
 * product_spec_values — see product-spec-value-repository.ts.
 */
export async function listSpecFields(
  supabase: SupabaseClient<Database>,
): Promise<SpecField[]> {
  const { data, error } = await supabase
    .from("spec_fields")
    .select("*")
    .order("sort_order", { ascending: true })

  if (error) throw new Error(`listSpecFields failed: ${error.message}`)
  return data
}

export async function createSpecField(
  supabase: SupabaseClient<Database>,
  input: { label: string; unit?: string | null },
): Promise<SpecField> {
  const existing = await listSpecFields(supabase)
  const { data, error } = await supabase
    .from("spec_fields")
    .insert({
      label: input.label,
      unit: input.unit || null,
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
  input: { label: string; unit?: string | null },
): Promise<SpecField> {
  const { data, error } = await supabase
    .from("spec_fields")
    .update({ label: input.label, unit: input.unit || null })
    .eq("id", id)
    .select("*")
    .single()

  if (error) throw new Error(`updateSpecField failed: ${error.message}`)
  return data
}

export async function deleteSpecField(
  supabase: SupabaseClient<Database>,
  id: string,
): Promise<void> {
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
