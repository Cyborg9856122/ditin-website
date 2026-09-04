import { notFound } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/data-access/supabase/server"
import { getCurrentProfile } from "@/lib/data-access/repositories/profile-repository"
import { getInquiryById } from "@/lib/data-access/repositories/inquiry-repository"
import { getProductById } from "@/lib/data-access/repositories/product-repository"
import {
  INQUIRY_STATUS_LABELS,
  PLACEMENT_LABELS,
  PRODUCT_CATEGORY_LABELS,
  type InquiryStatus,
} from "@/lib/domain/types"
import { permissions } from "@/lib/domain/auth/permissions"
import { updateInquiryStatusAction } from "../actions"

export const metadata = { title: "Inquiry" }

export default async function InquiryDetailPage(props: PageProps<"/admin/inquiries/[id]">) {
  const { id } = await props.params

  const supabase = await createSupabaseServerClient()
  const [profile, inquiry] = await Promise.all([
    getCurrentProfile(supabase),
    getInquiryById(supabase, id),
  ])
  if (!profile || !inquiry) notFound()

  const relatedProduct = inquiry.product_id
    ? await getProductById(supabase, inquiry.product_id)
    : null

  const canUpdate = permissions.canUpdateInquiryStatus(profile.role)

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-brand-ink">{inquiry.name}</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Received {new Date(inquiry.created_at).toLocaleString()}
      </p>

      {canUpdate ? (
        <form className="mt-4 flex items-center gap-2">
          <span className="text-sm text-neutral-500">Status:</span>
          {(Object.keys(INQUIRY_STATUS_LABELS) as InquiryStatus[]).map((s) => (
            <StatusButton key={s} inquiryId={id} status={s} active={inquiry.status === s} />
          ))}
        </form>
      ) : (
        <p className="mt-4 text-sm text-neutral-600">
          Status: <strong>{INQUIRY_STATUS_LABELS[inquiry.status]}</strong>
        </p>
      )}

      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 rounded-lg border border-neutral-200 bg-white p-6 text-sm">
        <Field label="Company" value={inquiry.company} />
        <Field label="Phone / WhatsApp" value={inquiry.phone_whatsapp} mono />
        <Field label="Email" value={inquiry.email} />
        <Field label="Rent or buy" value={inquiry.rent_or_buy} capitalize />
        <Field
          label="Screen type"
          value={inquiry.screen_type ? PRODUCT_CATEGORY_LABELS[inquiry.screen_type] : null}
        />
        <Field
          label="Indoor/outdoor"
          value={inquiry.indoor_or_outdoor ? PLACEMENT_LABELS[inquiry.indoor_or_outdoor] : null}
        />
        <Field label="Approx. size" value={inquiry.approx_size} mono />
        <Field label="Budget" value={inquiry.budget} mono />
        {inquiry.rent_or_buy === "rent" ? (
          <>
            <Field label="Rental start" value={inquiry.rental_start_date} mono />
            <Field label="Rental end" value={inquiry.rental_end_date} mono />
          </>
        ) : null}
        <div className="col-span-2">
          <dt className="text-neutral-500">Purpose</dt>
          <dd className="mt-1 whitespace-pre-wrap text-brand-ink">
            {inquiry.purpose || "—"}
          </dd>
        </div>
        {relatedProduct ? (
          <div className="col-span-2">
            <dt className="text-neutral-500">Asked about</dt>
            <dd className="mt-1 text-brand-ink">{relatedProduct.name}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  )
}

function StatusButton({
  inquiryId,
  status,
  active,
}: {
  inquiryId: string
  status: InquiryStatus
  active: boolean
}) {
  return (
    <form action={updateInquiryStatusAction.bind(null, inquiryId, status)}>
      <button
        type="submit"
        disabled={active}
        className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 ${
          active
            ? "bg-brand-ink text-white"
            : "border border-neutral-300 text-neutral-600 hover:bg-neutral-100 active:scale-95"
        }`}
      >
        {INQUIRY_STATUS_LABELS[status]}
      </button>
    </form>
  )
}

function Field({
  label,
  value,
  mono,
  capitalize,
}: {
  label: string
  value: string | null | undefined
  mono?: boolean
  capitalize?: boolean
}) {
  return (
    <div>
      <dt className="text-neutral-500">{label}</dt>
      <dd
        className={`mt-1 text-brand-ink ${mono ? "font-measured" : ""} ${capitalize ? "capitalize" : ""}`}
      >
        {value || "—"}
      </dd>
    </div>
  )
}
