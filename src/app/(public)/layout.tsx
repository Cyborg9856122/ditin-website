import { SiteHeader } from "./site-header"
import { SiteFooter } from "./site-footer"

export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </>
  )
}
