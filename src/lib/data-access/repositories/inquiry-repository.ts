import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/data-access/supabase/database.types"
import type { Inquiry, InquiryStatus } from "@/lib/domain/types"
import type { InquiryFormValues } from "@/lib/domain/validation/inquiry-schema"

export async function createInquiry(
  supabase: SupabaseClient<Database>,
  values: InquiryFormValues,
): Promise<Inquiry> {
  const { data, error } = await supabase
    .from("inquiries")
    .insert(values)
    .select("*")
    .single()

  if (error) throw new Error(`createInquiry failed: ${error.message}`)
  return data
}

export async function listInquiries(
  supabase: SupabaseClient<Database>,
  filters: { status?: InquiryStatus } = {},
): Promise<Inquiry[]> {
  let query = supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })

  if (filters.status) query = query.eq("status", filters.status)

  const { data, error } = await query
  if (error) throw new Error(`listInquiries failed: ${error.message}`)
  return data
}

export async function getInquiryById(
  supabase: SupabaseClient<Database>,
  id: string,
): Promise<Inquiry | null> {
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) throw new Error(`getInquiryById failed: ${error.message}`)
  return data
}

export async function updateInquiryStatus(
  supabase: SupabaseClient<Database>,
  id: string,
  status: InquiryStatus,
): Promise<Inquiry> {
  const { data, error } = await supabase
    .from("inquiries")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single()

  if (error) throw new Error(`updateInquiryStatus failed: ${error.message}`)
  return data
}

export async function countInquiriesByStatus(
  supabase: SupabaseClient<Database>,
): Promise<Record<InquiryStatus, number>> {
  const { data, error } = await supabase.from("inquiries").select("status")
  if (error) throw new Error(`countInquiriesByStatus failed: ${error.message}`)

  const counts: Record<InquiryStatus, number> = {
    new: 0,
    contacted: 0,
    quoted: 0,
    won: 0,
    lost: 0,
  }
  for (const row of data) counts[row.status]++
  return counts
}
