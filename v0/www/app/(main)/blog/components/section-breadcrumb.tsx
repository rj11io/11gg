import Link from "next/link"
import { Fragment } from "react"

import { rootSection, sectionTree } from "@content/registry"
import { sectionHref } from "@content/routes"
import type { Section } from "@content/types"

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
