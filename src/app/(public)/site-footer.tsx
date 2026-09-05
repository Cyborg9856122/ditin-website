import Image from "next/image"
import Link from "next/link"
import { brand } from "@/lib/config/brand"
import { PRODUCT_CATEGORY_LABELS } from "@/lib/domain/types"

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-brand-green bg-brand-ink text-neutral-300">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-5">
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
                    className="transition-colors duration-150 hover:text-white active:opacity-70"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Company
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="transition-colors duration-150 hover:text-white active:opacity-70"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="transition-colors duration-150 hover:text-white active:opacity-70"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/inquire"
                  className="transition-colors duration-150 hover:text-white active:opacity-70"
                >
                  Get a quote
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Get in touch
            </p>
            <ul className="mt-3 flex flex-col gap-2.5 text-sm">
              <li>
                <a
                  href={`https://wa.me/${brand.contact.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-measured inline-flex items-center gap-2 transition-colors duration-150 hover:text-white active:opacity-70"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 shrink-0">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.07L2 22l5.07-1.34A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2Zm5.2 14.2c-.22.62-1.28 1.2-1.77 1.24-.45.05-1.02.07-1.65-.1-.38-.11-.87-.28-1.5-.55-2.64-1.14-4.36-3.8-4.5-3.98-.13-.18-1.08-1.44-1.08-2.75s.68-1.94.93-2.2c.24-.27.53-.33.71-.33h.5c.16 0 .38-.03.58.45.22.53.75 1.83.81 1.96.07.13.11.28.02.46-.09.18-.14.28-.27.43-.13.16-.28.35-.4.47-.13.13-.27.28-.12.55.16.27.7 1.16 1.5 1.88 1.04.93 1.9 1.22 2.18 1.36.27.13.43.11.6-.07.16-.18.68-.79.86-1.06.18-.27.36-.22.6-.13.25.09 1.56.74 1.83.87.27.13.45.2.51.31.07.13.07.71-.15 1.34Z" />
                  </svg>
                  {brand.contact.whatsappDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${brand.contact.phone.replace(/\s+/g, "")}`}
                  className="font-measured inline-flex items-center gap-2 transition-colors duration-150 hover:text-white active:opacity-70"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 shrink-0">
                    <path
                      d="M4.5 5.5c0-.55.45-1 1-1h2.2c.46 0 .86.32.97.77l.8 3.2a1 1 0 0 1-.27.96l-1.4 1.4a12.7 12.7 0 0 0 5.87 5.87l1.4-1.4a1 1 0 0 1 .96-.27l3.2.8c.45.11.77.51.77.97v2.2c0 .55-.45 1-1 1h-1.5C9.8 20 4 14.2 4 7V5.5Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {brand.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${brand.contact.email}`}
                  className="inline-flex items-center gap-2 transition-colors duration-150 hover:text-white active:opacity-70"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 shrink-0">
                    <rect x="2.5" y="4.5" width="19" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
                    <path d="m3.5 6 8.5 6.5L20.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {brand.contact.email}
                </a>
              </li>
              <li className="pt-1">
                <Link
                  href="/inquire"
                  className="inline-flex items-center gap-1 font-medium text-white transition hover:text-brand-green"
                >
                  Send an inquiry →
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
