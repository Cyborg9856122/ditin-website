"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SPEC_FIELD_TYPE_LABELS, type SpecField, type SpecFieldOption, type SpecFieldType } from "@/lib/domain/types"
import {
  createSpecFieldAction,
  createSpecFieldOptionAction,
  deleteSpecFieldAction,
  deleteSpecFieldOptionAction,
  moveSpecFieldAction,
  moveSpecFieldOptionAction,
  setSpecFieldArchivedAction,
  updateSpecFieldAction,
  updateSpecFieldOptionAction,
} from "./actions"

const CHOICE_TYPES: SpecFieldType[] = ["dropdown", "multiselect"]

export function SpecFieldsManager({
  fields,
  optionsByField,
}: {
  fields: SpecField[]
  optionsByField: Record<string, SpecFieldOption[]>
}) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function withRefresh(fn: () => Promise<void>) {
    setPending(true)
    try {
      await fn()
      router.refresh()
    } finally {
      setPending(false)
    }
  }

  return (
    <div>
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        {fields.length === 0 ? (
          <p className="p-6 text-center text-sm text-neutral-400">
            No specification fields yet. Add one below.
          </p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {fields.map((field, index) =>
              editingId === field.id ? (
                <li key={field.id} className="p-4">
                  <FieldEditForm
                    field={field}
                    options={optionsByField[field.id] ?? []}
                    pending={pending}
                    onCancel={() => setEditingId(null)}
                    onSaved={() => setEditingId(null)}
                    withRefresh={withRefresh}
                  />
                </li>
              ) : (
                <li
                  key={field.id}
                  className={`flex items-center justify-between gap-3 p-4 ${
                    field.is_archived ? "bg-neutral-50/60" : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-brand-ink">{field.label}</p>
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-neutral-500">
                        {SPEC_FIELD_TYPE_LABELS[field.field_type]}
                      </span>
                      {field.is_archived ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-700">
                          Archived
                        </span>
                      ) : null}
                    </div>
                    {field.unit ? (
                      <p className="mt-0.5 text-xs text-neutral-500">Unit: {field.unit}</p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-1">
                    <IconButton
                      title="Move up"
                      disabled={pending || index === 0}
                      onClick={() => withRefresh(() => moveSpecFieldAction(field.id, "up"))}
                    >
                      <ArrowIcon direction="up" />
                    </IconButton>
                    <IconButton
                      title="Move down"
                      disabled={pending || index === fields.length - 1}
                      onClick={() => withRefresh(() => moveSpecFieldAction(field.id, "down"))}
                    >
                      <ArrowIcon direction="down" />
                    </IconButton>
                    <IconButton title="Edit" onClick={() => setEditingId(field.id)}>
                      <PencilIcon />
                    </IconButton>
                    <IconButton
                      title={field.is_archived ? "Unarchive" : "Archive"}
                      onClick={() =>
                        withRefresh(() => setSpecFieldArchivedAction(field.id, !field.is_archived))
                      }
                    >
                      <ArchiveIcon />
                    </IconButton>
                    {!field.field_key ? (
                      <IconButton
                        title="Delete"
                        variant="danger"
                        onClick={() => {
                          if (
                            confirm(
                              `Delete the "${field.label}" spec field? This removes it from every product.`,
                            )
                          ) {
                            withRefresh(() => deleteSpecFieldAction(field.id))
                          }
                        }}
                      >
                        <TrashIcon />
                      </IconButton>
                    ) : null}
                  </div>
                </li>
              ),
            )}
          </ul>
        )}
      </div>

      <form
        action={async (formData) => {
          await withRefresh(() => createSpecFieldAction(formData))
        }}
        className="mt-4 flex flex-wrap items-end gap-3 rounded-lg border border-dashed border-neutral-300 p-4"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-500">Label</label>
          <input
            name="label"
            required
            placeholder="e.g. Refresh rate"
            className="cursor-text rounded-md border border-neutral-300 px-3 py-1.5 text-sm outline-none transition focus:border-brand-green"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-500">Type</label>
          <select
            name="field_type"
            defaultValue="text"
            className="cursor-pointer rounded-md border border-neutral-300 px-3 py-1.5 text-sm outline-none transition focus:border-brand-green"
          >
            {Object.entries(SPEC_FIELD_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-500">Unit (optional)</label>
          <input
            name="unit"
            placeholder="e.g. Hz"
            className="w-28 cursor-text rounded-md border border-neutral-300 px-3 py-1.5 text-sm outline-none transition focus:border-brand-green"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="cursor-pointer rounded-md bg-brand-green px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:-translate-y-px hover:opacity-90 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Add field
        </button>
      </form>
      <p className="mt-2 text-xs text-neutral-500">
        New dropdown/multi-select fields can have their options added once created — save the
        field first, then edit it to manage options.
      </p>
    </div>
  )
}

function FieldEditForm({
  field,
  options,
  pending,
  onCancel,
  onSaved,
  withRefresh,
}: {
  field: SpecField
  options: SpecFieldOption[]
  pending: boolean
  onCancel: () => void
  onSaved: () => void
  withRefresh: (fn: () => Promise<void>) => Promise<void>
}) {
  const [fieldType, setFieldType] = useState<SpecFieldType>(field.field_type)

  return (
    <div className="flex flex-col gap-4">
      <form
        action={async (formData) => {
          await withRefresh(() => updateSpecFieldAction(field.id, formData))
          onSaved()
        }}
        className="flex flex-wrap items-end gap-3"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-500">Label</label>
          <input
            name="label"
            defaultValue={field.label}
            required
            className="cursor-text rounded-md border border-neutral-300 px-3 py-1.5 text-sm outline-none transition focus:border-brand-green"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-500">Type</label>
          <select
            name="field_type"
            value={fieldType}
            onChange={(e) => setFieldType(e.target.value as SpecFieldType)}
            className="cursor-pointer rounded-md border border-neutral-300 px-3 py-1.5 text-sm outline-none transition focus:border-brand-green"
          >
            {Object.entries(SPEC_FIELD_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-500">Unit (optional)</label>
          <input
            name="unit"
            defaultValue={field.unit ?? ""}
            placeholder="e.g. mm, nits"
            className="w-32 cursor-text rounded-md border border-neutral-300 px-3 py-1.5 text-sm outline-none transition focus:border-brand-green"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="cursor-pointer rounded-md bg-brand-green px-3 py-1.5 text-sm font-semibold text-white transition-all duration-150 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-600 transition-all duration-150 hover:bg-neutral-50"
        >
          Cancel
        </button>
      </form>

      {CHOICE_TYPES.includes(fieldType) ? (
        <OptionsManager fieldId={field.id} options={options} withRefresh={withRefresh} />
      ) : null}
    </div>
  )
}

function OptionsManager({
  fieldId,
  options,
  withRefresh,
}: {
  fieldId: string
  options: SpecFieldOption[]
  withRefresh: (fn: () => Promise<void>) => Promise<void>
}) {
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null)

  return (
    <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Options</p>
      <ul className="mt-2 flex flex-col gap-1.5">
        {options.map((option, index) =>
          editingOptionId === option.id ? (
            <li key={option.id}>
              <form
                action={async (formData) => {
                  await withRefresh(() => updateSpecFieldOptionAction(option.id, formData))
                  setEditingOptionId(null)
                }}
                className="flex items-center gap-2"
              >
                <input
                  name="label"
                  defaultValue={option.label}
                  required
                  className="cursor-text rounded-md border border-neutral-300 px-2.5 py-1 text-sm outline-none transition focus:border-brand-green"
                />
                <button
                  type="submit"
                  className="cursor-pointer rounded-md bg-brand-green px-2.5 py-1 text-xs font-semibold text-white transition-all duration-150 hover:opacity-90"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingOptionId(null)}
                  className="cursor-pointer rounded-md border border-neutral-300 px-2.5 py-1 text-xs text-neutral-600 transition-all duration-150 hover:bg-white"
                >
                  Cancel
                </button>
              </form>
            </li>
          ) : (
            <li
              key={option.id}
              className="flex items-center justify-between gap-2 rounded-md bg-white px-2.5 py-1.5"
            >
              <span className="text-sm text-neutral-700">{option.label}</span>
              <div className="flex items-center gap-0.5">
                <IconButton
                  title="Move up"
                  small
                  disabled={index === 0}
                  onClick={() => withRefresh(() => moveSpecFieldOptionAction(fieldId, option.id, "up"))}
                >
                  <ArrowIcon direction="up" />
                </IconButton>
                <IconButton
                  title="Move down"
                  small
                  disabled={index === options.length - 1}
                  onClick={() =>
                    withRefresh(() => moveSpecFieldOptionAction(fieldId, option.id, "down"))
                  }
                >
                  <ArrowIcon direction="down" />
                </IconButton>
                <IconButton title="Rename" small onClick={() => setEditingOptionId(option.id)}>
                  <PencilIcon />
                </IconButton>
                <IconButton
                  title="Remove option"
                  small
                  variant="danger"
                  onClick={() => {
                    if (confirm(`Remove the "${option.label}" option?`)) {
                      withRefresh(() => deleteSpecFieldOptionAction(option.id))
                    }
                  }}
                >
                  <TrashIcon />
                </IconButton>
              </div>
            </li>
          ),
        )}
      </ul>

      <form
        action={async (formData) => {
          await withRefresh(() => createSpecFieldOptionAction(fieldId, formData))
        }}
        className="mt-2 flex items-center gap-2"
      >
        <input
          name="label"
          required
          placeholder="Add an option…"
          className="cursor-text rounded-md border border-neutral-300 px-2.5 py-1 text-sm outline-none transition focus:border-brand-green"
        />
        <button
          type="submit"
          className="cursor-pointer rounded-md border border-brand-green px-2.5 py-1 text-xs font-semibold text-brand-green transition-all duration-150 hover:bg-brand-green hover:text-white"
        >
          Add option
        </button>
      </form>
    </div>
  )
}

function IconButton({
  children,
  title,
  onClick,
  disabled,
  variant = "default",
  small = false,
}: {
  children: React.ReactNode
  title: string
  onClick: () => void
  disabled?: boolean
  variant?: "default" | "danger"
  small?: boolean
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className={`flex cursor-pointer items-center justify-center rounded-md transition-all duration-150 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 ${
        small ? "h-6 w-6" : "h-8 w-8"
      } ${
        variant === "danger"
          ? "text-red-500 hover:bg-red-50 hover:text-red-600"
          : "text-neutral-500 hover:bg-neutral-100 hover:text-brand-ink"
      }`}
    >
      {children}
    </button>
  )
}

function ArrowIcon({ direction }: { direction: "up" | "down" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d={direction === "up" ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M4 20h4L18.5 9.5a2 2 0 0 0 0-2.8L17.3 5.5a2 2 0 0 0-2.8 0L4 16v4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 .6 12.1a2 2 0 0 0 2 1.9h4.8a2 2 0 0 0 2-1.9L18 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArchiveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M3.5 6.5h17M4.5 6.5v12a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-12M9.5 11h5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M3 4.5h18a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}
