import Link from "next/link"
import { Reveal } from "@/components/reveal"

export const metadata = { title: "About" }

const APPROACH = [
  {
    title: "Specs before conversations",
    body: "Every screen in the catalogue lists its pixel pitch, brightness, size, and category up front, so you can shortlist options yourself before reaching out — not after a back-and-forth.",
  },
  {
    title: "Rent or buy, your call",
    body: "Short-term events and permanent installs draw from the same catalogue. Tell us which one you need and we'll follow up with pricing that matches — a quote for your dates, or a quote to own it.",
  },
  {
    title: "Indoor and outdoor, covered",
    body: "From lobby and retail displays to weatherproof screens built for facades and forecourts, placement is filtered right alongside category — so what you see is already suited to where it's going.",
  },
]

const CATEGORIES = [
  { label: "LED walls", blurb: "Modular, seamless, built for stages and storefronts." },
  { label: "LCD video walls", blurb: "Tiled panels for control rooms and retail walls." },
  { label: "Commercial displays", blurb: "Everyday screens for menus, lobbies and signage." },
  { label: "Interactive & touch screens", blurb: "Touch-driven screens for kiosks and showrooms." },
  { label: "Outdoor & weatherproof displays", blurb: "High-brightness, sealed against the elements." },
]

export default function AboutPage() {
  return (
    <main>
      {/* ---- Intro (dark) ---- */}
      <section className="bg-diagonal-lines-faint relative overflow-hidden bg-surface-dark-2 px-6 py-20 text-center sm:text-left">
        <div className="relative mx-auto max-w-3xl sm:mx-0">
          <p className="font-measured text-xs uppercase tracking-[0.25em] text-brand-green">
            About Ditin Displays
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Built to make buying or renting a screen straightforward
          </h1>
          <p className="mt-4 max-w-xl leading-relaxed text-neutral-400 sm:mx-0">
            We sell and rent LED and display solutions across Iraq — indoor and
            outdoor, short-term and permanent — and put specs up front so you can
            browse it yourself instead of waiting on a one-off proposal for every
            screen.
          </p>
        </div>
      </section>

      {/* ---- What we do (light) ---- */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <Reveal>
          <p className="font-measured text-xs uppercase tracking-[0.25em] text-brand-green">
            What we do
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-brand-ink sm:text-3xl">
            One catalogue, sold or rented
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-neutral-600">
            Ditin Displays covers five categories of screen — LED walls, LCD video
            walls, commercial displays, interactive touch screens, and outdoor
            weatherproof displays. Every listing is filterable by category,
            placement, and whether you&apos;re renting or buying, with real
            specifications attached rather than a placeholder spec sheet.
          </p>
        </Reveal>
      </section>

      {/* ---- Approach (dark) ---- */}
      <section className="relative overflow-hidden bg-surface-dark px-6 py-20">
        <div
          aria-hidden
          className="absolute -left-16 top-0 h-64 w-64 rounded-full bg-brand-green/10 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-brand-accent/5 blur-3xl"
        />
        <div className="relative mx-auto max-w-5xl">
          <Reveal>
            <p className="font-measured text-xs uppercase tracking-[0.25em] text-brand-green">
              Our approach
            </p>
            <h2 className="mt-3 max-w-xl text-2xl font-semibold text-white sm:text-3xl">
              Why it works this way
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {APPROACH.map((item, i) => (
              <Reveal key={item.title} delay={i * 90}>
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Categories (light, list rather than card grid for variety) ---- */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <Reveal>
          <p className="font-measured text-xs uppercase tracking-[0.25em] text-brand-green">
            The catalogue
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-brand-ink sm:text-3xl">
            Five categories, one place to compare them
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-10 divide-y divide-neutral-200 border-t border-neutral-200">
            {CATEGORIES.map((category) => (
              <div
                key={category.label}
                className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
              >
                <p className="text-sm font-semibold text-brand-ink sm:w-64 sm:shrink-0">
                  {category.label}
                </p>
                <p className="text-sm text-neutral-600">{category.blurb}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ---- Closing CTA (dark) ---- */}
      <section className="relative overflow-hidden bg-brand-ink px-6 py-24 text-center">
        <div
          aria-hidden
          className="absolute left-1/3 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-green/15 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute right-1/3 top-1/2 h-72 w-72 translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent/10 blur-3xl"
        />
        <Reveal>
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              Ready to see what fits?
            </h2>
            <p className="mt-3 text-neutral-300">
              Browse the catalogue yourself, or send us the space and we&apos;ll
              point you to the right fit.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/catalogue"
                className="rounded-md bg-brand-green px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0 active:opacity-100"
              >
                Browse the catalogue
              </Link>
              <Link
                href="/inquire"
                className="rounded-md border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-150 hover:-translate-y-0.5 hover:bg-white/10 active:translate-y-0 active:bg-white/15"
              >
                Send an inquiry
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  )
}
