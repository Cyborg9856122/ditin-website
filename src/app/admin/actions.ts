"use server"

import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/data-access/supabase/server"

export async function signOut() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect("/admin/login")
}
