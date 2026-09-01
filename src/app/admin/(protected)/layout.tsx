import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/data-access/supabase/server"
import { getCurrentProfile } from "@/lib/data-access/repositories/profile-repository"
import { signOut } from "../actions"
import { AdminSidebar } from "./admin-sidebar"
import { AdminMobileBar } from "./admin-mobile-bar"

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
    <div className="flex min-h-screen bg-neutral-50">
      <AdminSidebar role={profile.role} fullName={profile.full_name} onSignOut={signOut} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminMobileBar role={profile.role} onSignOut={signOut} />
        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  )
}
