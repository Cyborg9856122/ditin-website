"use client"

import { useState } from "react"
import Link from "next/link"

const NAV_LINKS = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/#categories", label: "Categories" },
  { href: "/#about", label: "About" },
  { href: "/#faq", label: "FAQ" },
  { href: "/inquire", label: "Contact" },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        title={open ? "Close menu" : "Open menu"}
        className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-150 hover:bg-neutral-100 active:scale-95"
      >
        <span
          className={`absolute h-0.5 w-5 rounded-full bg-brand-ink transition duration-300 ${
            open ? "rotate-45" : "-translate-y-1.5"
          }`}
        />
        <span
          className={`absolute h-0.5 w-5 rounded-full bg-brand-ink transition duration-300 ${
            open ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`absolute h-0.5 w-5 rounded-full bg-brand-ink transition duration-300 ${
            open ? "-rotate-45" : "translate-y-1.5"
          }`}
        />
      </button>

      <div
        className={`fixed inset-x-0 top-[57px] z-30 origin-top border-b border-neutral-200 bg-white shadow-lg transition-all duration-300 ${
          open ? "scale-y-100 opacity-100" : "pointer-events-none scale-y-95 opacity-0"
        }`}
      >
        <nav className="flex flex-col divide-y divide-neutral-100 px-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-4 text-sm font-medium text-brand-ink transition-colors duration-150 hover:text-brand-green active:opacity-70"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
