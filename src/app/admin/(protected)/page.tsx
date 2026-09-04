import Link from "next/link"
import { createSupabaseServerClient } from "@/lib/data-access/supabase/server"
import { getCurrentProfile } from "@/lib/data-access/repositories/profile-repository"
import { listProducts } from "@/lib/data-access/repositories/product-repository"
import { countInquiriesByStatus } from "@/lib/data-access/repositories/inquiry-repository"
import { ROLE_DESCRIPTIONS, ROLE_LABELS, permissions } from "@/lib/domain/auth/permissions"

export const metadata = {
  title: "Admin dashboard",
}

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient()
  const profile = await getCurrentProfile(supabase)

  // Layout above already guarantees profile is non-null for anything
  // rendered here, but keep the type honest without a non-null assertion.
  if (!profile) return null

  const canViewInquiries = permissions.canViewInquiries(profile.role)
  const [products, inquiryCounts] = await Promise.all([
    listProducts(supabase),
    canViewInquiries ? countInquiriesByStatus(supabase) : Promise.resolve(null),
  ])

  const published = products.filter((p) => p.status === "published").length

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-brand-ink">Welcome</h1>
      <p className="mt-2 text-neutral-600">
        You&apos;re signed in as <strong>{ROLE_LABELS[profile.role]}</strong>.{" "}
        {ROLE_DESCRIPTIONS[profile.role]}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/products"
          className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-green hover:shadow-md active:translate-y-0"
        >
          <p className="text-2xl font-semibold text-brand-ink">{products.length}</p>
          <p className="text-sm text-neutral-500">
            Products ({published} published)
          </p>
        </Link>

        {inquiryCounts ? (
          <Link
            href="/admin/inquiries"
            className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-green hover:shadow-md active:translate-y-0"
          >
            <p className="text-2xl font-semibold text-brand-ink">{inquiryCounts.new}</p>
            <p className="text-sm text-neutral-500">
              New inquiries ({Object.values(inquiryCounts).reduce((a, b) => a + b, 0)} total)
            </p>
          </Link>
        ) : null}
      </div>
    </div>
  )
}
