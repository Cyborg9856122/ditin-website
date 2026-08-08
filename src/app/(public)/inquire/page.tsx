import { InquiryForm } from "./inquiry-form"

export const metadata = { title: "Get a quote" }

const REASSURANCE_POINTS = [
  {
    title: "Real pricing, not a brochure",
    body: "We reply with actual availability and pricing for your dates or your install.",
  },
  {
    title: "Rent or buy, indoor or outdoor",
    body: "Tell us what you know — we'll help fill in the rest, like pixel pitch or sizing.",
  },
  {
    title: "WhatsApp or email, your call",
    body: "Leave whichever you check first and we'll follow up there.",
  },
]

export default function InquirePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="lg:pr-6">
          <p className="font-measured text-xs uppercase tracking-[0.25em] text-brand-green">
            Get a quote
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">
            Tell us what you need
          </h1>
          <p className="mt-3 leading-relaxed text-neutral-600">
            Screen type, indoor or outdoor, rent or buy — send what you know and
            we&apos;ll follow up with options and pricing.
          </p>

          <ul className="mt-10 flex flex-col gap-6 border-t border-neutral-200 pt-8">
            {REASSURANCE_POINTS.map((point) => (
              <li key={point.title} className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green"
                />
                <div>
                  <p className="text-sm font-semibold text-brand-ink">{point.title}</p>
                  <p className="mt-1 text-sm text-neutral-600">{point.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
          <InquiryForm />
        </div>
      </div>
    </main>
  )
}
