import { type NextRequest } from "next/server"
import { updateSession } from "@/lib/data-access/supabase/middleware"

// Next.js 16 renamed this file/export to proxy.ts/proxy() and switched its
// default runtime to Node.js. Netlify's build plugin doesn't yet support
// bundling that as an edge function, so this stays on the older
// middleware.ts/middleware() convention (still supported, Edge runtime),
// which Netlify's adapter handles correctly.
export async function middleware(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
