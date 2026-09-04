import Link from "next/link"
import { createSupabaseServerClient } from "@/lib/data-access/supabase/server"
import { listInquiries } from "@/lib/data-access/repositories/inquiry-repository"
import { INQUIRY_STATUS_LABELS, type InquiryStatus } from "@/lib/domain/types"

export const metadata = { title: "Inquiries" }

const STATUS_STYLES: Record<InquiryStatus, string> = {
  new: "bg-blue-50 text-blue-700",
  contacted: "bg-amber-50 text-amber-700",
  quoted: "bg-purple-50 text-purple-700",
  won: "bg-brand-green/10 text-brand-green",
  lost: "bg-neutral-100 text-neutral-500",
}

export default async function InquiriesPage(props: PageProps<"/admin/inquiries">) {
  const searchParams = await props.searchParams
  const statusParam = searchParams.status
  const status = (Array.isArray(statusParam) ? statusParam[0] : statusParam) as
    | InquiryStatus
    | undefined

  const supabase = await createSupabaseServerClient()
  const inquiries = await listInquiries(supabase, { status })

  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-ink">Inquiries</h1>

      <form className="mt-6 flex flex-wrap gap-3 text-sm" method="get">
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-md border border-neutral-300 px-3 py-1.5 transition-colors duration-150 hover:border-neutral-400 focus:border-brand-green"
        >
          <option value="">All statuses</option>
          {Object.entries(INQUIRY_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-neutral-700 transition-all duration-150 hover:bg-neutral-100 active:scale-95"
        >
          Filter
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Company</th>
              <th className="px-4 py-2 font-medium">Rent/buy</th>
              <th className="px-4 py-2 font-medium">Received</th>
              <th className="px-4 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-400">
                  No inquiries yet.
                </td>
              </tr>
            ) : (
              inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/inquiries/${inquiry.id}`}
                      className="font-medium text-brand-ink transition-colors duration-150 hover:text-brand-green active:opacity-70"
                    >
                      {inquiry.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{inquiry.company || "—"}</td>
                  <td className="px-4 py-3 text-neutral-600 capitalize">
                    {inquiry.rent_or_buy}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">
                    {new Date(inquiry.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[inquiry.status]}`}
                    >
                      {INQUIRY_STATUS_LABELS[inquiry.status]}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
