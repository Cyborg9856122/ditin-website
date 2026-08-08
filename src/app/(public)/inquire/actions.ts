"use server"

import { createSupabaseServerClient } from "@/lib/data-access/supabase/server"
import { createInquiry } from "@/lib/data-access/repositories/inquiry-repository"
import { inquiryFormSchema } from "@/lib/domain/validation/inquiry-schema"

export type InquiryFormState = {
  status: "idle" | "success" | "error"
  error?: string
  fieldErrors?: Record<string, string>
}

const initialState: InquiryFormState = { status: "idle" }

export { initialState as inquiryInitialState }

export async function submitInquiryAction(
  _prevState: InquiryFormState,
  formData: FormData,
): Promise<InquiryFormState> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = inquiryFormSchema.safeParse(raw)

  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors
    const fieldErrors: Record<string, string> = {}
    for (const [key, messages] of Object.entries(flat)) {
      if (messages?.[0]) fieldErrors[key] = messages[0]
    }
    return { status: "error", error: "Check the fields below.", fieldErrors }
  }

  try {
    // Public submission — no session required. The `inquiries_insert_anyone`
    // RLS policy allows this for both anon and authenticated roles.
    const supabase = await createSupabaseServerClient()
    await createInquiry(supabase, parsed.data)
  } catch (err) {
    return {
      status: "error",
      error: err instanceof Error ? err.message : "Something went wrong. Try again.",
    }
  }

  return { status: "success" }
}
