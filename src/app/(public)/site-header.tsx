import Image from "next/image"
import Link from "next/link"
import { brand } from "@/lib/config/brand"

const NAV_LINKS = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/catalogue?availability=rent", label: "Rent" },
  { href: "/catalogue?availability=buy", label: "Buy" },
  { href: "/inquire", label: "Contact" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center" aria-label={`${brand.logo.fullName} home`}>
          {/* Brand kit minimum framed-lockup height is 56px. */}
          <Image
            src="/brand/ditin-displays-primary.png"
            alt={brand.logo.fullName}
            width={220}
            height={94}
            priority
            className="h-14 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-brand-ink sm:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-brand-green">
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/inquire"
          className="rounded-md bg-brand-green px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Get a quote
        </Link>
      </div>
    </header>
  )
}
