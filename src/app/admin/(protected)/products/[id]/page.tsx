import { notFound } from "next/navigation"
import Image from "next/image"
import { createSupabaseServerClient } from "@/lib/data-access/supabase/server"
import { getCurrentProfile } from "@/lib/data-access/repositories/profile-repository"
import { getProductById } from "@/lib/data-access/repositories/product-repository"
import {
  getPublicImageUrl,
  listImagesForProduct,
} from "@/lib/data-access/repositories/product-image-repository"
import { permissions } from "@/lib/domain/auth/permissions"
import { ProductForm } from "../product-form"
import {
  deleteProductAction,
  deleteProductImageAction,
  setPrimaryImageAction,
  setProductStatusAction,
  updateProductAction,
  uploadProductImageAction,
} from "../actions"

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
  const images = await listImagesForProduct(supabase, id)

  const boundUpdate = updateProductAction.bind(null, id)
  const publish = setProductStatusAction.bind(null, id, "published")
  const unpublish = setProductStatusAction.bind(null, id, "draft")
  const remove = deleteProductAction.bind(null, id)
  const upload = uploadProductImageAction.bind(null, id)

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

        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-md border border-neutral-200 bg-neutral-100"
            >
              <Image
                src={getPublicImageUrl(supabase, image.storage_path)}
                alt={image.alt_text ?? product.name}
                fill
                sizes="200px"
                className="object-cover"
              />
              {image.is_primary ? (
                <span className="absolute left-1 top-1 rounded bg-brand-green px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  Primary
                </span>
              ) : null}
              {canEdit ? (
                <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-black/50 p-1 opacity-0 transition group-hover:opacity-100">
                  {!image.is_primary ? (
                    <form action={setPrimaryImageAction.bind(null, id, image.id)}>
                      <button type="submit" className="text-[10px] text-white underline">
                        Make primary
                      </button>
                    </form>
                  ) : (
                    <span />
                  )}
                  <form action={deleteProductImageAction.bind(null, id, image.id)}>
                    <button type="submit" className="text-[10px] text-white underline">
                      Delete
                    </button>
                  </form>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {canEdit ? (
          <form action={upload} className="mt-4 flex items-center gap-3">
            <input
              type="file"
              name="file"
              accept="image/*"
              required
              className="text-sm text-neutral-600"
            />
            <button
              type="submit"
              className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
            >
              Upload photo
            </button>
          </form>
        ) : null}
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Details
        </h2>
        <div className="mt-3">
          {canEdit ? (
            <ProductForm product={product} action={boundUpdate} />
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
