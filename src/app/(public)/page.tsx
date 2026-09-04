import Link from "next/link"
import type { ReactNode } from "react"
import { PRODUCT_CATEGORY_LABELS, type ProductCategory } from "@/lib/domain/types"
import { PixelPitchCalculator } from "@/components/pixel-pitch-calculator"
import { HeroGlow } from "@/components/hero-glow"

const CATEGORY_BLURBS: Record<ProductCategory, string> = {
  led_wall: "Modular, seamless, built for stages and storefronts.",
  lcd_video_wall: "Tiled panels for control rooms and retail walls.",
  commercial_display: "Everyday screens for menus, lobbies and signage.",
  interactive_touch: "Touch-driven screens for kiosks and showrooms.",
  outdoor_weatherproof: "High-brightness, sealed against the elements.",
}

const CATEGORY_ICONS: Record<ProductCategory, ReactNode> = {
  led_wall: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <rect x="3" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="14" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3" y="15" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="14" y="15" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  lcd_video_wall: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <rect x="2.5" y="5" width="19" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2.5 12h19M9.5 5v14M14.5 5v14" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  commercial_display: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <rect x="3" y="4" width="18" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 20h6M12 16v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  interactive_touch: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 9.5v6M12 9.5l2.6 2.2c.6.5.6 1.4-.1 1.8l-2 1.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  outdoor_weatherproof: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <rect x="3" y="5" width="18" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M6 20c1-1.2 2-1.2 3 0s2 1.2 3 0 2-1.2 3 0 2 1.2 3 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
}

const TRUST_POINTS = [
  { label: "5 display categories", detail: "LED, LCD, commercial, touch, outdoor" },
  { label: "Rent or buy", detail: "Short-term events or permanent installs" },
  { label: "Indoor & outdoor", detail: "Weatherproofed options built in" },
  { label: "Specs up front", detail: "Pixel pitch, brightness, size — no guessing" },
]

const PROCESS_STEPS = [
  {
    n: "01",
    title: "Browse or ask",
    body: "Filter the catalogue yourself, or send a quick inquiry with your space and budget if you're not sure what fits.",
  },
  {
    n: "02",
    title: "We quote it",
    body: "You'll hear back with real pricing and availability for your dates or your install — not a generic brochure.",
  },
  {
    n: "03",
    title: "Delivered or installed",
    body: "Rentals arrive set up and ready to go. Permanent installs are handled end to end, on the timeline you agreed to.",
  },
]

const FAQS = [
  {
    q: "What's the difference between renting and buying?",
    a: "Renting covers short-term needs — weddings, conferences, activations — and comes fully set up for your dates. Buying is for a permanent install, like a storefront or lobby screen, that runs every day for years.",
  },
  {
    q: "Do you install outdoor and weatherproof screens?",
    a: "Yes — our outdoor and weatherproof range is sealed against the elements and built for facades, forecourts, and any screen exposed to weather.",
  },
  {
    q: "How do I know what pixel pitch or size I need?",
    a: "It depends on viewing distance and the space. Tell us the room or venue and what it's for in an inquiry, and we'll recommend a fit rather than leave you guessing from spec sheets alone.",
  },
  {
    q: "How fast can a rental be ready?",
    a: "It depends on the screen and your dates — send an inquiry with your event date and we'll confirm availability and lead time directly.",
  },
]

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <section className="relative bg-brand-ink px-6 py-24 text-center text-white sm:py-32">
        <div className="bg-pixel-grid absolute inset-0 opacity-40" />
        <HeroGlow />
        <div
          aria-hidden
          className="animate-float-slow absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-green/20 blur-3xl"
        />
        <div
          aria-hidden
          className="animate-float-slower absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-brand-accent/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-3xl">
          <h1 className="animate-fade-in-up mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
            Every screen we sell and rent, in one place —
            <span className="text-brand-green"> browse it yourself.</span>
          </h1>
          <p className="animate-fade-in-up delay-200 mx-auto mt-6 max-w-xl text-base text-neutral-300 sm:text-lg">
            No more waiting on a one-off proposal for a single screen. Filter by
            category, indoor or outdoor, rent or buy, and see specs up front.
          </p>
          <div className="animate-fade-in-up delay-300 mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/catalogue"
              className="rounded-md bg-brand-green px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-90"
            >
              Browse the catalogue
            </Link>
            <Link
              href="/inquire"
              className="rounded-md border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              Get a quote
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-100 bg-white px-6 py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 sm:grid-cols-4 sm:divide-x sm:divide-neutral-200">
          {TRUST_POINTS.map((point) => (
            <div key={point.label} className="text-center sm:px-6 sm:text-left first:sm:pl-0">
              <p className="text-sm font-semibold text-brand-ink">{point.label}</p>
              <p className="mt-1 text-xs text-neutral-500">{point.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-measured text-xs uppercase tracking-[0.25em] text-brand-green">
            How it works
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-brand-ink sm:text-3xl">
            From browsing to installed, three steps
          </h2>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
          {PROCESS_STEPS.map((step, i) => (
            <div key={step.n} className="relative text-center sm:text-left">
              <span className="font-measured text-5xl font-semibold text-neutral-100">
                {step.n}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-brand-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{step.body}</p>
              {i < PROCESS_STEPS.length - 1 ? (
                <div
                  aria-hidden
                  className="absolute right-[-1.25rem] top-6 hidden h-px w-8 bg-neutral-200 sm:block"
                />
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
          <div>
            <p className="font-measured text-xs uppercase tracking-[0.25em] text-brand-green">
              Not sure what you need?
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-brand-ink sm:text-3xl">
              Work out your pixel pitch
            </h2>
            <p className="mt-3 leading-relaxed text-neutral-600">
              Pixel pitch decides how close people can stand before an LED
              screen looks sharp instead of grainy. Tell us the space (or a
              pitch you&apos;ve seen quoted) and get a straight answer.
            </p>
          </div>
          <PixelPitchCalculator />
        </div>
      </section>

      <section className="relative bg-neutral-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-measured text-xs uppercase tracking-[0.25em] text-brand-green">
              What we carry
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-brand-ink sm:text-3xl">
              Every category
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.entries(PRODUCT_CATEGORY_LABELS) as [ProductCategory, string][]).map(
              ([value, label]) => (
                <Link
                  key={value}
                  href={`/catalogue?category=${value}`}
                  className="group rounded-lg border border-neutral-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-green hover:shadow-lg hover:shadow-brand-green/10"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-brand-green/10 text-brand-green transition group-hover:bg-brand-green group-hover:text-white">
                    {CATEGORY_ICONS[value]}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-brand-ink group-hover:text-brand-green">
                    {label}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-600">{CATEGORY_BLURBS[value]}</p>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold text-brand-ink sm:text-3xl">
            Rent for an event. Buy for the long run.
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="group relative overflow-hidden rounded-lg border border-neutral-200 p-8 transition duration-300 hover:-translate-y-1 hover:border-brand-green hover:shadow-lg hover:shadow-brand-green/10">
            <div
              aria-hidden
              className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-green/10 transition group-hover:scale-125"
            />
            <p className="relative font-measured text-xs uppercase tracking-wide text-brand-green">
              Rent
            </p>
            <h3 className="relative mt-2 text-lg font-semibold text-brand-ink">
              Short-term, fully set up
            </h3>
            <p className="relative mt-2 text-sm text-neutral-600">
              Weddings, conferences, activations and pop-ups — tell us the dates
              and the space, we handle the rest.
            </p>
            <Link
              href="/catalogue?availability=rent"
              className="relative mt-4 inline-block text-sm font-medium text-brand-green hover:underline"
            >
              See rentable screens →
            </Link>
          </div>
          <div className="group relative overflow-hidden rounded-lg border border-neutral-200 p-8 transition duration-300 hover:-translate-y-1 hover:border-brand-green hover:shadow-lg hover:shadow-brand-green/10">
            <div
              aria-hidden
              className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-accent/10 transition group-hover:scale-125"
            />
            <p className="relative font-measured text-xs uppercase tracking-wide text-brand-green">
              Buy
            </p>
            <h3 className="relative mt-2 text-lg font-semibold text-brand-ink">
              Permanent installs
            </h3>
            <p className="relative mt-2 text-sm text-neutral-600">
              Storefronts, lobbies, control rooms and stages built to run every
              day, for years.
            </p>
            <Link
              href="/catalogue?availability=buy"
              className="relative mt-4 inline-block text-sm font-medium text-brand-green hover:underline"
            >
              See screens to buy →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-100 bg-neutral-50 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="font-measured text-xs uppercase tracking-[0.25em] text-brand-green">
              Questions
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-brand-ink sm:text-3xl">
              Frequently asked
            </h2>
          </div>
          <div className="mt-10 divide-y divide-neutral-200 border-t border-neutral-200">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-brand-ink marker:content-none">
                  {faq.q}
                  <span
                    aria-hidden
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-neutral-500 transition group-open:rotate-45 group-open:border-brand-green group-open:text-brand-green"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 pr-9 text-sm leading-relaxed text-neutral-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-4xl px-6 py-24 text-center">
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-green/5 blur-3xl"
        />
        <h2 className="text-2xl font-semibold text-brand-ink sm:text-3xl">
          Don&apos;t see exactly what you need?
        </h2>
        <p className="mt-3 text-neutral-600">
          Tell us the space, the budget, and whether it&apos;s indoor or outdoor —
          we&apos;ll match it to something in range.
        </p>
        <Link
          href="/inquire"
          className="mt-7 inline-block rounded-md bg-brand-green px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-90"
        >
          Send an inquiry
        </Link>
      </section>
    </main>
  )
}
