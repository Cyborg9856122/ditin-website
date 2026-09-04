import Image from "next/image"
import Link from "next/link"
import {
  AVAILABILITY_LABELS,
  PLACEMENT_LABELS,
  PRODUCT_CATEGORY_LABELS,
  type Product,
} from "@/lib/domain/types"
import { PixelPlaceholder } from "@/components/pixel-placeholder"

export function ProductCard({
  product,
  imageUrl,
}: {
  product: Product
  imageUrl: string | null
}) {
  return (
    <Link
      href={`/catalogue/${product.slug}`}
      className="group overflow-hidden rounded-lg border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-green hover:shadow-lg hover:shadow-brand-green/10 active:translate-y-0 active:shadow-md"
    >
      <div className="relative aspect-[4/3] bg-neutral-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
            className="object-contain p-4 transition duration-300 group-hover:scale-105"
          />
        ) : (
          <PixelPlaceholder />
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-green">
          {PRODUCT_CATEGORY_LABELS[product.category]}
        </p>
        <h3 className="mt-1 font-semibold text-brand-ink group-hover:text-brand-green">
          {product.name}
        </h3>
        <p className="mt-1 font-measured text-xs text-neutral-500">
          {PLACEMENT_LABELS[product.placement]} · {AVAILABILITY_LABELS[product.availability]}
        </p>
      </div>
    </Link>
  )
}
