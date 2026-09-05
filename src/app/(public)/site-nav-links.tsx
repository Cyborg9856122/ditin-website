"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_LINKS = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/inquire", label: "Contact" },
]

export function SiteNavLinks() {
  const pathname = usePathname()

  return (
    <>
      {NAV_LINKS.map((link) => {
        const active = pathname === link.href

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
