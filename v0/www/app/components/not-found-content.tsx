import Link from "next/link"

import { homeHref } from "@/lib/section-routes"
import { browseContentHref } from "@content/routes"

/**
 * The 404 page body, shared by the root not-found (unknown addresses, rendered
 * with the root layout alone, so it brings its own frame) and the (main)
 * not-found (a known route that found nothing).
 *
 * Served for every unknown address: a mistyped path, a draft's address, or a
 * removed page with no redirect. Both ways onward are site-wide: the landing
 * page the site actually has, and the root browse, which covers every section. Every content route sets dynamicParams to
 * false, so this page does real work. See urls-and-redirects in the docs
 * publication before deleting anything with an address.
 */
export function NotFoundContent() {
  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto w-full max-w-2xl px-6 py-24 text-center">
        <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          404
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-foreground">
          This page does not exist
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          The address may be mistyped, or the page may have moved or been
          unpublished.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={homeHref}
            className="border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors outline-none hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring"
          >
            Go to the home page
          </Link>
          <Link
            href={browseContentHref("posts")}
            className="bg-foreground px-4 py-2 text-sm font-semibold text-background transition-colors outline-none hover:bg-foreground/85 focus-visible:ring-2 focus-visible:ring-ring"
          >
            Browse all posts
          </Link>
        </div>
      </div>
    </main>
  )
}
