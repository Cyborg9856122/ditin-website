"use server"

import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/data-access/supabase/server"

export type LoginState = {
  error: string | null
}

export async function signIn(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email")
  const password = formData.get("password")
  const next = formData.get("next")

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return { error: "Enter your email and password." }
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: "Incorrect email or password." }
  }

  const redirectTo =
    typeof next === "string" && next.startsWith("/admin") ? next : "/admin"
  redirect(redirectTo)
}
