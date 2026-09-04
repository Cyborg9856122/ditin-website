import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/data-access/supabase/server"
import { getCurrentProfile } from "@/lib/data-access/repositories/profile-repository"
import { listSpecFields } from "@/lib/data-access/repositories/spec-field-repository"
import { permissions } from "@/lib/domain/auth/permissions"
import { createProductAction } from "../actions"
import { ProductForm } from "../product-form"

export const metadata = { title: "New product" }

export default async function NewProductPage() {
  const supabase = await createSupabaseServerClient()
  const profile = await getCurrentProfile(supabase)
  if (!profile || !permissions.canEditProducts(profile.role)) {
    redirect("/admin/products")
  }

  const specFields = await listSpecFields(supabase)

  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-ink">New product</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Saved as a draft first — you can add photos and publish once it&apos;s ready.
      </p>
      <div className="mt-6">
        <ProductForm specFields={specFields} action={createProductAction} />
      </div>
    </div>
  )
}
