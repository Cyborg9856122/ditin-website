"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { brand } from "@/lib/config/brand"
import { createSupabaseBrowserClient } from "@/lib/data-access/supabase/client"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("saving")
    setError(null)

    const formData = new FormData(e.currentTarget)
    const password = formData.get("password")
    const confirm = formData.get("confirm")

    if (typeof password !== "string" || password.length < 8) {
      setError("Password must be at least 8 characters.")
      setStatus("error")
      return
    }
    if (password !== confirm) {
      setError("Passwords don't match.")
      setStatus("error")
      return
    }

    const supabase = createSupabaseBrowserClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(
        "Couldn't update your password. The reset link may have expired — request a new one.",
      )
      setStatus("error")
      return
    }

    router.push("/admin")
  }

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-neutral-50 px-6">
      <div className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
        <Image
          src="/brand/ditin-displays-primary.png"
          alt={brand.logo.fullName}
          width={220}
          height={94}
          priority
          className="mx-auto h-12 w-auto"
        />
        <h1 className="mt-5 text-center text-2xl font-semibold text-brand-ink">
          Set a new password
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-brand-ink">
              New password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirm" className="text-sm font-medium text-brand-ink">
              Confirm password
            </label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              required
              minLength={8}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={status === "saving"}
            className="mt-2 rounded-md bg-brand-green px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {status === "saving" ? "Saving…" : "Save password"}
          </button>
        </form>
      </div>
    </main>
  )
}
