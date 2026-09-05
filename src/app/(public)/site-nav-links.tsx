"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

// Catalogue and Contact are real pages; the rest are anchor links into
// homepage sections (see id="categories" / "about" / "faq" on the
// homepage sections). Clicking one from another page navigates home and
// scrolls to the section — Next.js handles that automatically.
const NAV_LINKS = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/#categories", label: "Categories" },
  { href: "/#about", label: "About" },
  { href: "/#faq", label: "FAQ" },
  { href: "/inquire", label: "Contact" },
]

export function SiteNavLinks() {
  const pathname = usePathname()

  return (
    <>
      {NAV_LINKS.map((link) => {
        // Only page links (no "#") get a persistent active state — anchor
        // links just get the hover underline, since knowing which
        // section is currently scrolled into view would need extra JS.
        const active = !link.href.includes("#") && pathname === link.href

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
