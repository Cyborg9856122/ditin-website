import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/data-access/supabase/server"
import {
  getCurrentProfile,
  listProfiles,
} from "@/lib/data-access/repositories/profile-repository"
import { permissions, ROLE_LABELS } from "@/lib/domain/auth/permissions"
import { InviteUserForm } from "./invite-user-form"
import { RoleSelect } from "./role-select"
import { deleteUserAction } from "./actions"

export const metadata = { title: "Users" }

export default async function UsersPage() {
  const supabase = await createSupabaseServerClient()
  const profile = await getCurrentProfile(supabase)
  if (!profile || !permissions.canManageUsers(profile.role)) {
    redirect("/admin")
  }

  const profiles = await listProfiles(supabase)

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-brand-ink">Users</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Owner-only. There&apos;s no public sign-up — accounts are created here.
      </p>

      <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-4">
        <InviteUserForm />
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Role</th>
              <th className="px-4 py-2 font-medium">Joined</th>
              <th className="px-4 py-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => {
              const isSelf = p.id === profile.id
              return (
                <tr key={p.id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-brand-ink">
                    {p.full_name || "—"}
                    {isSelf ? <span className="ml-2 text-xs text-neutral-400">(you)</span> : null}
                  </td>
                  <td className="px-4 py-3">
                    {isSelf ? (
                      <span className="text-neutral-600">{ROLE_LABELS[p.role]}</span>
                    ) : (
                      <RoleSelect userId={p.id} currentRole={p.role} />
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!isSelf ? (
                      <form action={deleteUserAction.bind(null, p.id)}>
                        <button
                          type="submit"
                          className="text-xs text-red-600 underline hover:no-underline"
                        >
                          Remove
                        </button>
                      </form>
                    ) : null}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
