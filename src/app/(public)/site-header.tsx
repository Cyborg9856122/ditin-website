import Image from "next/image"
import Link from "next/link"
import { brand } from "@/lib/config/brand"
import { MobileNav } from "@/components/mobile-nav"
import { SiteNavLinks } from "./site-nav-links"

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
            className="h-11 w-auto sm:h-14"
          />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-brand-ink sm:flex">
          <SiteNavLinks />
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/inquire"
            className="rounded-md bg-brand-green px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:-translate-y-px hover:opacity-90 active:translate-y-0 active:opacity-100 sm:px-4 sm:text-sm"
          >
            Get a quote
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
