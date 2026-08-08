"use client"

import { useActionState, useState } from "react"
import { createUserAction, type CreateUserState } from "./actions"
import { ROLE_LABELS } from "@/lib/domain/auth/permissions"
import type { Role } from "@/lib/domain/types"

const initialState: CreateUserState = { error: null }
const roles: Role[] = ["viewer", "editor", "owner"]

export function InviteUserForm() {
  const [state, formAction, pending] = useActionState(createUserAction, initialState)
  const [copied, setCopied] = useState(false)

  if (state.created) {
    return (
      <div className="rounded-lg border border-brand-green/30 bg-brand-green/5 p-4 text-sm">
        <p className="font-medium text-brand-ink">
          Account created for {state.created.email}
        </p>
        <p className="mt-1 text-neutral-600">
          Share this temporary password with them directly (it won&apos;t be shown again).
          They should sign in and use &quot;Forgot password&quot; to set their own.
        </p>
        <div className="mt-2 flex items-center gap-2">
          <code className="rounded bg-white px-2 py-1 font-measured text-sm">
            {state.created.temporaryPassword}
          </code>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(state.created!.temporaryPassword)
              setCopied(true)
            }}
            className="text-xs text-brand-green underline"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-3 text-xs text-neutral-500 underline"
        >
          Invite another
        </button>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3 text-sm">
      <div className="flex flex-col gap-1">
        <label htmlFor="fullName" className="text-xs font-medium text-neutral-600">
          Name
        </label>
        <input
          id="fullName"
          name="fullName"
          required
          className="rounded-md border border-neutral-300 px-3 py-1.5"
        />
        {state.fieldErrors?.fullName ? (
          <p className="text-xs text-red-600">{state.fieldErrors.fullName}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-xs font-medium text-neutral-600">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="rounded-md border border-neutral-300 px-3 py-1.5"
        />
        {state.fieldErrors?.email ? (
          <p className="text-xs text-red-600">{state.fieldErrors.email}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="role" className="text-xs font-medium text-neutral-600">
          Role
        </label>
        <select
          id="role"
          name="role"
          defaultValue="viewer"
          className="rounded-md border border-neutral-300 px-3 py-1.5"
        >
          {roles.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-brand-green px-4 py-1.5 font-semibold text-white hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create account"}
      </button>

      {state.error ? <p className="w-full text-xs text-red-600">{state.error}</p> : null}
    </form>
  )
}
