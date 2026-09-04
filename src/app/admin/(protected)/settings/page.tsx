import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/data-access/supabase/server"
import { getCurrentProfile } from "@/lib/data-access/repositories/profile-repository"
import {
  listSpecFieldOptionsForFields,
  listSpecFields,
} from "@/lib/data-access/repositories/spec-field-repository"
import { permissions } from "@/lib/domain/auth/permissions"
import { SpecFieldsManager } from "./spec-fields-manager"

export const metadata = { title: "Settings" }

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient()
  const profile = await getCurrentProfile(supabase)
  if (!profile || !permissions.canManageSiteSettings(profile.role)) {
    redirect("/admin")
  }

  const fields = await listSpecFields(supabase, { includeArchived: true })
  const optionsMap = await listSpecFieldOptionsForFields(
    supabase,
    fields.map((f) => f.id),
  )
  const optionsByField = Object.fromEntries(optionsMap)

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-brand-ink">Settings</h1>
      <p className="mt-1 text-sm text-neutral-500">Owner-only.</p>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Product specifications
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          One shared library of specification fields — every field works the same way,
          whatever its type. They show up automatically on the product edit form, and on the
          public product page for any product where they have a value. Archive a field to
          retire it without losing the values already saved on products.
        </p>
        <div className="mt-4">
          <SpecFieldsManager fields={fields} optionsByField={optionsByField} />
        </div>
      </section>
    </div>
  )
}
