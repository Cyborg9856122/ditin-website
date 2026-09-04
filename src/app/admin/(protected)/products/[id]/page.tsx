import { notFound } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/data-access/supabase/server"
import { getCurrentProfile } from "@/lib/data-access/repositories/profile-repository"
import { getProductById } from "@/lib/data-access/repositories/product-repository"
import {
  getPublicImageUrl,
  listImagesForProduct,
} from "@/lib/data-access/repositories/product-image-repository"
import { getSpecValuesForProduct } from "@/lib/data-access/repositories/product-spec-value-repository"
import { listSpecFields } from "@/lib/data-access/repositories/spec-field-repository"
import { permissions } from "@/lib/domain/auth/permissions"
import { ProductForm } from "../product-form"
import { PhotoManager } from "./photo-manager"
import { deleteProductAction, setProductStatusAction, updateProductAction } from "../actions"

export const metadata = { title: "Edit product" }

export default async function EditProductPage(props: PageProps<"/admin/products/[id]">) {
  const { id } = await props.params

  const supabase = await createSupabaseServerClient()
  const [profile, product] = await Promise.all([
    getCurrentProfile(supabase),
    getProductById(supabase, id),
  ])
  if (!profile || !product) notFound()

  const canEdit = permissions.canEditProducts(profile.role)
  const [images, specFields, specValues] = await Promise.all([
    listImagesForProduct(supabase, id),
    listSpecFields(supabase),
    getSpecValuesForProduct(supabase, id),
  ])

  const boundUpdate = updateProductAction.bind(null, id)
  const publish = setProductStatusAction.bind(null, id, "published")
  const unpublish = setProductStatusAction.bind(null, id, "draft")
  const remove = deleteProductAction.bind(null, id)
  const photoManagerImages = images.map((image) => ({
    id: image.id,
    url: getPublicImageUrl(supabase, image.storage_path),
    alt: image.alt_text ?? product.name,
    isPrimary: image.is_primary,
  }))

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-brand-ink">{product.name}</h1>
          <p className="mt-1 font-measured text-xs text-neutral-500">/{product.slug}</p>
        </div>

        {canEdit ? (
          <div className="flex gap-2">
            {product.status === "published" ? (
              <form action={unpublish}>
                <button
                  type="submit"
                  className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
                >
                  Unpublish
                </button>
              </form>
            ) : (
              <form action={publish}>
                <button
                  type="submit"
                  disabled={images.length === 0}
                  title={images.length === 0 ? "Add at least one photo before publishing" : undefined}
                  className="rounded-md bg-brand-green px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Publish
                </button>
              </form>
            )}
            <form action={remove}>
              <button
                type="submit"
                className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </form>
          </div>
        ) : null}
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Photos
        </h2>
        <p className="mt-1 text-xs text-neutral-500">
          Drag photos to reorder them. The first photo is used as the catalogue thumbnail
          unless you set a different one as Primary.
        </p>

        <div className="mt-3">
          <PhotoManager productId={id} images={photoManagerImages} canEdit={canEdit} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Details
        </h2>
        <div className="mt-3">
          {canEdit ? (
            <ProductForm
              product={product}
              specFields={specFields}
              specValues={specValues}
              action={boundUpdate}
            />
          ) : (
            <p className="text-sm text-neutral-500">
              You have read-only access. Ask an Owner or Editor to make changes.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
