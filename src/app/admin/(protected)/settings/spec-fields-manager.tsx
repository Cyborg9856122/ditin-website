"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { SpecField } from "@/lib/domain/types"
import {
  createSpecFieldAction,
  deleteSpecFieldAction,
  moveSpecFieldAction,
  updateSpecFieldAction,
} from "./actions"

export function SpecFieldsManager({ fields }: { fields: SpecField[] }) {
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
            No custom specification fields yet. Add one below.
          </p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {fields.map((field, index) =>
              editingId === field.id ? (
                <li key={field.id} className="p-4">
                  <form
                    action={async (formData) => {
                      await withRefresh(() => updateSpecFieldAction(field.id, formData))
                      setEditingId(null)
                    }}
                    className="flex flex-wrap items-end gap-3"
                  >
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-neutral-500">Label</label>
                      <input
                        name="label"
                        defaultValue={field.label}
                        required
                        className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm outline-none focus:border-brand-green"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-neutral-500">Unit (optional)</label>
                      <input
                        name="unit"
                        defaultValue={field.unit ?? ""}
                        placeholder="e.g. mm, nits"
                        className="w-32 rounded-md border border-neutral-300 px-3 py-1.5 text-sm outline-none focus:border-brand-green"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={pending}
                      className="rounded-md bg-brand-green px-3 py-1.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50"
                    >
                      Cancel
                    </button>
                  </form>
                </li>
              ) : (
                <li key={field.id} className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <p className="text-sm font-medium text-brand-ink">{field.label}</p>
                    {field.unit ? (
                      <p className="text-xs text-neutral-500">Unit: {field.unit}</p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title="Move up"
                      aria-label="Move up"
                      disabled={pending || index === 0}
                      onClick={() => withRefresh(() => moveSpecFieldAction(field.id, "up"))}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-neutral-100 disabled:opacity-30"
                    >
                      <ArrowIcon direction="up" />
                    </button>
                    <button
                      type="button"
                      title="Move down"
                      aria-label="Move down"
                      disabled={pending || index === fields.length - 1}
                      onClick={() => withRefresh(() => moveSpecFieldAction(field.id, "down"))}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-neutral-100 disabled:opacity-30"
                    >
                      <ArrowIcon direction="down" />
                    </button>
                    <button
                      type="button"
                      title="Edit"
                      aria-label="Edit field"
                      onClick={() => setEditingId(field.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-neutral-100"
                    >
                      <PencilIcon />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      aria-label="Delete field"
                      onClick={() => {
                        if (
                          confirm(
                            `Delete the "${field.label}" spec field? This removes it from every product.`,
                          )
                        ) {
                          withRefresh(() => deleteSpecFieldAction(field.id))
                        }
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-red-500 transition hover:bg-red-50"
                    >
                      <TrashIcon />
                    </button>
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
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm outline-none focus:border-brand-green"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-500">Unit (optional)</label>
          <input
            name="unit"
            placeholder="e.g. Hz"
            className="w-32 rounded-md border border-neutral-300 px-3 py-1.5 text-sm outline-none focus:border-brand-green"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-brand-green px-4 py-1.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          Add field
        </button>
      </form>
    </div>
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
