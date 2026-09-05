"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_LINKS = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/catalogue?placement=indoor", label: "Indoor" },
  { href: "/catalogue?placement=outdoor", label: "Outdoor" },
  { href: "/inquire", label: "Contact" },
]

// Active-state is path-only (no query-string matching) so this never
// needs useSearchParams — that would force the shared header out of
// static rendering for every page on the site just to bold "Indoor" vs
// "Outdoor". Both catalogue links light up together, which is an
// acceptable trade for keeping the rest of the site fully static.
export function SiteNavLinks() {
  const pathname = usePathname()

  return (
    <>
      {NAV_LINKS.map((link) => {
        const linkPath = link.href.split("?")[0]
        const active = pathname === linkPath

        return (
          <Link
            key={link.href}
            href={link.href}
            data-active={active}
            className="nav-link transition-colors duration-150 hover:text-brand-green active:opacity-70"
          >
            {link.label}
          </Link>
        )
      })}
    </>
  )
}
