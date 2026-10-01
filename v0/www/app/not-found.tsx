import { NotFoundContent } from "./components/not-found-content"
import { SiteFooter } from "./components/footer"
import { SiteHeader } from "./components/header"

/** Unknown addresses render with the root layout only, so the frame is added here. */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <NotFoundContent />
      <SiteFooter />
    </>
  )
}
