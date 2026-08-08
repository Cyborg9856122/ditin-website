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

  const filterCount = [category, placement, availability].filter(Boolean).length

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <p className="font-measured text-xs uppercase tracking-[0.25em] text-brand-green">
        Catalogue
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-brand-ink sm:text-4xl">
        Every screen, sold or rented
      </h1>
      <p className="mt-2 max-w-xl text-neutral-600">
        Filter below, or ask us if you don&apos;t see the exact fit.
      </p>

      <form
        className="mt-8 flex flex-wrap items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm"
        method="get"
      >
        <select
          name="category"
          defaultValue={category ?? ""}
          className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 outline-none focus:border-brand-green"
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
          className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 outline-none focus:border-brand-green"
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
          className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 outline-none focus:border-brand-green"
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
          className="rounded-md bg-brand-green px-4 py-1.5 font-semibold text-white transition hover:opacity-90"
        >
          Filter
        </button>
        {filterCount > 0 ? (
          <Link href="/catalogue" className="text-neutral-500 underline underline-offset-2">
            Clear filters
          </Link>
        ) : null}
      </form>

      <p className="mt-5 text-xs uppercase tracking-wide text-neutral-400">
        {products.length} {products.length === 1 ? "screen" : "screens"}
        {filterCount > 0 ? " matching" : " available"}
      </p>

      {products.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-neutral-300 p-16 text-center">
          <p className="text-sm font-medium text-neutral-600">
            Nothing published matches those filters yet.
          </p>
          <Link
            href="/inquire"
            className="mt-3 inline-block text-sm font-medium text-brand-green hover:underline"
          >
            Ask us directly instead →
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => {
            const image = imagesByProduct.get(product.id)
            return (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${Math.min(i, 6) * 0.06}s` }}
              >
                <ProductCard
                  product={product}
                  imageUrl={image ? getPublicImageUrl(supabase, image.storage_path) : null}
                />
              </div>
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
