import { SiteFooter } from "@/app/components/footer"
import { SiteHeader } from "@/app/components/header"

/**
 * The main frame: header above, footer below, every page in between. The
 * group adds nothing to the address. Pages that need a different frame go in
 * another group beside this one and reuse the root layout alone.
 */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  )
}
