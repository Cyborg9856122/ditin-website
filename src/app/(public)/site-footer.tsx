import Image from "next/image"
import Link from "next/link"
import { brand } from "@/lib/config/brand"
import { PRODUCT_CATEGORY_LABELS } from "@/lib/domain/types"

export function SiteFooter() {
  return (
    <footer className="bg-brand-ink text-neutral-300">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <Image
              src="/brand/ditin-displays-white.png"
              alt={brand.logo.fullName}
              width={180}
              height={77}
              className="h-12 w-auto"
            />
            <p className="mt-4 max-w-sm text-sm text-neutral-400">
              Display solution selling and renting — browse the catalogue instead of
              waiting on a proposal for every item.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Catalogue
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              {Object.entries(PRODUCT_CATEGORY_LABELS).map(([value, label]) => (
                <li key={value}>
                  <Link
                    href={`/catalogue?category=${value}`}
                    className="transition hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Get in touch
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              <li>
                <a
                  href={`https://wa.me/${brand.contact.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-measured transition hover:text-white"
                >
                  WhatsApp: {brand.contact.whatsappDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${brand.contact.email}`} className="transition hover:text-white">
                  {brand.contact.email}
                </a>
              </li>
              <li>
                <Link href="/inquire" className="transition hover:text-white">
                  Send an inquiry
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-neutral-500 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {brand.logo.fullName}. All rights reserved.
          </p>
          <p className="font-measured italic text-neutral-400">{brand.logo.tagline}</p>
        </div>
      </div>
    </footer>
  )
}
