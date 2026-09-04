"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/data-access/supabase/server"
import { getCurrentProfile } from "@/lib/data-access/repositories/profile-repository"
import {
  createProduct,
  deleteProduct,
  getProductById,
  slugExists,
  setProductStatus,
  updateProduct,
} from "@/lib/data-access/repositories/product-repository"
import {
  deleteProductImage,
  listImagesForProduct,
  reorderProductImages,
  setPrimaryImage,
} from "@/lib/data-access/repositories/product-image-repository"
import { setSpecValuesForProduct } from "@/lib/data-access/repositories/product-spec-value-repository"
import { listSpecFields } from "@/lib/data-access/repositories/spec-field-repository"
import { permissions } from "@/lib/domain/auth/permissions"
import { productFormSchema } from "@/lib/domain/validation/product-schema"
import { slugify } from "@/lib/domain/utils/slug"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/data-access/supabase/database.types"

export type ProductFormState = {
  error: string | null
  fieldErrors?: Record<string, string>
}

// Product data is publicly cached (ISR) for performance — every mutation
// that could change what a visitor sees has to bust that cache too, not
// just the admin views.
function revalidatePublic(slug?: string) {
  revalidatePath("/catalogue")
  if (slug) revalidatePath(`/catalogue/${slug}`)
}

async function requireEditor() {
  const supabase = await createSupabaseServerClient()
  const profile = await getCurrentProfile(supabase)
  if (!profile || !permissions.canEditProducts(profile.role)) {
    throw new Error("You don't have permission to do that.")
  }
  return { supabase, profile }
}

function parseForm(formData: FormData) {
  const raw = Object.fromEntries(formData.entries())
  return productFormSchema.safeParse(raw)
}

// Custom spec fields are rendered dynamically (one <input name="spec_<id>">
// per admin-defined field), so they can't go through the static zod schema —
// pull them out of the raw form data against the current field list instead.
async function saveSpecValues(
  supabase: SupabaseClient<Database>,
  productId: string,
  formData: FormData,
) {
  const fields = await listSpecFields(supabase)
  if (fields.length === 0) return

  const values: Record<string, string> = {}
  for (const field of fields) {
    values[field.id] = String(formData.get(`spec_${field.id}`) || "")
  }
  await setSpecValuesForProduct(supabase, productId, values)
}

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const { supabase, profile } = await requireEditor()

  const parsed = parseForm(formData)
  if (!parsed.success) {
    return {
      error: "Check the fields below.",
      fieldErrors: flattenZodErrors(parsed.error),
    }
  }

  const slug = parsed.data.slug || slugify(parsed.data.name)
  if (await slugExists(supabase, slug)) {
    return {
      error: "That URL slug is already used by another product.",
      fieldErrors: { slug: "Already in use." },
    }
  }

  const product = await createProduct(
    supabase,
    { ...parsed.data, slug },
    profile.id,
  )
  await saveSpecValues(supabase, product.id, formData)

  revalidatePath("/admin/products")
  redirect(`/admin/products/${product.id}`)
}

export async function updateProductAction(
  productId: string,
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const { supabase, profile } = await requireEditor()

  const parsed = parseForm(formData)
  if (!parsed.success) {
    return {
      error: "Check the fields below.",
      fieldErrors: flattenZodErrors(parsed.error),
    }
  }

  const slug = parsed.data.slug || slugify(parsed.data.name)
  if (await slugExists(supabase, slug, productId)) {
    return {
      error: "That URL slug is already used by another product.",
      fieldErrors: { slug: "Already in use." },
    }
  }

  const updated = await updateProduct(supabase, productId, { ...parsed.data, slug }, profile.id)
  await saveSpecValues(supabase, productId, formData)

  revalidatePath("/admin/products")
  revalidatePath(`/admin/products/${productId}`)
  if (updated.status === "published") revalidatePublic(updated.slug)
  return { error: null }
}

export async function setProductStatusAction(
  productId: string,
  status: "draft" | "published",
) {
  const { supabase, profile } = await requireEditor()
  const updated = await setProductStatus(supabase, productId, status, profile.id)
  revalidatePath("/admin/products")
  revalidatePath(`/admin/products/${productId}`)
  // Revalidate on both publish and unpublish — either way the catalogue
  // (and the product's own page, which 404s once unpublished) has changed.
  revalidatePublic(updated.slug)
}

export async function deleteProductAction(productId: string) {
  const { supabase } = await requireEditor()

  const product = await getProductById(supabase, productId)

  // Clean up storage objects too — deleting the row alone would orphan files.
  const images = await listImagesForProduct(supabase, productId)
  for (const image of images) {
    await deleteProductImage(supabase, image)
  }

  await deleteProduct(supabase, productId)
  revalidatePath("/admin/products")
  if (product?.status === "published") revalidatePublic(product.slug)
  redirect("/admin/products")
}

export async function deleteProductImageAction(productId: string, imageId: string) {
  const { supabase } = await requireEditor()
  const images = await listImagesForProduct(supabase, productId)
  const image = images.find((i) => i.id === imageId)
  if (!image) return

  await deleteProductImage(supabase, image)

  // If we removed the primary image, promote the next one so the product
  // always has a primary image whenever it has any images at all.
  if (image.is_primary) {
    const remaining = await listImagesForProduct(supabase, productId)
    if (remaining.length > 0) {
      await setPrimaryImage(supabase, productId, remaining[0].id)
    }
  }

  revalidatePath(`/admin/products/${productId}`)
  const product = await getProductById(supabase, productId)
  if (product?.status === "published") revalidatePublic(product.slug)
}

export async function setPrimaryImageAction(productId: string, imageId: string) {
  const { supabase } = await requireEditor()
  await setPrimaryImage(supabase, productId, imageId)
  revalidatePath(`/admin/products/${productId}`)
  const product = await getProductById(supabase, productId)
  if (product?.status === "published") revalidatePublic(product.slug)
}

export async function reorderProductImagesAction(productId: string, orderedImageIds: string[]) {
  const { supabase } = await requireEditor()
  await reorderProductImages(supabase, productId, orderedImageIds)
  revalidatePath(`/admin/products/${productId}`)
  const product = await getProductById(supabase, productId)
  if (product?.status === "published") revalidatePublic(product.slug)
}

function flattenZodErrors(error: {
  flatten: () => { fieldErrors: Record<string, string[] | undefined> }
}): Record<string, string> {
  const flat = error.flatten().fieldErrors
  const result: Record<string, string> = {}
  for (const [key, messages] of Object.entries(flat)) {
    if (messages && messages.length > 0) result[key] = messages[0]
  }
  return result
}
