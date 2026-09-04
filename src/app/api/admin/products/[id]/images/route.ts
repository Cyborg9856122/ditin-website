import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { createSupabaseServerClient } from "@/lib/data-access/supabase/server"
import { getCurrentProfile } from "@/lib/data-access/repositories/profile-repository"
import { getProductById } from "@/lib/data-access/repositories/product-repository"
import {
  listImagesForProduct,
  uploadProductImage,
} from "@/lib/data-access/repositories/product-image-repository"
import { permissions } from "@/lib/domain/auth/permissions"

// Dedicated Route Handler (rather than a Server Action) so the admin
// uploader can drive each upload via XMLHttpRequest and report real
// per-file progress — Server Actions don't expose upload progress events.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: productId } = await params

  const supabase = await createSupabaseServerClient()
  const profile = await getCurrentProfile(supabase)
  if (!profile || !permissions.canEditProducts(profile.role)) {
    return NextResponse.json(
      { error: "You don't have permission to do that." },
      { status: 403 },
    )
  }

  const product = await getProductById(supabase, productId)
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 })
  }

  const formData = await request.formData()
  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 })
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 })
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Images must be 8MB or smaller." }, { status: 400 })
  }

  try {
    const existing = await listImagesForProduct(supabase, productId)
    const image = await uploadProductImage(supabase, productId, file, {
      sortOrder: existing.length,
      isPrimary: existing.length === 0,
    })

    revalidatePath(`/admin/products/${productId}`)
    if (product.status === "published") {
      revalidatePath("/catalogue")
      revalidatePath(`/catalogue/${product.slug}`)
    }

    return NextResponse.json({ image })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
