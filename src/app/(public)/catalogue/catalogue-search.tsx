"use client"

import { useRef } from "react"

// Debounced auto-submit: types into the existing GET filter form and
// resubmits it ~450ms after the user stops typing, so results update
// without needing a separate "Search" button or client-side data fetching.
export function CatalogueSearch({ defaultValue }: { defaultValue?: string }) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  return (
    <input
      type="search"
      name="q"
      defaultValue={defaultValue}
      placeholder="Search by name…"
      className="min-w-[10rem] flex-1 rounded-md border border-neutral-300 bg-white px-3 py-1.5 outline-none transition-colors duration-150 hover:border-neutral-400 focus:border-brand-green"
      onChange={(e) => {
        if (timer.current) clearTimeout(timer.current)
        const form = e.currentTarget.form
        timer.current = setTimeout(() => form?.requestSubmit(), 450)
      }}
    />
  )
}
