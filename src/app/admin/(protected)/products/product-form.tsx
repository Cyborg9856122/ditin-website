"use client"

import { useActionState } from "react"
import {
  AVAILABILITY_LABELS,
  PLACEMENT_LABELS,
  PRODUCT_CATEGORY_LABELS,
  type Product,
  type SpecField,
} from "@/lib/domain/types"
import type { ProductFormState } from "./actions"

const initialState: ProductFormState = { error: null }

export function ProductForm({
  product,
  specFields = [],
  specValues,
  action,
}: {
  product?: Product
  specFields?: SpecField[]
  specValues?: Map<string, string>
  action: (prevState: ProductFormState, formData: FormData) => Promise<ProductFormState>
}) {
  const [state, formAction, pending] = useActionState(action, initialState)
  const err = (field: string) => state.fieldErrors?.[field]

  return (
    <form
      action={formAction}
      className="flex max-w-2xl flex-col gap-8 rounded-lg border border-neutral-200 bg-white p-6"
    >
      {state.error ? (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <FormSection title="Basics" description="What it's called and how it's categorized.">
        <Field label="Name" htmlFor="name" error={err("name")}>
          <input
            id="name"
            name="name"
            defaultValue={product?.name}
            required
            className={inputClass}
          />
        </Field>

        <Field
          label="URL slug"
          htmlFor="slug"
          hint="Leave blank to generate automatically from the name."
          error={err("slug")}
        >
          <input
            id="slug"
            name="slug"
            defaultValue={product?.slug}
            placeholder="auto-generated-from-name"
            className={`${inputClass} font-measured`}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Category" htmlFor="category" error={err("category")}>
            <select
              id="category"
              name="category"
              defaultValue={product?.category ?? "led_wall"}
              className={inputClass}
            >
              {Object.entries(PRODUCT_CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Placement" htmlFor="placement" error={err("placement")}>
            <select
              id="placement"
              name="placement"
              defaultValue={product?.placement ?? "indoor"}
              className={inputClass}
            >
              {Object.entries(PLACEMENT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Availability" htmlFor="availability" error={err("availability")}>
          <select
            id="availability"
            name="availability"
            defaultValue={product?.availability ?? "both"}
            className={inputClass}
          >
            {Object.entries(AVAILABILITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
      </FormSection>

      <FormSection title="Specs" description="Only fill in what applies to this product.">
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Pixel pitch (mm)"
            htmlFor="pixel_pitch_mm"
            hint="LED products only, e.g. 2.5"
            error={err("pixel_pitch_mm")}
          >
            <input
              id="pixel_pitch_mm"
              name="pixel_pitch_mm"
              type="number"
              step="0.1"
              min="1"
              max="10"
              defaultValue={product?.pixel_pitch_mm ?? ""}
              className={`${inputClass} font-measured`}
            />
          </Field>

          <Field
            label="Panel size"
            htmlFor="panel_size"
            hint='LCD/commercial screens, e.g. 55"'
            error={err("panel_size")}
          >
            <input
              id="panel_size"
              name="panel_size"
              defaultValue={product?.panel_size ?? ""}
              className={`${inputClass} font-measured`}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Brightness (nits)" htmlFor="brightness_nits" error={err("brightness_nits")}>
            <input
              id="brightness_nits"
              name="brightness_nits"
              type="number"
              min="1"
              defaultValue={product?.brightness_nits ?? ""}
              className={`${inputClass} font-measured`}
            />
          </Field>

          <Field label="Resolution" htmlFor="resolution" error={err("resolution")}>
            <input
              id="resolution"
              name="resolution"
              placeholder="e.g. 1920x1080"
              defaultValue={product?.resolution ?? ""}
              className={`${inputClass} font-measured`}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Description" description="Shown on the product's public page.">
        <Field label="Typical use case" htmlFor="typical_use_case" error={err("typical_use_case")}>
          <textarea
            id="typical_use_case"
            name="typical_use_case"
            rows={4}
            defaultValue={product?.typical_use_case ?? ""}
            className={inputClass}
          />
        </Field>
      </FormSection>

      {specFields.length > 0 ? (
        <FormSection
          title="Custom specifications"
          description="Managed under Settings. Leave blank to hide a spec on the public page."
        >
          {specFields.map((field) => (
            <Field
              key={field.id}
              label={field.unit ? `${field.label} (${field.unit})` : field.label}
              htmlFor={`spec_${field.id}`}
            >
              <input
                id={`spec_${field.id}`}
                name={`spec_${field.id}`}
                defaultValue={specValues?.get(field.id) ?? ""}
                className={inputClass}
              />
            </Field>
          ))}
        </FormSection>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-brand-green px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Saving…" : product ? "Save changes" : "Create product"}
      </button>
    </form>
  )
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 gap-4 border-t border-neutral-100 pt-6 first:border-0 first:pt-0 sm:grid-cols-[10rem_1fr] sm:gap-8">
      <div>
        <h3 className="text-sm font-semibold text-brand-ink">{title}</h3>
        <p className="mt-1 text-xs text-neutral-500">{description}</p>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}

const inputClass =
  "rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"

function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string
  htmlFor: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-brand-ink">
        {label}
      </label>
      {children}
      {hint && !error ? <p className="text-xs text-neutral-500">{hint}</p> : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  )
}
