import Link from "next/link"
import { FAQS } from "@/lib/content/faqs"
import { Reveal } from "@/components/reveal"

export const metadata = { title: "FAQ" }

export default function FaqPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-ink to-surface-dark px-6 py-16 text-center sm:text-left">
        <div
          aria-hidden
          className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-green/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl">
          <p className="font-measured text-xs uppercase tracking-[0.25em] text-brand-green">
            Questions
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
            Frequently asked
          </h1>
          <p className="mt-2 max-w-xl text-neutral-400 sm:mx-0">
            Everything we hear most often — if it&apos;s not here, just ask directly.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-16">
        <Reveal>
          <div className="divide-y divide-neutral-200 border-t border-neutral-200">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="-mx-2 flex cursor-pointer list-none items-center justify-between gap-4 rounded-md px-2 text-sm font-semibold text-brand-ink transition-colors duration-150 marker:content-none hover:text-brand-green">
                  {faq.q}
                  <span
                    aria-hidden
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-neutral-500 transition-transform duration-200 group-open:rotate-45 group-open:border-brand-green group-open:text-brand-green"
                  >
                    +
                  </span>
                </summary>
                <div className="faq-panel">
                  <div>
                    <p className="mt-3 pr-9 text-sm leading-relaxed text-neutral-600">{faq.a}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-14 rounded-lg border border-neutral-200 bg-neutral-50 p-8 text-center">
            <h2 className="text-lg font-semibold text-brand-ink">Still not sure?</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Send us what you know about the space or the event — we&apos;ll fill in the rest.
            </p>
            <Link
              href="/inquire"
              className="mt-5 inline-block rounded-md bg-brand-green px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0 active:opacity-100"
            >
              Send an inquiry
            </Link>
          </div>
        </Reveal>
      </div>
    </main>
  )
}
