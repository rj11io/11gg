import Link from "next/link"
import { Fragment } from "react"

import { rootSection, sectionTree } from "@content/registry"
import { sectionHref } from "@content/routes"
import type { Section } from "@content/types"
import { absoluteUrl, siteName } from "@/lib/site"

export type CrumbItem = { name: string; href: string }

/** Home, every ancestor, the section: the items the visual crumbs and the structured data share. */
export function sectionCrumbItems(section: Section): CrumbItem[] {
  return sectionTree.ancestors(section.id).map((item) => ({
    name: item.id === rootSection.id ? siteName : item.title,
    href: sectionHref(sectionTree.path(item.id)),
  }))
}

/**
 * The breadcrumb as search engines read it: a BreadcrumbList in JSON-LD, so a
 * result can show the path a page sits on. Pass the same items the visual
 * crumbs show, the current page last.
 */
export function BreadcrumbJsonLd({ items }: { items: CrumbItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  }
  return (
    <script
      type="application/ld+json"
      // Structured data is ours, built from the tree and the registry; the
      // only escaping needed is the closing tag, which no title contains.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replaceAll("</", "<\\/") }}
    />
  )
}

const linkClass =
  "underline-offset-4 hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"

/**
 * The section part of a breadcrumb: Home, then every ancestor, then the
 * section itself. Renders nothing at the root, so a single-section site shows
 * exactly the crumbs it always did. With current set, the section is the
 * page and is written as text instead of a link.
 */
export function SectionCrumbs({ section, current = false }: { section: Section; current?: boolean }) {
  if (section.id === rootSection.id) return null
  const chain = sectionTree.ancestors(section.id)

  return (
    <>
      {chain.map((item, index) => {
        const last = index === chain.length - 1
        const label = item.id === rootSection.id ? "Home" : item.title
        return (
          <Fragment key={item.id}>
            <li aria-current={last && current ? "page" : undefined} className={last && current ? "text-foreground" : undefined}>
              {last && current ? label : (
                <Link href={sectionHref(sectionTree.path(item.id))} className={linkClass}>{label}</Link>
              )}
            </li>
            {last && current ? null : <li aria-hidden="true">/</li>}
          </Fragment>
        )
      })}
    </>
  )
}
