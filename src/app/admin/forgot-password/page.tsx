"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { brand } from "@/lib/config/brand"
import { createSupabaseBrowserClient } from "@/lib/data-access/supabase/client"

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sending")

    const email = new FormData(e.currentTarget).get("email")
    if (typeof email !== "string" || !email) {
      setStatus("error")
      return
    }

    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    })

    setStatus(error ? "error" : "sent")
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
          Reset password
        </h1>

        {status === "sent" ? (
          <p className="mt-4 text-sm text-neutral-600">
            If an account exists for that email, a reset link is on its way. Check your
            inbox.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-brand-ink">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none transition-colors duration-150 hover:border-neutral-400 focus:border-brand-green focus:ring-1 focus:ring-brand-green"
              />
            </div>

            {status === "error" ? (
              <p className="text-sm text-red-600">
                Something went wrong. Try again in a moment.
              </p>
            ) : null}

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-2 rounded-md bg-brand-green px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:-translate-y-px hover:opacity-90 active:translate-y-0 active:opacity-100 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {status === "sending" ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}

        <Link
          href="/admin/login"
          className="mt-6 block rounded px-1 py-0.5 text-center text-sm text-neutral-500 underline transition-all duration-150 hover:bg-neutral-100 hover:no-underline active:scale-95"
        >
          Back to sign in
        </Link>
      </div>
    </main>
  )
}
