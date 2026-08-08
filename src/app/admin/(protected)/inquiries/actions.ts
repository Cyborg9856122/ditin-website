"use server"

import { revalidatePath } from "next/cache"
import { createSupabaseServerClient } from "@/lib/data-access/supabase/server"
import { getCurrentProfile } from "@/lib/data-access/repositories/profile-repository"
import { updateInquiryStatus } from "@/lib/data-access/repositories/inquiry-repository"
import { permissions } from "@/lib/domain/auth/permissions"
import type { InquiryStatus } from "@/lib/domain/types"

export async function updateInquiryStatusAction(
  inquiryId: string,
  status: InquiryStatus,
) {
  const supabase = await createSupabaseServerClient()
  const profile = await getCurrentProfile(supabase)
  if (!profile || !permissions.canUpdateInquiryStatus(profile.role)) {
    throw new Error("You don't have permission to do that.")
  }

  await updateInquiryStatus(supabase, inquiryId, status)
  revalidatePath("/admin/inquiries")
  revalidatePath(`/admin/inquiries/${inquiryId}`)
}
