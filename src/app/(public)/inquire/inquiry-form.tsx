"use client"

import { useActionState, useState } from "react"
import {
  PLACEMENT_LABELS,
  PRODUCT_CATEGORY_LABELS,
  type Placement,
  type ProductCategory,
} from "@/lib/domain/types"
import { submitInquiryAction, inquiryInitialState, type InquiryFormState } from "./actions"

export function InquiryForm({
  productId,
  productName,
  defaultScreenType,
  defaultPlacement,
}: {
  productId?: string
  productName?: string
  defaultScreenType?: ProductCategory
  defaultPlacement?: Placement
}) {
  const [state, formAction, pending] = useActionState<InquiryFormState, FormData>(
    submitInquiryAction,
    inquiryInitialState,
  )
  const [rentOrBuy, setRentOrBuy] = useState<"rent" | "buy">("rent")
  const err = (field: string) => state.fieldErrors?.[field]

  if (state.status === "success") {
    return (
      <div className="rounded-lg border border-brand-green/30 bg-brand-green/5 p-6 text-center">
        <p className="text-lg font-semibold text-brand-ink">Got it — thank you.</p>
        <p className="mt-1 text-sm text-neutral-600">
          We&apos;ll get back to you on WhatsApp or email shortly.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {productId ? <input type="hidden" name="product_id" value={productId} /> : null}
      {productName ? (
        <p className="rounded-md bg-neutral-50 px-3 py-2 text-sm text-neutral-600">
          Asking about: <strong className="text-brand-ink">{productName}</strong>
        </p>
      ) : null}

      {state.error ? (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="name" error={err("name")}>
          <input id="name" name="name" required className={inputClass} />
        </Field>
        <Field label="Company (optional)" htmlFor="company" error={err("company")}>
          <input id="company" name="company" className={inputClass} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Phone / WhatsApp" htmlFor="phone_whatsapp" error={err("phone_whatsapp")}>
          <input id="phone_whatsapp" name="phone_whatsapp" required className={inputClass} />
        </Field>
        <Field label="Email (optional)" htmlFor="email" error={err("email")}>
          <input id="email" name="email" type="email" className={inputClass} />
        </Field>
      </div>

      <Field label="Rent or buy" htmlFor="rent_or_buy" error={err("rent_or_buy")}>
        <select
          id="rent_or_buy"
          name="rent_or_buy"
          value={rentOrBuy}
          onChange={(e) => setRentOrBuy(e.target.value as "rent" | "buy")}
          className={inputClass}
        >
          <option value="rent">Rent</option>
          <option value="buy">Buy</option>
        </select>
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Screen type" htmlFor="screen_type" error={err("screen_type")}>
          <select
            id="screen_type"
            name="screen_type"
            defaultValue={defaultScreenType ?? ""}
            className={inputClass}
          >
            <option value="">Not sure</option>
            {Object.entries(PRODUCT_CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Indoor or outdoor" htmlFor="indoor_or_outdoor" error={err("indoor_or_outdoor")}>
          <select
            id="indoor_or_outdoor"
            name="indoor_or_outdoor"
            defaultValue={defaultPlacement ?? ""}
            className={inputClass}
          >
            <option value="">Not sure</option>
            {Object.entries(PLACEMENT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Approx. size (optional)" htmlFor="approx_size" error={err("approx_size")}>
          <input
            id="approx_size"
            name="approx_size"
            placeholder='e.g. 3m x 2m'
            className={`${inputClass} font-measured`}
          />
        </Field>
        <Field label="Budget (optional)" htmlFor="budget" error={err("budget")}>
          <input id="budget" name="budget" className={`${inputClass} font-measured`} />
        </Field>
      </div>

      {rentOrBuy === "rent" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Rental start" htmlFor="rental_start_date" error={err("rental_start_date")}>
            <input
              id="rental_start_date"
              name="rental_start_date"
              type="date"
              className={`${inputClass} font-measured`}
            />
          </Field>
          <Field label="Rental end" htmlFor="rental_end_date" error={err("rental_end_date")}>
            <input
              id="rental_end_date"
              name="rental_end_date"
              type="date"
              className={`${inputClass} font-measured`}
            />
          </Field>
        </div>
      ) : null}

      <Field label="What's it for? (optional)" htmlFor="purpose" error={err("purpose")}>
        <textarea id="purpose" name="purpose" rows={4} className={inputClass} />
      </Field>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-md bg-brand-green px-7 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-90 disabled:pointer-events-none disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  )
}

const inputClass =
  "rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-green focus:ring-1 focus:ring-brand-green"

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-brand-ink">
        {label}
      </label>
      {children}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  )
}
