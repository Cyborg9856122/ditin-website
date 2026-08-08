import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createSupabaseServerClient } from "@/lib/data-access/supabase/server"
import { createSupabasePublicClient } from "@/lib/data-access/supabase/public"
import {
  getPublishedProductBySlug,
  listProducts,
} from "@/lib/data-access/repositories/product-repository"
import {
  getPublicImageUrl,
  listImagesForProduct,
} from "@/lib/data-access/repositories/product-image-repository"
import {
  AVAILABILITY_LABELS,
  PLACEMENT_LABELS,
  PRODUCT_CATEGORY_LABELS,
} from "@/lib/domain/types"
import { InquiryForm } from "../../inquire/inquiry-form"
import { PixelPlaceholder } from "@/components/pixel-placeholder"

export const revalidate = 3600

export async function generateStaticParams() {
  // No HTTP request exists at build time, so this can't use the
  // cookie-reading server client — use the plain anon client instead.
  const supabase = createSupabasePublicClient()
  const products = await listProducts(supabase, { status: "published" })
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata(props: PageProps<"/catalogue/[slug]">) {
  const { slug } = await props.params
  const supabase = await createSupabaseServerClient()
  const product = await getPublishedProductBySlug(supabase, slug)
  if (!product) return {}
  return {
    title: product.name,
    description:
      product.typical_use_case ||
      `${PRODUCT_CATEGORY_LABELS[product.category]} — ${AVAILABILITY_LABELS[product.availability]}.`,
  }
}

export default async function ProductDetailPage(props: PageProps<"/catalogue/[slug]">) {
  const { slug } = await props.params

  const supabase = await createSupabaseServerClient()
  const product = await getPublishedProductBySlug(supabase, slug)
  if (!product) notFound()

  const images = await listImagesForProduct(supabase, product.id)

  const specs = [
    { label: "Category", value: PRODUCT_CATEGORY_LABELS[product.category] },
    { label: "Placement", value: PLACEMENT_LABELS[product.placement] },
    { label: "Availability", value: AVAILABILITY_LABELS[product.availability] },
    product.pixel_pitch_mm ? { label: "Pixel pitch", value: `${product.pixel_pitch_mm} mm` } : null,
    product.panel_size ? { label: "Panel size", value: product.panel_size } : null,
    product.brightness_nits ? { label: "Brightness", value: `${product.brightness_nits} nits` } : null,
    product.resolution ? { label: "Resolution", value: product.resolution } : null,
  ].filter((s): s is { label: string; value: string } => s !== null)

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <nav className="text-sm text-neutral-500">
        <Link href="/catalogue" className="hover:text-brand-green">
          Catalogue
        </Link>{" "}
        / <span className="text-neutral-700">{product.name}</span>
      </nav>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-neutral-100">
            {images[0] ? (
              <Image
                src={getPublicImageUrl(supabase, images[0].storage_path)}
                alt={images[0].alt_text ?? product.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
                className="object-cover"
              />
            ) : (
              <PixelPlaceholder />
            )}
          </div>
          {images.length > 1 ? (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {images.slice(1).map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-square overflow-hidden rounded-md bg-neutral-100"
                >
                  <Image
                    src={getPublicImageUrl(supabase, image.storage_path)}
                    alt={image.alt_text ?? product.name}
                    fill
                    sizes="150px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-brand-green">
            {PRODUCT_CATEGORY_LABELS[product.category]}
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-brand-ink">{product.name}</h1>

          {product.typical_use_case ? (
            <p className="mt-3 text-neutral-600">{product.typical_use_case}</p>
          ) : null}

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-neutral-200 pt-6 text-sm">
            {specs.map((spec) => (
              <div key={spec.label}>
                <dt className="text-neutral-500">{spec.label}</dt>
                <dd className="mt-0.5 font-measured text-brand-ink">{spec.value}</dd>
              </div>
            ))}
          </dl>

          <a
            href="#inquire"
            className="mt-8 inline-block rounded-md bg-brand-green px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Ask about this
          </a>
        </div>
      </div>

      <section id="inquire" className="mx-auto mt-16 max-w-2xl scroll-mt-20 border-t border-neutral-200 pt-10">
        <h2 className="text-2xl font-semibold text-brand-ink">Ask about this screen</h2>
        <p className="mt-2 text-neutral-600">
          We&apos;ll follow up with pricing and availability.
        </p>
        <div className="mt-6">
          <InquiryForm
            productId={product.id}
            productName={product.name}
            defaultScreenType={product.category}
            defaultPlacement={product.placement}
          />
        </div>
      </section>
    </main>
  )
}
