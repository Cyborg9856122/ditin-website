import { InquiryForm } from "./inquiry-form"

export const metadata = { title: "Get a quote" }

export default function InquirePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-semibold text-brand-ink">Get a quote</h1>
      <p className="mt-2 text-neutral-600">
        Tell us what you need — screen type, indoor or outdoor, rent or buy — and
        we&apos;ll follow up with options and pricing.
      </p>
      <div className="mt-8">
        <InquiryForm />
      </div>
    </main>
  )
}
