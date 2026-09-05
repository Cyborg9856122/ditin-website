import Link from "next/link"
import { createSupabaseServerClient } from "@/lib/data-access/supabase/server"
import { listProducts } from "@/lib/data-access/repositories/product-repository"
import {
  getPublicImageUrl,
  listPrimaryImagesForProducts,
} from "@/lib/data-access/repositories/product-image-repository"
import {
  PLACEMENT_LABELS,
  PRODUCT_CATEGORY_LABELS,
  type Placement,
  type ProductCategory,
} from "@/lib/domain/types"
import { ProductCard } from "./product-card"
import { CatalogueSearch } from "./catalogue-search"
import { Reveal } from "@/components/reveal"

export const metadata = { title: "Catalogue" }
export const revalidate = 3600

export default async function CataloguePage(props: PageProps<"/catalogue">) {
  const searchParams = await props.searchParams
  const category = asOne(searchParams.category) as ProductCategory | undefined
  const placement = asOne(searchParams.placement) as Placement | undefined
  const search = asOne(searchParams.q)

  const supabase = await createSupabaseServerClient()
  const products = await listProducts(supabase, {
    status: "published",
    category,
    placement,
    search,
  })

  const imagesByProduct = await listPrimaryImagesForProducts(
    supabase,
    products.map((p) => p.id),
  )

  const filterCount = [category, placement, search].filter(Boolean).length

  return (
    <main>
      <section className="relative overflow-hidden bg-brand-ink px-6 py-16 text-center sm:text-left">
        <div className="bg-pixel-grid-faint absolute inset-0" />
        <div
          aria-hidden
          className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-green/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl">
          <p className="font-measured text-xs uppercase tracking-[0.25em] text-brand-green">
            Catalogue
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
            Every screen, sold or rented
          </h1>
          <p className="mt-2 max-w-xl text-neutral-400 sm:mx-0">
            Filter below, or ask us if you don&apos;t see the exact fit.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-16">
        <form
          className="relative z-10 -mt-8 flex flex-wrap items-center gap-3 rounded-lg border border-neutral-200 bg-white p-4 text-sm shadow-xl shadow-black/5"
          method="get"
        >
          <CatalogueSearch defaultValue={search} />
          <select
            name="category"
            defaultValue={category ?? ""}
            className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 outline-none transition-colors duration-150 hover:border-neutral-400 focus:border-brand-green"
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
            aria-label="Usage"
            defaultValue={placement ?? ""}
            className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 outline-none transition-colors duration-150 hover:border-neutral-400 focus:border-brand-green"
          >
            <option value="">Usage</option>
            {Object.entries(PLACEMENT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-md bg-brand-green px-4 py-1.5 font-semibold text-white shadow-sm transition-all duration-150 hover:-translate-y-px hover:opacity-90 active:translate-y-0 active:opacity-100"
          >
            Filter
          </button>
          {filterCount > 0 ? (
            <Link
              href="/catalogue"
              className="text-neutral-500 underline underline-offset-2 transition-colors duration-150 hover:text-brand-ink active:opacity-70"
            >
              Clear filters
            </Link>
          ) : null}
        </form>

        <p className="mt-6 text-xs uppercase tracking-wide text-neutral-400">
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
              className="mt-3 inline-block rounded px-1 py-0.5 text-sm font-medium text-brand-green transition-all duration-150 hover:underline active:scale-95"
            >
              Ask us directly instead →
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, i) => {
              const image = imagesByProduct.get(product.id)
              return (
                <Reveal key={product.id} delay={Math.min(i, 8) * 50}>
                  <ProductCard
                    product={product}
                    imageUrl={image ? getPublicImageUrl(supabase, image.storage_path) : null}
                  />
                </Reveal>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

function asOne(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}
