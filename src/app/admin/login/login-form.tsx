"use client"

import { useActionState } from "react"
import Link from "next/link"
import { signIn, type LoginState } from "./actions"

const initialState: LoginState = { error: null }

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(signIn, initialState)

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-brand-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none transition-colors duration-150 hover:border-neutral-400 focus:border-brand-green focus:ring-1 focus:ring-brand-green"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-brand-ink">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none transition-colors duration-150 hover:border-neutral-400 focus:border-brand-green focus:ring-1 focus:ring-brand-green"
        />
      </div>

      {state?.error ? (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-md bg-brand-green px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:-translate-y-px hover:opacity-90 active:translate-y-0 active:opacity-100 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>

      <Link
        href="/admin/forgot-password"
        className="rounded px-1 py-0.5 text-center text-xs text-neutral-500 underline transition-all duration-150 hover:bg-neutral-100 hover:no-underline active:scale-95"
      >
        Forgot password?
      </Link>
    </form>
  )
}
