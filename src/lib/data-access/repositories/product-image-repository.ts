import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/data-access/supabase/database.types"
import type { ProductImage } from "@/lib/domain/types"

const BUCKET = "product-images"

export async function listImagesForProduct(
  supabase: SupabaseClient<Database>,
  productId: string,
): Promise<ProductImage[]> {
  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true })

  if (error) throw new Error(`listImagesForProduct failed: ${error.message}`)
  return data
}

/**
 * One primary image per product, keyed by product_id — for catalogue grid
 * thumbnails, where fetching every image for every product would be wasteful.
 */
export async function listPrimaryImagesForProducts(
  supabase: SupabaseClient<Database>,
  productIds: string[],
): Promise<Map<string, ProductImage>> {
  if (productIds.length === 0) return new Map()

  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .in("product_id", productIds)
    .eq("is_primary", true)

  if (error) throw new Error(`listPrimaryImagesForProducts failed: ${error.message}`)

  return new Map(data.map((image) => [image.product_id, image]))
}

export function getPublicImageUrl(
  supabase: SupabaseClient<Database>,
  storagePath: string,
): string {
  return supabase.storage.from(BUCKET).getPublicUrl(storagePath).data.publicUrl
}

export async function uploadProductImage(
  supabase: SupabaseClient<Database>,
  productId: string,
  file: File,
  opts: { altText?: string; sortOrder: number; isPrimary: boolean },
): Promise<ProductImage> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const path = `${productId}/${crypto.randomUUID()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false })

  if (uploadError) {
    throw new Error(`uploadProductImage (storage) failed: ${uploadError.message}`)
  }

  const { data, error } = await supabase
    .from("product_images")
    .insert({
      product_id: productId,
      storage_path: path,
      alt_text: opts.altText || null,
      sort_order: opts.sortOrder,
      is_primary: opts.isPrimary,
    })
    .select("*")
    .single()

  if (error) {
    // Roll back the uploaded file if the row insert failed, so storage
    // doesn't accumulate orphaned files.
    await supabase.storage.from(BUCKET).remove([path])
    throw new Error(`uploadProductImage (row) failed: ${error.message}`)
  }

  return data
}

export async function deleteProductImage(
  supabase: SupabaseClient<Database>,
  image: Pick<ProductImage, "id" | "storage_path">,
): Promise<void> {
  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .remove([image.storage_path])
  if (storageError) {
    throw new Error(`deleteProductImage (storage) failed: ${storageError.message}`)
  }

  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", image.id)
  if (error) throw new Error(`deleteProductImage (row) failed: ${error.message}`)
}

export async function setPrimaryImage(
  supabase: SupabaseClient<Database>,
  productId: string,
  imageId: string,
): Promise<void> {
  const { error: clearError } = await supabase
    .from("product_images")
    .update({ is_primary: false })
    .eq("product_id", productId)
  if (clearError) {
    throw new Error(`setPrimaryImage (clear) failed: ${clearError.message}`)
  }

  const { error } = await supabase
    .from("product_images")
    .update({ is_primary: true })
    .eq("id", imageId)
  if (error) throw new Error(`setPrimaryImage failed: ${error.message}`)
}
