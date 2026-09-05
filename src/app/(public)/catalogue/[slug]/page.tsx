import { notFound } from "next/navigation"
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
import { getSpecValuesForProduct } from "@/lib/data-access/repositories/product-spec-value-repository"
import {
  listSpecFieldOptionsForFields,
  listSpecFields,
} from "@/lib/data-access/repositories/spec-field-repository"
import {
  AVAILABILITY_LABELS,
  PLACEMENT_LABELS,
  PRODUCT_CATEGORY_LABELS,
} from "@/lib/domain/types"
import { InquiryForm } from "../../inquire/inquiry-form"
import { ProductGallery } from "@/components/product-gallery"
import { Reveal } from "@/components/reveal"
import { brand } from "@/lib/config/brand"

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

  const [images, specFields, specValues] = await Promise.all([
    listImagesForProduct(supabase, product.id),
    listSpecFields(supabase),
    getSpecValuesForProduct(supabase, product.id),
  ])
  const specFieldOptions = await listSpecFieldOptionsForFields(
    supabase,
    specFields.map((f) => f.id),
  )
  const galleryImages = images.map((image) => ({
    id: image.id,
    url: getPublicImageUrl(supabase, image.storage_path),
    alt: image.alt_text ?? product.name,
  }))

  const customSpecs = specFields
    .map((field) => {
      const raw = specValues.get(field.id)
      if (!raw) return null

      const options = specFieldOptions.get(field.id) ?? []
      let display: string

      if (field.field_type === "boolean") {
        display = raw === "true" ? "Yes" : "No"
      } else if (field.field_type === "dropdown") {
        const option = options.find((o) => o.id === raw)
        if (!option) return null
        display = option.label
      } else if (field.field_type === "multiselect") {
        const labels = raw
          .split(",")
          .map((id) => options.find((o) => o.id === id)?.label)
          .filter((label): label is string => Boolean(label))
        if (labels.length === 0) return null
        display = labels.join(", ")
      } else {
        display = field.unit ? `${raw} ${field.unit}` : raw
      }

      return { label: field.label, value: display }
    })
    .filter((s): s is { label: string; value: string } => s !== null)

  const specs = [
    { label: "Category", value: PRODUCT_CATEGORY_LABELS[product.category] },
    { label: "Placement", value: PLACEMENT_LABELS[product.placement] },
    { label: "Availability", value: AVAILABILITY_LABELS[product.availability] },
    ...customSpecs,
  ]

  return (
    <main>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <nav className="flex items-center gap-1.5 text-sm text-neutral-500">
          <Link
            href="/catalogue"
            className="transition-colors duration-150 hover:text-brand-green"
          >
            Catalogue
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-neutral-700">{product.name}</span>
        </nav>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Reveal>
            <ProductGallery images={galleryImages} />
          </Reveal>

          <Reveal delay={100}>
            <div>
              <p className="font-measured text-xs font-medium uppercase tracking-[0.2em] text-brand-green">
                {PRODUCT_CATEGORY_LABELS[product.category]}
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">
                {product.name}
              </h1>

              {product.typical_use_case ? (
                <p className="mt-3 leading-relaxed text-neutral-600">
                  {product.typical_use_case}
                </p>
              ) : null}

              {/* Spec sheet — dark, mono-value panel: reads like a real technical
                  data sheet rather than another set of light cards. */}
              <div className="relative mt-8 overflow-hidden rounded-xl bg-brand-ink p-5">
                <div className="bg-pixel-grid-faint absolute inset-0" />
                <p className="relative font-measured text-[11px] uppercase tracking-[0.2em] text-brand-green">
                  Specifications
                </p>
                <dl className="relative mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
                  {specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="border-t border-white/10 pt-2.5 [&:nth-child(-n+2)]:border-t-0"
                    >
                      <dt className="text-xs text-neutral-400">{spec.label}</dt>
                      <dd className="mt-0.5 font-measured text-sm text-white">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#inquire"
                  className="inline-block rounded-md bg-brand-green px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0 active:opacity-100"
                >
                  Ask about this
                </a>
                <a
                  href={`https://wa.me/${brand.contact.whatsappNumber}?text=${encodeURIComponent(
                    `Hi Ditin Displays! I'm interested in the ${product.name}. Could you share pricing and availability?`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-7 py-3.5 text-sm font-semibold text-brand-ink transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-green hover:text-brand-green active:translate-y-0"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.07L2 22l5.07-1.34A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2Zm5.2 14.2c-.22.62-1.28 1.2-1.77 1.24-.45.05-1.02.07-1.65-.1-.38-.11-.87-.28-1.5-.55-2.64-1.14-4.36-3.8-4.5-3.98-.13-.18-1.08-1.44-1.08-2.75s.68-1.94.93-2.2c.24-.27.53-.33.71-.33h.5c.16 0 .38-.03.58.45.22.53.75 1.83.81 1.96.07.13.11.28.02.46-.09.18-.14.28-.27.43-.13.16-.28.35-.4.47-.13.13-.27.28-.12.55.16.27.7 1.16 1.5 1.88 1.04.93 1.9 1.22 2.18 1.36.27.13.43.11.6-.07.16-.18.68-.79.86-1.06.18-.27.36-.22.6-.13.25.09 1.56.74 1.83.87.27.13.45.2.51.31.07.13.07.71-.15 1.34Z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <section className="border-t border-neutral-100 bg-neutral-50 px-6 py-16">
        <Reveal>
          <div id="inquire" className="mx-auto max-w-2xl scroll-mt-24">
            <p className="font-measured text-xs uppercase tracking-[0.25em] text-brand-green">
              Next step
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-brand-ink">Ask about this screen</h2>
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
          </div>
        </Reveal>
      </section>
    </main>
  )
}
