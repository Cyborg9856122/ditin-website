import Link from "next/link"
import { PRODUCT_CATEGORY_LABELS, type ProductCategory } from "@/lib/domain/types"

const CATEGORY_BLURBS: Record<ProductCategory, string> = {
  led_wall: "Modular, seamless, built for stages and storefronts.",
  lcd_video_wall: "Tiled panels for control rooms and retail walls.",
  commercial_display: "Everyday screens for menus, lobbies and signage.",
  interactive_touch: "Touch-driven screens for kiosks and showrooms.",
  outdoor_weatherproof: "High-brightness, sealed against the elements.",
}

export default function HomePage() {
  return (
    <main>
      <section className="bg-brand-ink px-6 py-24 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <p className="font-measured text-xs uppercase tracking-[0.3em] text-brand-green">
            Ditin Displays
          </p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
            Every screen we sell and rent, in one place —
            <span className="text-brand-green"> browse it yourself.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-neutral-300">
            No more waiting on a one-off proposal for a single screen. Filter by
            category, indoor or outdoor, rent or buy, and see specs up front.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/catalogue"
              className="rounded-md bg-brand-green px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Browse the catalogue
            </Link>
            <Link
              href="/inquire"
              className="rounded-md border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Get a quote
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-2xl font-semibold text-brand-ink">
          Rent for an event. Buy for the long run.
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-neutral-200 p-6">
            <p className="font-measured text-xs uppercase tracking-wide text-brand-green">
              Rent
            </p>
            <h3 className="mt-2 text-lg font-semibold text-brand-ink">
              Short-term, fully set up
            </h3>
            <p className="mt-2 text-sm text-neutral-600">
              Weddings, conferences, activations and pop-ups — tell us the dates
              and the space, we handle the rest.
            </p>
            <Link
              href="/catalogue?availability=rent"
              className="mt-4 inline-block text-sm font-medium text-brand-green hover:underline"
            >
              See rentable screens →
            </Link>
          </div>
          <div className="rounded-lg border border-neutral-200 p-6">
            <p className="font-measured text-xs uppercase tracking-wide text-brand-green">
              Buy
            </p>
            <h3 className="mt-2 text-lg font-semibold text-brand-ink">
              Permanent installs
            </h3>
            <p className="mt-2 text-sm text-neutral-600">
              Storefronts, lobbies, control rooms and stages built to run every
              day, for years.
            </p>
            <Link
              href="/catalogue?availability=buy"
              className="mt-4 inline-block text-sm font-medium text-brand-green hover:underline"
            >
              See screens to buy →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-semibold text-brand-ink">
            Every category
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.entries(PRODUCT_CATEGORY_LABELS) as [ProductCategory, string][]).map(
              ([value, label]) => (
                <Link
                  key={value}
                  href={`/catalogue?category=${value}`}
                  className="group rounded-lg border border-neutral-200 bg-white p-6 transition hover:border-brand-green"
                >
                  <h3 className="text-lg font-semibold text-brand-ink group-hover:text-brand-green">
                    {label}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-600">{CATEGORY_BLURBS[value]}</p>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold text-brand-ink">
          Don&apos;t see exactly what you need?
        </h2>
        <p className="mt-2 text-neutral-600">
          Tell us the space, the budget, and whether it&apos;s indoor or outdoor —
          we&apos;ll match it to something in range.
        </p>
        <Link
          href="/inquire"
          className="mt-6 inline-block rounded-md bg-brand-green px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Send an inquiry
        </Link>
      </section>
    </main>
  )
}
