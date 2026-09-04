import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/data-access/supabase/database.types"
import type {
  Availability,
  Placement,
  Product,
  ProductCategory,
  ProductStatus,
} from "@/lib/domain/types"
import type { ProductFormValues } from "@/lib/domain/validation/product-schema"
import { slugify } from "@/lib/domain/utils/slug"

export type ProductFilters = {
  status?: ProductStatus
  category?: ProductCategory
  placement?: Placement
  availability?: Availability
  search?: string
}

export async function listProducts(
  supabase: SupabaseClient<Database>,
  filters: ProductFilters = {},
): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select("*")
    .order("updated_at", { ascending: false })

  if (filters.status) query = query.eq("status", filters.status)
  if (filters.category) query = query.eq("category", filters.category)
  if (filters.search) query = query.ilike("name", `%${filters.search}%`)

  // A product marked "both" satisfies a filter for either specific value —
  // e.g. filtering for "rent" should also surface rent-or-buy products.
  if (filters.placement) {
    query =
      filters.placement === "both"
        ? query.eq("placement", "both")
        : query.in("placement", [filters.placement, "both"])
  }
  if (filters.availability) {
    query =
      filters.availability === "both"
        ? query.eq("availability", "both")
        : query.in("availability", [filters.availability, "both"])
  }

  const { data, error } = await query
  if (error) throw new Error(`listProducts failed: ${error.message}`)
  return data
}

export async function getProductById(
  supabase: SupabaseClient<Database>,
  id: string,
): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) throw new Error(`getProductById failed: ${error.message}`)
  return data
}

export async function getPublishedProductBySlug(
  supabase: SupabaseClient<Database>,
  slug: string,
): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()

  if (error) throw new Error(`getPublishedProductBySlug failed: ${error.message}`)
  return data
}

export async function slugExists(
  supabase: SupabaseClient<Database>,
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  let query = supabase.from("products").select("id").eq("slug", slug)
  if (excludeId) query = query.neq("id", excludeId)
  const { data, error } = await query.maybeSingle()
  if (error) throw new Error(`slugExists failed: ${error.message}`)
  return data !== null
}

/**
 * Slugs are an internal URL detail now — admins never see or edit them.
 * Generated once from the name at creation time and never changed after,
 * so existing links keep working even if the product is later renamed.
 * Falls back to a short random suffix if the name produces an empty slug
 * (e.g. a name that's entirely emoji/symbols), and disambiguates
 * collisions automatically by appending -2, -3, etc.
 */
export async function generateUniqueSlug(
  supabase: SupabaseClient<Database>,
  name: string,
): Promise<string> {
  const base = slugify(name) || `product-${crypto.randomUUID().slice(0, 8)}`

  let candidate = base
  let attempt = 1
  while (await slugExists(supabase, candidate)) {
    attempt += 1
    candidate = `${base}-${attempt}`
  }
  return candidate
}

export async function createProduct(
  supabase: SupabaseClient<Database>,
  values: ProductFormValues & { slug: string },
  createdBy: string,
): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .insert({ ...values, created_by: createdBy, updated_by: createdBy })
    .select("*")
    .single()

  if (error) throw new Error(`createProduct failed: ${error.message}`)
  return data
}

export async function updateProduct(
  supabase: SupabaseClient<Database>,
  id: string,
  values: ProductFormValues,
  updatedBy: string,
): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .update({ ...values, updated_by: updatedBy })
    .eq("id", id)
    .select("*")
    .single()

  if (error) throw new Error(`updateProduct failed: ${error.message}`)
  return data
}

export async function setProductStatus(
  supabase: SupabaseClient<Database>,
  id: string,
  status: ProductStatus,
  updatedBy: string,
): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .update({
      status,
      updated_by: updatedBy,
      published_at: status === "published" ? new Date().toISOString() : null,
    })
    .eq("id", id)
    .select("*")
    .single()

  if (error) throw new Error(`setProductStatus failed: ${error.message}`)
  return data
}

export async function deleteProduct(
  supabase: SupabaseClient<Database>,
  id: string,
): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) throw new Error(`deleteProduct failed: ${error.message}`)
}
