import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/data-access/supabase/database.types"

/** Map of spec_field_id -> value for one product. */
export async function getSpecValuesForProduct(
  supabase: SupabaseClient<Database>,
  productId: string,
): Promise<Map<string, string>> {
  const { data, error } = await supabase
    .from("product_spec_values")
    .select("*")
    .eq("product_id", productId)

  if (error) throw new Error(`getSpecValuesForProduct failed: ${error.message}`)
  return new Map(data.map((row) => [row.spec_field_id, row.value ?? ""]))
}

/**
 * Replaces a product's dynamic spec values in one call. A blank value
 * deletes the row entirely (rather than storing an empty string) so the
 * public product page's "hide specs with no value" rule has nothing to
 * filter around.
 */
export async function setSpecValuesForProduct(
  supabase: SupabaseClient<Database>,
  productId: string,
  values: Record<string, string>,
): Promise<void> {
  const results = await Promise.all(
    Object.entries(values).map(([specFieldId, rawValue]) => {
      const value = rawValue.trim()
      if (value) {
        return supabase
          .from("product_spec_values")
          .upsert(
            { product_id: productId, spec_field_id: specFieldId, value },
            { onConflict: "product_id,spec_field_id" },
          )
      }
      return supabase
        .from("product_spec_values")
        .delete()
        .eq("product_id", productId)
        .eq("spec_field_id", specFieldId)
    }),
  )

  const failed = results.find((r) => r.error)
  if (failed?.error) throw new Error(`setSpecValuesForProduct failed: ${failed.error.message}`)
}
