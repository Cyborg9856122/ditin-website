import { LoginForm } from "./login-form"

export const metadata = {
  title: "Admin login",
}

export default async function LoginPage(props: PageProps<"/admin/login">) {
  const searchParams = await props.searchParams
  const nextParam = searchParams.next
  const next = typeof nextParam === "string" ? nextParam : "/admin"

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-neutral-50 px-6">
      <div className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="font-measured text-xs uppercase tracking-[0.3em] text-brand-green">
          Ditin Displays
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-brand-ink">
          Admin sign in
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Staff access only. Accounts are created by the Owner.
        </p>
        <LoginForm next={next} />
      </div>
    </main>
  )
}
