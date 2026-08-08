"use client"

import { useTransition } from "react"
import { updateUserRoleAction } from "./actions"
import { ROLE_LABELS } from "@/lib/domain/auth/permissions"
import type { Role } from "@/lib/domain/types"

const roles: Role[] = ["viewer", "editor", "owner"]

export function RoleSelect({
  userId,
  currentRole,
  disabled,
}: {
  userId: string
  currentRole: Role
  disabled?: boolean
}) {
  const [pending, startTransition] = useTransition()

  return (
    <select
      defaultValue={currentRole}
      disabled={disabled || pending}
      onChange={(e) => {
        const role = e.target.value as Role
        startTransition(() => {
          updateUserRoleAction(userId, role)
        })
      }}
      className="rounded-md border border-neutral-300 px-2 py-1 text-sm disabled:opacity-50"
    >
      {roles.map((r) => (
        <option key={r} value={r}>
          {ROLE_LABELS[r]}
        </option>
      ))}
    </select>
  )
}
