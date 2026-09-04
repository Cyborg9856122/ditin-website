import Link from "next/link"
import { createSupabaseServerClient } from "@/lib/data-access/supabase/server"
import { getCurrentProfile } from "@/lib/data-access/repositories/profile-repository"
import { listProducts } from "@/lib/data-access/repositories/product-repository"
import {
  PRODUCT_CATEGORY_LABELS,
  type ProductCategory,
  type ProductStatus,
} from "@/lib/domain/types"
import { permissions } from "@/lib/domain/auth/permissions"
import { deleteProductAction } from "./actions"
import { DeleteProductButton } from "./delete-button"

export const metadata = { title: "Products" }

export default async function ProductsPage(props: PageProps<"/admin/products">) {
  const searchParams = await props.searchParams
  const status = asOne(searchParams.status) as ProductStatus | undefined
  const category = asOne(searchParams.category) as ProductCategory | undefined

  const supabase = await createSupabaseServerClient()
  const [profile, products] = await Promise.all([
    getCurrentProfile(supabase),
    listProducts(supabase, { status, category }),
  ])
  if (!profile) return null

  const canEdit = permissions.canEditProducts(profile.role)
  const published = products.filter((p) => p.status === "published").length

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-brand-ink">Products</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {products.length} total · {published} published
          </p>
        </div>
        {canEdit ? (
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-brand-green px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:-translate-y-px hover:opacity-90 active:translate-y-0 active:opacity-100"
          >
            <span aria-hidden className="text-base leading-none">
              +
            </span>
            New product
          </Link>
        ) : null}
      </div>

      <form
        className="mt-6 flex flex-wrap items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3 text-sm"
        method="get"
      >
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-md border border-neutral-300 px-3 py-1.5 outline-none transition-colors duration-150 hover:border-neutral-400 focus:border-brand-green"
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <select
          name="category"
          defaultValue={category ?? ""}
          className="rounded-md border border-neutral-300 px-3 py-1.5 outline-none transition-colors duration-150 hover:border-neutral-400 focus:border-brand-green"
        >
          <option value="">All categories</option>
          {Object.entries(PRODUCT_CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-neutral-700 transition-all duration-150 hover:bg-neutral-100 active:scale-95"
        >
          Filter
        </button>
        {status || category ? (
          <Link
            href="/admin/products"
            className="text-neutral-500 underline underline-offset-2 transition-colors duration-150 hover:text-brand-ink active:opacity-70"
          >
            Clear
          </Link>
        ) : null}
      </form>

      <div className="mt-6 overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">Name</th>
              <th className="px-4 py-2.5 font-medium">Category</th>
              <th className="px-4 py-2.5 font-medium">Availability</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              {canEdit ? <th className="px-4 py-2.5" /> : null}
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={canEdit ? 5 : 4} className="px-4 py-12 text-center text-neutral-400">
                  <p>No products yet.</p>
                  {canEdit ? (
                    <Link
                      href="/admin/products/new"
                      className="mt-2 inline-block rounded px-1 py-0.5 text-sm font-medium text-brand-green transition-all duration-150 hover:underline active:scale-95"
                    >
                      Create your first one →
                    </Link>
                  ) : null}
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/60"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="font-medium text-brand-ink transition-colors duration-150 hover:text-brand-green"
                    >
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {PRODUCT_CATEGORY_LABELS[product.category]}
                  </td>
                  <td className="px-4 py-3 text-neutral-600 capitalize">
                    {product.availability}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={product.status} />
                  </td>
                  {canEdit ? (
                    <td className="px-4 py-3 text-right">
                      <DeleteProductButton
                        action={deleteProductAction.bind(null, product.id)}
                        productName={product.name}
                      />
                    </td>
                  ) : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: ProductStatus }) {
  const isPublished = status === "published"
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isPublished ? "bg-brand-green/10 text-brand-green" : "bg-neutral-100 text-neutral-600"
      }`}
    >
      {isPublished ? "Published" : "Draft"}
    </span>
  )
}

function asOne(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}
