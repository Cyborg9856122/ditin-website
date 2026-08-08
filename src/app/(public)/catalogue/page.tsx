import Link from "next/link"
import { createSupabaseServerClient } from "@/lib/data-access/supabase/server"
import { listProducts } from "@/lib/data-access/repositories/product-repository"
import {
  getPublicImageUrl,
  listPrimaryImagesForProducts,
} from "@/lib/data-access/repositories/product-image-repository"
import {
  AVAILABILITY_LABELS,
  PLACEMENT_LABELS,
  PRODUCT_CATEGORY_LABELS,
  type Availability,
  type Placement,
  type ProductCategory,
} from "@/lib/domain/types"
import { ProductCard } from "./product-card"

export const metadata = { title: "Catalogue" }
export const revalidate = 3600

export default async function CataloguePage(props: PageProps<"/catalogue">) {
  const searchParams = await props.searchParams
  const category = asOne(searchParams.category) as ProductCategory | undefined
  const placement = asOne(searchParams.placement) as Placement | undefined
  const availability = asOne(searchParams.availability) as Availability | undefined

  const supabase = await createSupabaseServerClient()
  const products = await listProducts(supabase, {
    status: "published",
    category,
    placement,
    availability,
  })

  const imagesByProduct = await listPrimaryImagesForProducts(
    supabase,
    products.map((p) => p.id),
  )

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold text-brand-ink">Catalogue</h1>
      <p className="mt-2 text-neutral-600">
        Every screen we sell and rent. Filter below, or ask us if you don&apos;t see
        the exact fit.
      </p>

      <form className="mt-6 flex flex-wrap gap-3 text-sm" method="get">
        <select
          name="category"
          defaultValue={category ?? ""}
          className="rounded-md border border-neutral-300 px-3 py-1.5"
        >
          <option value="">All categories</option>
          {Object.entries(PRODUCT_CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          name="placement"
          defaultValue={placement ?? ""}
          className="rounded-md border border-neutral-300 px-3 py-1.5"
        >
          <option value="">Indoor or outdoor</option>
          {Object.entries(PLACEMENT_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          name="availability"
          defaultValue={availability ?? ""}
          className="rounded-md border border-neutral-300 px-3 py-1.5"
        >
          <option value="">Rent or buy</option>
          {Object.entries(AVAILABILITY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md bg-brand-green px-4 py-1.5 font-semibold text-white hover:opacity-90"
        >
          Filter
        </button>
        {category || placement || availability ? (
          <Link href="/catalogue" className="self-center text-neutral-500 underline">
            Clear
          </Link>
        ) : null}
      </form>

      {products.length === 0 ? (
        <div className="mt-16 rounded-lg border border-dashed border-neutral-300 p-12 text-center text-neutral-500">
          <p>Nothing published matches those filters yet.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const image = imagesByProduct.get(product.id)
            return (
              <ProductCard
                key={product.id}
                product={product}
                imageUrl={image ? getPublicImageUrl(supabase, image.storage_path) : null}
              />
            )
          })}
        </div>
      )}
    </main>
  )
}

function asOne(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}
