"use client"

import { useActionState } from "react"
import {
  AVAILABILITY_LABELS,
  PLACEMENT_LABELS,
  PRODUCT_CATEGORY_LABELS,
  type Product,
  type SpecField,
  type SpecFieldOption,
} from "@/lib/domain/types"
import type { ProductFormState } from "./actions"

const initialState: ProductFormState = { error: null }

export function ProductForm({
  product,
  specFields = [],
  specValues,
  specFieldOptions = {},
  action,
}: {
  product?: Product
  specFields?: SpecField[]
  specValues?: Map<string, string>
  specFieldOptions?: Record<string, SpecFieldOption[]>
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
          title="Specifications"
          description="Managed under Settings. Leave blank to hide a spec on the public page."
        >
          {specFields.map((field) => (
            <SpecFieldInput
              key={field.id}
              field={field}
              options={specFieldOptions[field.id] ?? []}
              value={specValues?.get(field.id) ?? ""}
            />
          ))}
        </FormSection>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="tap-target cursor-pointer self-start rounded-md bg-brand-green px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:-translate-y-px hover:opacity-90 active:translate-y-0 active:opacity-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving…" : product ? "Save changes" : "Create product"}
      </button>
    </form>
  )
}

function SpecFieldInput({
  field,
  options,
  value,
}: {
  field: SpecField
  options: SpecFieldOption[]
  value: string
}) {
  const name = `spec_${field.id}`
  const label = field.unit ? `${field.label} (${field.unit})` : field.label

  if (field.field_type === "boolean") {
    return (
      <div className="flex items-center justify-between gap-3 py-1">
        <label htmlFor={name} className="text-sm font-medium text-brand-ink">
          {label}
        </label>
        <ToggleInput name={name} defaultChecked={value === "true"} />
      </div>
    )
  }

  if (field.field_type === "dropdown") {
    return (
      <Field label={label} htmlFor={name}>
        <select id={name} name={name} defaultValue={value} className={inputClass}>
          <option value="">—</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>
    )
  }

  if (field.field_type === "multiselect") {
    const selected = new Set(value ? value.split(",") : [])
    return (
      <Field label={label} htmlFor={name}>
        <div className="flex flex-wrap gap-x-4 gap-y-2 rounded-md border border-neutral-300 px-3 py-2">
          {options.length === 0 ? (
            <p className="text-xs text-neutral-400">No options configured yet.</p>
          ) : (
            options.map((option) => (
              <label
                key={option.id}
                className="flex cursor-pointer items-center gap-1.5 text-sm text-neutral-700"
              >
                <input
                  type="checkbox"
                  name={name}
                  value={option.id}
                  defaultChecked={selected.has(option.id)}
                  className="h-3.5 w-3.5 cursor-pointer accent-brand-green"
                />
                {option.label}
              </label>
            ))
          )}
        </div>
      </Field>
    )
  }

  if (field.field_type === "number") {
    return (
      <Field label={label} htmlFor={name}>
        <input
          id={name}
          name={name}
          type="number"
          step="any"
          defaultValue={value}
          className={`${inputClass} font-measured`}
        />
      </Field>
    )
  }

  return (
    <Field label={label} htmlFor={name}>
      <input id={name} name={name} defaultValue={value} className={inputClass} />
    </Field>
  )
}

function ToggleInput({ name, defaultChecked }: { name: string; defaultChecked: boolean }) {
  return (
    <label className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center">
      <input
        type="checkbox"
        name={name}
        value="true"
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <span className="absolute inset-0 rounded-full bg-neutral-300 transition-colors duration-150 peer-checked:bg-brand-green peer-focus-visible:ring-2 peer-focus-visible:ring-brand-green peer-focus-visible:ring-offset-2" />
      <span className="relative h-4.5 w-4.5 translate-x-1 rounded-full bg-white shadow transition-transform duration-150 peer-checked:translate-x-6" />
    </label>
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
  "rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-brand-green focus:ring-1 focus:ring-brand-green"

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
