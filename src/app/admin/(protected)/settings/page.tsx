import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/data-access/supabase/server"
import { getCurrentProfile } from "@/lib/data-access/repositories/profile-repository"
import { listSpecFields } from "@/lib/data-access/repositories/spec-field-repository"
import { permissions } from "@/lib/domain/auth/permissions"
import { SpecFieldsManager } from "./spec-fields-manager"

export const metadata = { title: "Settings" }

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient()
  const profile = await getCurrentProfile(supabase)
  if (!profile || !permissions.canManageSiteSettings(profile.role)) {
    redirect("/admin")
  }

  const fields = await listSpecFields(supabase)

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-brand-ink">Settings</h1>
      <p className="mt-1 text-sm text-neutral-500">Owner-only.</p>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Specification fields
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          These show up automatically on every product&apos;s edit form, and on the public
          product page for any product where they have a value. Fields left blank on a product
          are hidden there entirely.
        </p>
        <div className="mt-4">
          <SpecFieldsManager fields={fields} />
        </div>
      </section>
    </div>
  )
}
