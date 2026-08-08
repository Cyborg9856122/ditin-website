import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/data-access/supabase/server"
import { getCurrentProfile } from "@/lib/data-access/repositories/profile-repository"
import { ROLE_LABELS } from "@/lib/domain/auth/permissions"
import { signOut } from "../actions"
import { AdminNav } from "./admin-nav"

// Guards every route under /admin except /admin/login (which lives outside
// this route group). The proxy (middleware) already redirects signed-out
// visitors, but Server Actions/Components should never rely on that alone —
// authorization is re-checked here per Next.js's data-security guidance.
export default async function ProtectedAdminLayout({
  children,
}: LayoutProps<"/admin">) {
  const supabase = await createSupabaseServerClient()
  const profile = await getCurrentProfile(supabase)

  if (!profile) {
    redirect("/admin/login")
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-neutral-50">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
        <div>
          <p className="font-measured text-xs uppercase tracking-[0.3em] text-brand-green">
            Ditin Displays
          </p>
          <p className="text-sm text-neutral-500">Admin</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-neutral-600">
            {profile.full_name || "Signed in"} ·{" "}
            <span className="font-medium text-brand-ink">
              {ROLE_LABELS[profile.role]}
            </span>
          </span>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 transition hover:bg-neutral-100"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <AdminNav role={profile.role} />
      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  )
}
