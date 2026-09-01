import Image from "next/image"
import { brand } from "@/lib/config/brand"
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
        <Image
          src="/brand/ditin-displays-primary.png"
          alt={brand.logo.fullName}
          width={220}
          height={94}
          priority
          className="h-12 w-auto"
        />
        <h1 className="mt-5 text-2xl font-semibold text-brand-ink">
          Admin sign in
        </h1>
        <LoginForm next={next} />
      </div>
    </main>
  )
}
